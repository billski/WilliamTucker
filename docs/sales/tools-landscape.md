# AI / Workflow Tools Landscape — WTS Sales Reference

Internal sales ammunition. Goal: never get caught off guard when a prospect mentions a tool. For each tool: what it is in plain English, where it fits in the stack, how it relates to what WTS offers, and the canonical line to say when it comes up.

This is *not* a recommendation list — many of these compete for or complement the same problem space. Knowing them lets you speak fluently and position cleanly without trash-talking competitors.

**How to use this doc:**
- Read it once cold so the seven-layer model and the canonical lines are loaded.
- Reference it during prep before a discovery call.
- For a specific prospect, fork-and-tailor: copy this file into the prospect's folder and add a "Most likely to mention" ranking at the bottom based on what you know about them. See `D:\code\progression-capital\tools-landscape.md` for the worked example.
- Verify pricing and product details before quoting in conversation — this space moves fast and details go stale.

---

## How to think about the landscape — seven layers

Almost every "AI tool" a prospect might mention falls into one of seven layers:

1. **The model layer** — the actual AI brains. Claude, GPT, Gemini, Llama.
2. **The chat interface layer** — how humans talk to those models. Claude.ai, ChatGPT, Microsoft Copilot, Perplexity.
3. **The connector / integration layer** — how the AI sees other tools. MCP, Zapier, Make, Power Automate.
4. **The orchestration / automation layer** — what runs workflows on schedules or triggers. Same tools as layer 3 plus n8n, Workflow DevKit.
5. **The vertical / specialized tools** — meeting recorders, AI schedulers, AI inbox tools, AI sales tools. Each does one thing well.
6. **The agent framework layer** — for developers building custom multi-agent systems. LangChain, CrewAI, Anthropic Agent SDK.
7. **The vertical SaaS layer** — full products built on the above for specific industries.

When a prospect says "I'm hearing about X," figure out which layer X sits in. That's how you respond intelligently without bluffing.

---

## Layer 3-4: Workflow automation (most common to come up)

This is the layer most prospects are asking about when they say "implementing agents." It's the glue between Claude and everything else.

### Zapier
**What it is:** The household name. A no-code platform that connects 7,000+ apps via "Zaps" — when X happens in app A, do Y in app B. Anyone can build a Zap with a visual drag-and-drop interface. Has its own AI features (Zapier AI, Zapier Agents) bolted on.

**Where it fits:** Layer 3 + 4. Triggers (new email, new calendar event, form submission) → actions (send Slack message, create row in Google Sheet, call Claude API).

**Who uses it:** Non-technical operators at SMBs and mid-market. Marketing teams, RevOps, executive assistants. Probably half the executives in any peer network use Zapier daily without thinking about it.

**Pricing:** Tiered by task volume. Starts ~$30/month, real production usage often $200–1000+/month.

**How it relates to WTS:** Complementary. You'd *use* Zapier to build pieces of a workflow if it's the right tool — typically for the "front door" triggers and the simple "if-then" wiring. WTS doesn't compete with Zapier; WTS builds the stuff Zapier can't (custom MCP, custom RAG, custom Skills).

**If they mention it:** *"Zapier is the easiest way to wire common apps together — we'd use it for any workflow where a non-technical person needs to maintain it. It hits a wall when you need real intelligence in the middle of the workflow or when the cost of the task volume gets high. That's where direct Claude integration takes over."*

---

### Make (formerly Integromat)
**What it is:** Zapier's more powerful, more technical cousin. Same visual workflow concept but with branching logic, error handling, iteration, and more sophisticated data transformation. European-built, often cheaper than Zapier at scale.

**Where it fits:** Same layer as Zapier but for slightly more complex workflows.

**Who uses it:** Power users, agencies, technical founders. Common in the no-code consulting world.

**Pricing:** Cheaper than Zapier per operation. ~$10–300/month typical.

**If they mention it:** *"Make is the technical-power-user version of Zapier. Same idea, more flexible, cheaper at scale. We'd use it the same way."*

---

