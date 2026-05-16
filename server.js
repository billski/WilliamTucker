import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Allow requests from the static site on DreamHost
app.use((req, res, next) => {
  const allowed = ['https://williamtucker.ca', 'https://www.williamtucker.ca'];
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`William Tucker Solutions server running at http://localhost:${PORT}`);
});
