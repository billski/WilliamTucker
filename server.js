import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Allow requests from the static site on DreamHost
app.use((req, res, next) => {
  const allowed = [
    'https://williamtucker.ca',
    'https://www.williamtucker.ca',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  const origin = req.headers.origin;
  if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.static(__dirname));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT_PATH = join(__dirname, 'prompts', 'chatbot-system.md');
let SYSTEM_PROMPT;
try {
  SYSTEM_PROMPT = readFileSync(SYSTEM_PROMPT_PATH, 'utf8').trim();
  if (!SYSTEM_PROMPT) {
    throw new Error(`${SYSTEM_PROMPT_PATH} is empty`);
  }
} catch (err) {
  console.error(`FATAL: failed to load chatbot system prompt from ${SYSTEM_PROMPT_PATH}`);
  console.error(err.message);
  process.exit(1);
}

// Simple in-memory rate limiter: 15 requests per IP per minute
const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const window = 60_000;
  const max = 15;
  const times = (rateLimitMap.get(ip) || []).filter(t => now - t < window);
  times.push(now);
  rateLimitMap.set(ip, times);
  return times.length > max;
}

app.get('/health', (req, res) => {
  res.json({ ok: true, apiKeySet: !!process.env.ANTHROPIC_API_KEY });
});

app.post('/api/chat', async (req, res) => {
  const ip = req.ip || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment.' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  // Sanitise and cap history
  const history = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: history,
    });
    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again or email william@williamtucker.ca.' });
  }
});

// ---- Contact form: /api/contact -----------------------------------------
// Drops a row into the WTSAdmin contacts table (upsert on email), emails
// William a notification, and sends the lead an auto-reply. The form on
// contact.html POSTs JSON here.

let _supabase = null;
function getSupabaseAdmin() {
  if (_supabase) return _supabase;
  const url = process.env.WTSADMIN_SUPABASE_URL;
  const key = process.env.WTSADMIN_SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error(
      'WTSADMIN_SUPABASE_URL or WTSADMIN_SUPABASE_SERVICE_KEY is not set'
    );
  }
  _supabase = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabase;
}

let _resend = null;
function getResend() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  _resend = new Resend(key);
  return _resend;
}

function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Dev/staging fallback: skip verification if no secret is configured.
    // Production deploys MUST set TURNSTILE_SECRET_KEY (Railway env vars).
    console.warn('[contact] TURNSTILE_SECRET_KEY not set — skipping verification');
    return true;
  }
  if (!token) return false;
  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const r = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: form }
    );
    const data = await r.json();
    return data.success === true;
  } catch (err) {
    console.error('[contact] Turnstile verify error:', err.message);
    return false;
  }
}

app.post('/api/contact', async (req, res) => {
  const ip = req.ip || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment.' });
  }

  const body = req.body || {};
  const {
    name,
    email,
    company,
    service_interest,
    message,
    _gotcha,
    turnstileToken,
  } = body;

  // Honeypot: pretend success so bots don't retry
  if (_gotcha) return res.json({ ok: true });

  // Validate
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ error: 'Please include a brief message.' });
  }

  // Spam check
  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return res.status(403).json({
      error: 'Spam check failed. Please refresh the page and try again.',
    });
  }

  // Sanitize
  const cleanName = name.trim().slice(0, 200);
  const cleanEmail = email.trim().toLowerCase().slice(0, 200);
  const cleanCompany = ((company || '') + '').trim().slice(0, 200) || null;
  const cleanMessage = message.trim().slice(0, 5000);
  const cleanService = ((service_interest || '') + '').trim().slice(0, 100) || null;
  const today = new Date().toISOString().slice(0, 10);
  const noteBlock = [
    `[${today}] Website inquiry`,
    cleanService ? `Service interest: ${cleanService}` : null,
    cleanMessage,
  ]
    .filter(Boolean)
    .join('\n');

  // Upsert into WTSAdmin.contacts on email
  let contactId = null;
  let supabaseError = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: lookupErr } = await supabase
      .from('contacts')
      .select('id, notes')
      .eq('email', cleanEmail)
      .maybeSingle();
    if (lookupErr) throw new Error(lookupErr.message);

    if (existing) {
      const newNotes = existing.notes
        ? `${existing.notes}\n\n${noteBlock}`
        : noteBlock;
      const { error } = await supabase
        .from('contacts')
        .update({ notes: newNotes })
        .eq('id', existing.id);
      if (error) throw new Error(error.message);
      contactId = existing.id;
    } else {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          source: 'website',
          status: 'lead',
          notes: noteBlock,
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      contactId = data.id;
    }
  } catch (err) {
    supabaseError = err.message;
    console.error('[contact] Supabase write failed:', supabaseError);
    // Don't fail the request — the email path below is the backup record.
  }

  // Notification + auto-reply (best-effort)
  try {
    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@williamtucker.ca';
    const fromAddress = `William Tucker Solutions <${fromEmail}>`;
    const notifyEmail = process.env.WTSADMIN_NOTIFY_EMAIL || 'william@williamtucker.ca';
    const adminLink = contactId
      ? `https://admin.williamtucker.ca/contacts/${contactId}`
      : null;

    await resend.emails.send({
      from: fromAddress,
      to: notifyEmail,
      replyTo: cleanEmail,
      subject: `New website enquiry from ${cleanName}${cleanService ? ` — ${cleanService}` : ''}`,
      text: [
        'New enquiry from williamtucker.ca',
        '',
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        cleanCompany ? `Company: ${cleanCompany}` : null,
        cleanService ? `Service interest: ${cleanService}` : null,
        '',
        'Message:',
        cleanMessage,
        '',
        adminLink ? `Contact in admin: ${adminLink}` : '(Supabase write failed — see server logs)',
      ]
        .filter(Boolean)
        .join('\n'),
    });

    const firstName = cleanName.split(/\s+/)[0];
    await resend.emails.send({
      from: fromAddress,
      to: cleanEmail,
      subject: `Got your message — I'll reply within 1 business day`,
      text: [
        `Hi ${firstName},`,
        '',
        `Thanks for reaching out. I got your message${
          cleanService ? ` about ${cleanService.toLowerCase()}` : ''
        } and I'll reply within 1 business day.`,
        '',
        'If something urgent comes up in the meantime, you can also reach me directly at william@williamtucker.ca.',
        '',
        '— William',
        '',
        '--',
        'William Tucker Solutions',
        'AI-accelerated software development, training & workflow automation',
        'williamtucker.ca',
      ].join('\n'),
    });
  } catch (err) {
    console.error('[contact] Email send failed:', err.message);
    // Best-effort: the lead is in the DB; we'll catch up manually if email broke.
  }

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`William Tucker Solutions server running at http://localhost:${PORT}`);
});