### n8n
**What it is:** Open-source, self-hostable workflow automation. Same concept as Zapier/Make but you host it yourself (or pay them to host it). Way more powerful for technical users — supports custom code blocks, complex branching, native AI nodes.

**Where it fits:** Layer 3 + 4. Most flexible of the three.

**Who uses it:** Developers, technical teams, anyone who wants automation without per-task pricing or who needs data to stay in their environment.

**Pricing:** Free if you self-host (just pay for the small server, ~$10–50/month). Cloud version starts ~$20/month.

**How it relates to WTS:** This is your preferred orchestration tool for serious builds. Self-hostable = privacy, no per-task pricing = cost-predictable, custom code blocks = can call Anthropic SDK directly.

**If they mention it:** *"n8n is what I'd reach for if we're building real workflow automation — it's open-source, self-hostable so your client data stays in your environment, and the per-task cost doesn't escalate the way Zapier's does. It's more technical to set up, which is what you'd hire me for."*

---

### Microsoft Power Automate
**What it is:** Microsoft's workflow automation, deeply integrated with Microsoft 365 (Outlook, Teams, SharePoint, Dynamics). Has AI features via Copilot integration.

**Where it fits:** Layer 3 + 4 for any prospect already on Microsoft 365.

**Who uses it:** Microsoft 365 enterprise customers. Almost certainly bundled with whatever Microsoft licensing they have.

**If they mention it:** *"Power Automate is the right answer if you're already paying for Microsoft 365 — it's likely included or cheap to add. It works best for Microsoft-to-Microsoft workflows. For anything heavier or anything Claude-specific, we'd usually pair it with n8n or direct Claude integration."*

---

### Workato, Tray.io, Pipedream
**What they are:** Enterprise-grade workflow platforms. Workato and Tray are aimed at IT/RevOps at larger companies (think 500+ employees). Pipedream is developer-focused.

**Likelihood of mention:** Low for boutique/SMB prospects. Higher for enterprise.

**If they come up:** Acknowledge them as enterprise alternatives, move on. Not usually a fit for SMB scale.

---

## Layer 1-2: AI chat platforms (the prospect probably already knows these)

### ChatGPT (OpenAI)
**What it is:** The product that started the AI mainstream conversation. OpenAI's flagship chatbot, available free or via ChatGPT Plus ($20/month) / Team / Enterprise. Has its own connector ecosystem ("GPTs", custom GPTs, ChatGPT plugins, recently their own MCP support).

**How it relates to Claude:** Direct competitor at the chat-interface layer. Different model family (GPT-4o, GPT-5), broadly similar capability, different style — GPT tends to be more "agreeable," Claude tends to be more careful and structured.

**If they mention it:** *"ChatGPT and Claude are roughly comparable for most knowledge work — the meaningful differences come down to (a) document handling and (b) how each handles long context. Claude tends to be better at staying grounded in source material you provide, which is the right property for work where every output has to trace back to something real. That's part of why people who care about audit-trail and accuracy pick Claude."*

**Don't:** Trash-talk ChatGPT. Many executives use it daily and feel ownership.

---

### Microsoft Copilot
**What it is:** Microsoft's AI assistant embedded across Microsoft 365 — Word, Excel, Outlook, Teams, etc. Powered by OpenAI models with Microsoft's own layer on top. Includes Copilot Studio for building custom agents.

**Where it fits:** If the prospect runs on Microsoft 365 (likely for most Canadian SMBs), Copilot is in their face daily whether they pay for it or not.

**Pricing:** Microsoft 365 Copilot is $30–40/user/month on top of base 365 licensing. Not cheap.

**How it relates to WTS:** Often a starting point for executives. *"I tried Copilot and it was OK for [X], but I want something that does [Y]."* You build the [Y].

**If they mention it:** *"Copilot is great for the obvious in-Office tasks — summarizing a Word doc, drafting a meeting agenda from a Teams call, basic Excel formula help. Where it falls short is anything that needs your firm's specific knowledge or that crosses outside the Microsoft ecosystem. That's the gap Claude + custom integrations fill."*

---

### Google Gemini / Google Workspace AI
**What it is:** Google's equivalent of Copilot — embedded in Gmail, Docs, Sheets, Meet. Powered by Gemini (Google's model family).

