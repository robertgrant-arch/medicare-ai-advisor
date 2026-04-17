import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Medicare AI Advisor, a licensed-agent-supporting sales assistant for Medicare Advantage plans.

YOUR GOAL (in order):
1) Qualify the user quickly (ZIP, doctors, prescriptions, budget).
2) Recommend ONE best-fit Medicare Advantage plan (2 max).
3) Close: get them to start enrollment online or connect with a licensed agent at 1-800-555-0199.

STYLE RULES (strict):
- Keep every reply SHORT: max 3 short paragraphs OR 5 bullets. No walls of text.
- Plain, warm, human language. Talk like a trusted friend who sells Medicare.
- Never list data sources, citations, star-rating methodology, or carrier rosters in chat.
- Do NOT teach Medicare 101 unless the user explicitly asks.
- Never recommend more than 2 plans at once.
- Every reply ends with ONE clear next step (a question or a call-to-action), not a menu.
- No emojis unless the user uses them first.

CONVERSATION FLOW:
1. Opening: If you don't have the ZIP yet, ask for it. Nothing else.
2. Discovery: Once you have ZIP, ask in ONE message about (a) main doctor/clinic, (b) prescriptions, (c) monthly budget comfort.
3. Recommend: Present ONE best-fit plan in this shape:
   - Plan name - the single benefit that matches their top need
   - $X/mo premium, $Y out-of-pocket max
   - Covers their doctor / drug
   Then ask: "Want to start enrollment on this plan, or see one backup to compare?"
4. Close: If they show any interest, move them toward enrollment or a licensed agent. Do not re-explain.

SAFETY:
- Never give medical advice.
- If the user asks something you don't know, offer to connect them with a licensed agent at 1-800-555-0199.

REMEMBER: You are selling. Be confident, concise, and always moving toward the next step.`;

// --- Rate limiting (in-memory, resets on cold start) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// --- Input validation constants ---
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 40;

function sanitizeHistory(history: Array<{ role: string; content: string }>): Array<{ role: string; content: string }> {
  if (!history || history.length === 0) return [];
  const filtered: Array<{ role: string; content: string }> = [];
  for (const msg of history) {
    if (msg.role !== 'user' && msg.role !== 'assistant') continue;
    if (filtered.length > 0 && filtered[filtered.length - 1].role === msg.role) {
      filtered[filtered.length - 1].content += '\n' + msg.content;
    } else {
      filtered.push({ role: msg.role, content: msg.content });
    }
  }
  while (filtered.length > 0 && filtered[0].role !== 'user') {
    filtered.shift();
  }
  if (filtered.length > 0 && filtered[filtered.length - 1].role === 'user') {
    filtered.pop();
  }
  return filtered;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { message, history, userProfile, phase } = body as {
    message?: unknown;
    history?: unknown;
    userProfile?: Record<string, unknown>;
    phase?: string;
  };

  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message content required' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 });
  }

  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const contextMessage = userProfile && Object.keys(userProfile).length > 0
      ? `\n\nUser context: ${JSON.stringify(userProfile)}. Current phase: ${phase || 'welcome'}.`
      : '';

    const trimmedHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];
    const cleanHistory = sanitizeHistory(trimmedHistory.slice(-10) as Array<{ role: string; content: string }>);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + contextMessage },
      ...cleanHistory,
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Perplexity API error:', response.status, err);
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: err },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response.';

    const chips = extractChips(phase);
    const nextPhase = determinePhase(message, phase);
    const profileUpdate = extractProfileData(message);

    return NextResponse.json({
      message: aiMessage,
      source: 'Medicare AI Advisor',
      chips,
      phase: nextPhase,
      profileUpdate: Object.keys(profileUpdate).length > 0 ? profileUpdate : undefined,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractChips(phase?: string): string[] {
  const defaultChips: Record<string, string[]> = {
    welcome: ['Find plans in my area', 'I know my ZIP'],
    discovery: ['Show my best plan', 'I take prescriptions', 'I have a preferred doctor'],
    plan_search: ['Show my best match', 'Compare 2 plans'],
    comparison: ['Start enrollment', 'Talk to an agent'],
    deep_dive: ['Start enrollment', 'Talk to an agent'],
    enrollment: ['Continue enrollment', 'Talk to an agent'],
  };
  return defaultChips[phase || 'welcome'] || defaultChips.welcome;
}

function determinePhase(userMsg: string, currentPhase?: string): string {
  const msg = userMsg.toLowerCase();
  if (msg.includes('enroll') || msg.includes('sign up') || msg.includes('apply')) return 'enrollment';
  if (msg.includes('compare') || msg.includes('side by side') || msg.includes('difference')) return 'comparison';
  if (msg.includes('find plan') || msg.includes('search') || msg.includes('show me plans')) return 'plan_search';
  if (msg.includes('zip') || msg.includes('medication') || msg.includes('doctor') || msg.includes('budget')) return 'discovery';
  if (msg.includes('tell me more') || msg.includes('details') || msg.includes('coverage')) return 'deep_dive';
  return currentPhase || 'welcome';
}

function extractProfileData(userMsg: string): Record<string, string> {
  const profile: Record<string, string> = {};
  const zipMatch = userMsg.match(/\b\d{5}\b/);
  if (zipMatch) profile.zipCode = zipMatch[0];
  return profile;
}
