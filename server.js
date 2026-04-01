import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the AI assistant for William Tucker Solutions, an AI consulting firm run by William Tucker — a senior software engineer based in Kelowna, BC with 12+ years of experience.

William Tucker Solutions helps finance teams and small businesses apply AI practically and pragmatically. Services:
- AI Strategy & Roadmapping: Assess workflows, identify highest-ROI opportunities, deliver an actionable phased roadmap
- AI Implementation & Prototyping: Build working proofs of concept and integrate AI into existing systems — production-grade, not just demos
- Fractional AI Advisor: Ongoing strategic guidance and mentoring on a flexible monthly retainer
- Training & Workshops: Hands-on sessions to get teams confident with AI tools

Key differentiators:
- Vendor-agnostic: no platform affiliations or commission-driven recommendations
- Senior engineer does the work — the person you meet is the person who builds it
- Every engagement includes documentation and knowledge transfer so clients own the outcome
- No hype: honest about where AI fits and where it doesn't

Notable work:
- Modernized a university facilities system (15 Classic ASP files → .NET 8 Blazor Server) in 2 days using AI agents, zero breaking changes
- Replaced a 705,714-line Oracle PL/SQL room booking system with a modern responsive .NET 8 app in 8 days

First step for any visitor is a free 30-minute discovery call — no pressure, no obligation. They can book at williamtucker.ca/contact.html or email william@williamtucker.ca.

Be helpful, honest, and concise. Don't make up specific pricing — tell visitors to book a call to discuss scope and cost. Keep responses under 150 words unless the question genuinely requires more detail.`;

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