**If they mention it:** *"Same story as Copilot — solid for in-app help inside Google Workspace, limited outside it. If you're a Google Workspace shop, it's a reasonable starter. Doesn't replace what we'd build."*

---

### Perplexity
**What it is:** AI-powered search/research tool. Combines web search with LLM-generated answers + citations. Pro version ($20/month) gets you better models and more searches.

**Where it fits:** Research queries, fact-checking, market intelligence. Not a workflow tool.

**If they mention it:** *"Perplexity is the best replacement for googling something when you want a real answer with sources, not 10 blue links. Useful for research; doesn't fit into your daily workflow stack the way Claude does."*

---

### Anthropic Claude (your platform — three surfaces to know)

- **Claude.ai** — the consumer chat interface ($20/month Pro, $25/user Team, custom Enterprise)
- **Claude Cowork** — the enterprise/non-coder product layered on Claude.ai with Projects, Skills, connectors, file upload, MCP support. Where most non-technical buyers will live day-to-day.
- **Claude Code** — the developer-focused CLI tool (this is what you use to build for them).
- **Anthropic API / SDK** — direct programmatic access for custom builds.

**Important to know:** When a non-technical buyer says "Claude Cowork," they mean the no-code enterprise product. When you say "Claude," you might mean the API/SDK for custom builds. Same brain, different surfaces. Don't conflate.

---

## Layer 5: Meeting & transcription tools (very likely the prospect uses one)

### Otter.ai
**What it is:** Long-running market leader in meeting transcription. Joins your calls, transcribes in real time, generates summaries. Has its own AI chat over the transcript.

**Pricing:** Free tier (limited), Pro $17/month, Business $30/month.

**If they mention it:** *"Otter is the standard. We'd keep it if you're already using it — what we'd add is taking those Otter transcripts and feeding them straight into Claude with your firm's structured-extraction template, so instead of just having a transcript you have a populated draft ready to edit."*

---

### Fireflies.ai
**What it is:** Otter competitor. Same product category. Slightly more focus on sales-team workflows (CRM integration, deal coaching).

**If they mention it:** Same answer as Otter.

---

### Granola
**What it is:** Newer player, AI note-taker that runs locally on Mac, doesn't auto-join meetings (you take rough notes during the call, AI fills in from your computer's audio after). Generates clean structured notes. Cult following among consultants and execs.

**Pricing:** Free up to 25 notes/month, $18/month after.

**If they mention it:** *"Granola is what I'd recommend if you're starting fresh — it's less intrusive than Otter (no bot joining your calls), produces cleaner output, and integrates well with Claude. The structured note format it produces feeds straight into a Claude Skill that turns it into a structured draft."*

---

### Read.ai, Fathom, Notta, Krisp, Tactiq
Similar categories. Read.ai focuses on meeting analytics ("you talked 60% of the time"). Fathom is free for individuals. Notta is multilingual. Krisp does noise cancellation + transcription. Tactiq is browser-extension-based.

**If any come up:** *"Same product category as Otter — pick what fits your style. The integration with Claude is the same regardless of which transcription tool you use."*

---

## Layer 5: AI personal productivity / "AI chief of staff"

This is the lane most exec-level prospects are circling when they say *"my peers are looking for these solutions."* Most of these tools converge on the same four pillars: email, calendar, tasks, daily briefings.

### Motion
**What it is:** AI-powered calendar and project manager. You give it tasks with deadlines and priorities; it schedules them automatically into your calendar around your existing commitments. Auto-reschedules when things move.

**Pricing:** $19–34/month.

**If they mention it:** *"Motion solves the calendar-tetris problem if you're context-switching across many projects. We could integrate it into your stack — but most executives find it most useful for personal time management, not firm operations."*

---

### Reclaim.ai
**What it is:** Similar to Motion. Automatic calendar scheduling for tasks, habits, focus time, 1:1s. Integrates with Google Calendar / Outlook.

**Pricing:** Free tier, Pro $10/month.

**If they mention it:** Same as Motion.

---

### Superhuman (with AI features)
**What it is:** Premium email client ($30/month) that's been around forever, recently added strong AI drafting and triage. Loved by execs.

**If they mention it:** *"Superhuman is the gold standard if you're willing to pay for email speed. Their AI is solid for drafting. We can complement it — Claude can pull in firm context that Superhuman's AI doesn't have — but if you already use Superhuman, no need to replace it."*

---

### alfred_, Xembly, Prio, Mem
**What they are:** Newer "AI chief of staff" products. Each tries to be a single pane of glass for inbox + calendar + tasks + briefings. Quality varies; market is unsettled.

**If they mention any:** *"There's a wave of 'AI chief of staff' products right now — alfred, Xembly, Prio, Mem all in that space. They're competing for the same use case. The risk with any of them is vendor lock-in and the fact that the space is unsettled. Building it on Claude directly (with custom Skills + MCP) means you own the stack — you're not betting on any of these companies surviving."*

---

### Notion AI
**What it is:** AI features layered on top of Notion (the docs/wiki/database tool). If the prospect uses Notion, this is bolted on.

**If they mention it:** *"Notion AI is fine for working inside Notion. Doesn't help with cross-tool workflows. Complementary, not competitive."*

---

## Layer 5: AI sales / CRM / outreach (only if BD comes up)

### HubSpot AI / Salesforce Einstein
**What they are:** AI features inside the major CRMs. Lead scoring, email drafting from CRM context, summarization of deal histories.

**If their firm uses HubSpot/Salesforce:** They might already be using this. Acknowledge and position as *"useful for the CRM-internal stuff, doesn't replace what we'd build for cross-tool agent workflows."*

---

### Apollo, Clay, Lemlist, Outreach.io
**What they are:** AI-powered sales/outreach platforms. Lead enrichment, automated email sequences, prospect research. Clay is particularly hot — pulls from 100+ data sources to enrich prospect profiles.

**Likelihood of mention:** Higher for outbound-sales-driven firms; lower for referral-driven boutiques.

**If they come up:** *"These are pointed at outbound sales teams. If you ever want to systematize outbound, Clay is the most interesting one right now."*

---

## Layer 5: AI document / contract tools

### Spellbook, GC AI, Sirion, Justee
**What they are:** AI for legal/contract work. Spellbook is the leader (Word plugin that drafts and redlines contracts).

**Likelihood of mention:** Low unless the prospect's work touches contracts or legal review.

**If they come up:** *"Mostly for legal teams. If you wanted Claude to draft your contract-shaped documents, we'd just build that as a Skill — no need for a separate tool."*

---

## Layer 6: Agent framework / developer tools (only if the prospect has a technical friend)

### LangChain, LlamaIndex, CrewAI, AutoGen
**What they are:** Frameworks for *developers* building custom multi-agent AI systems. LangChain is the original (Python), CrewAI is newer and focuses on agent teams, AutoGen is Microsoft's take.

**Likelihood of mention:** Low — these are developer tools. But if a peer mentioned *"you should build this with LangChain,"* a non-technical prospect might bring it up.

**If they come up:** *"Those are developer frameworks, useful if I'm building you a custom multi-agent system. The user-facing experience is identical — what matters is what gets built, not what it's built with. For most of what you'd want, we'd use the Anthropic SDK directly or Anthropic's Workflow DevKit, which is purpose-built for this."*

---

### Microsoft Copilot Studio, Anthropic Workflow DevKit
**What they are:** Platforms for building agents. Copilot Studio is Microsoft's no-code agent builder. Workflow DevKit is Anthropic's developer SDK for durable workflows (workflows that survive crashes, can pause/resume, retry on failure).

**If they mention Copilot Studio:** *"If you're a heavy Microsoft 365 shop, it's worth a look — it lets non-technical staff build basic agents inside the Microsoft ecosystem. For anything substantial, building directly on Claude is more flexible."*

**If they mention Workflow DevKit:** *"That's the right tool for serious multi-step agent pipelines on Claude. I'd use it for any work where workflows need to survive over hours or days — like a multi-day approval or audit pipeline."*

---

## Layer 7: Vertical SaaS (per-prospect, sector-specific)

This layer is **prospect-specific** — the relevant vertical SaaS competitors depend entirely on the prospect's industry. Add the relevant ones when prepping for a specific prospect.

Examples from past prep:
- **SR&ED consulting:** Boast.AI, Chrono Innovation, GrowWise, NorthBridge, R&D Partners. (See `progression-capital/`.)
- *(Add other sectors here as they come up.)*

**General positioning when a vertical SaaS comes up:** *"They're building a software product for the [vertical] market. They're not what we'd build for you. What we'd build is Claude inside *your* practice using *your* data and *your* voice — they don't have access to either. Different model, both can coexist."*

**Don't:** Trash-talk vertical SaaS competitors. They're often respected companies. Position as "different model."

---

## Vector databases / RAG infrastructure (only if Tier 3 / RAG comes up)

### Pinecone
**What it is:** Managed vector database, market leader. Easy to set up, scales well, costs add up.

### Weaviate
**What it is:** Open-source vector DB, can self-host or use their cloud.

### Supabase pgvector
**What it is:** Postgres extension for vector storage. If you're already on Supabase (your existing stack), this is the natural choice.

### Qdrant, ChromaDB, Milvus
Other open-source options.

**If they ask about RAG infrastructure:** *"There are a few options — Pinecone is the easiest managed service, Supabase pgvector is what I'd recommend because it fits the rest of your stack and keeps costs predictable. The vector DB choice is a 30-minute decision once we know we're building RAG."*

---

## No-code AI app builders (rising in awareness)

### Lovable, Bolt, v0, Replit Agent
**What they are:** Tools that let non-developers describe an app in plain English and get working code generated. Lovable and Bolt are most hyped right now.

**Likelihood of mention:** Medium. Exec peer groups are hearing about these.

**If they mention any:** *"Those are great for prototyping — you can spin up a working app in an afternoon. For something you'd actually run as production infrastructure for your firm, you'd want a real engineer behind it. They're complementary to what I'd do, not competitive — I might use one to spin up an early prototype for you to react to before committing to a full build."*

---

## When a prospect mentions a tool you don't know

1. Don't bluff. *"I haven't used that one specifically — what's the use case you're seeing for it?"*
2. Once they describe the use case, position relative to the seven layers above (*"sounds like a layer-3 connector tool, similar to Zapier"* or *"that's a vertical SaaS in your space"*).
3. Tie back to the value WTS delivers: *"Whatever the right tool is for that piece, the work I'd do is wiring it into your full workflow with Claude in the middle making the judgment calls. The specific tool matters less than the integration."*

This is honest, doesn't pretend, and re-centers on actual value (integration + custom build) instead of tool-by-tool expertise.

---

## What WTS is *not* — and shouldn't pretend to be

Honest constraint reminder:

- **Not a Zapier expert.** Can use it but it's not the strongest tool. n8n is.
- **Not a Microsoft Copilot Studio specialist.** Claude specialist.
- **Not a sales-enablement consultant.** Not the right shop for Apollo/Clay/Lemlist.
- **Not a vendor reseller.** No kickbacks from any of these tools, which is a credibility advantage — every recommendation is on technical merit.

If a prospect wants something deep in a specific platform you don't know well, the right move is to say so and offer to either learn it or partner with someone who knows it. Honest beats bluffing every time.

---

## Tailoring this for a specific prospect

When prepping for a discovery call, copy this file into the prospect's folder and add at the bottom:

1. **"Most likely to mention" — ranked.** Based on what you know about their stack, peer group, and stated interests. (See `progression-capital/tools-landscape.md` for the worked example.)
2. **Vertical SaaS competitors specific to their industry.** Add to the Layer 7 section.
3. **Anything you can infer about their current stack** that changes which positioning lines apply (e.g., "they're on M365, so Power Automate is in-network").

Keep this canonical doc generic; do all the per-prospect work in the prospect's own copy.

---

## Update log

- **2026-05-03.** Extracted from `D:\code\progression-capital\tools-landscape.md` and genericized for reuse across prospects. Bruce/Progression-specific framings replaced with prospect-neutral language; "ranked likelihood" section removed (now lives in per-prospect copies).
