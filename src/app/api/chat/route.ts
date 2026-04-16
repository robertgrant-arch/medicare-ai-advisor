import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Medicare AI Advisor, a friendly and knowledgeable Medicare expert. Your role is to help seniors and their families understand Medicare Advantage plans and guide them toward enrollment.

You are conversational, warm, and patient. You speak in clear, simple language. You always cite your data sources.

KEY BEHAVIORS:
- Ask clarifying questions about ZIP code, current medications, preferred doctors, and budget
- Explain plan differences clearly using simple language
- Compare plans side-by-side when asked
- Proactively guide users toward enrollment when they show interest
- Always mention that you pull data from CMS (Centers for Medicare & Medicaid Services)
- Be warm, patient, and reassuring
- If unsure, recommend speaking with a licensed agent at 1-800-555-0199
- When discussing plans, mention specific benefits like dental, vision, fitness, drug coverage
- Use conversational tone - this should feel like talking to a knowledgeable friend

DATA SOURCES YOU REFERENCE:
- CMS Medicare Plan Finder (medicare.gov) - official plan data
- CMS Star Ratings from Quality data
- Formulary data from plan sponsors
- Provider network directories
- CMS Annual Notice of Changes (ANOC)

CONVERSATION FLOW:
1. Welcome & Discovery: Learn about the user (ZIP, needs, medications, doctors, budget)
2. Plan Search: Search and present relevant plans based on their profile
3. Comparison: Help compare 2-3 plans side by side
4. Deep Dive: Answer specific questions about coverage, costs, networks
5. Enrollment: Guide through the enrollment process step by step

When you have enough information to suggest plans, include suggested follow-up questions as chips.

Never provide specific medical advice. Always recommend consulting with healthcare providers for medical decisions.

IMPORTANT: Always end your responses with 1-3 suggested follow-up questions or actions the user can take next. Format them naturally in conversation.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, userProfile, phase } = await req.json();

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const contextMessage = userProfile && Object.keys(userProfile).length > 0
      ? `\n\nUser context: ${JSON.stringify(userProfile)}. Current phase: ${phase || 'welcome'}.`
      : '';

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + contextMessage },
      ...(history || []).slice(-10),
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
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: err },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response.';
    const citations = data.citations || [];

    const chips = extractChips(aiMessage, phase);
    const nextPhase = determinePhase(message, aiMessage, phase, userProfile);
    const profileUpdate = extractProfileData(message, aiMessage);

    return NextResponse.json({
      message: aiMessage,
      source: citations.length > 0 ? `Sources: ${citations.slice(0, 3).join(', ')}` : 'Perplexity AI + CMS Data',
      chips,
      phase: nextPhase,
      profileUpdate: Object.keys(profileUpdate).length > 0 ? profileUpdate : undefined,
      citations,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractChips(message: string, phase?: string): string[] {
  const defaultChips: Record<string, string[]> = {
    welcome: ['Find plans in my area', 'What is Medicare Advantage?', 'Compare plan types'],
    discovery: ['Search for plans now', 'Add my medications', 'Check my doctors'],
    plan_search: ['Compare top 3 plans', 'Show me $0 premium plans', 'Which has best drug coverage?'],
    comparison: ['Tell me more about this plan', 'Start enrollment', 'Check provider network'],
    deep_dive: ['I want to enroll', 'Compare with another plan', 'Check drug formulary'],
    enrollment: ['Continue enrollment', 'Review my selections', 'Talk to an agent'],
  };
  return defaultChips[phase || 'welcome'] || defaultChips.welcome;
}

function determinePhase(userMsg: string, aiMsg: string, currentPhase?: string, profile?: Record<string, unknown>): string {
  const msg = userMsg.toLowerCase();
  if (msg.includes('enroll') || msg.includes('sign up') || msg.includes('apply')) return 'enrollment';
  if (msg.includes('compare') || msg.includes('side by side') || msg.includes('difference')) return 'comparison';
  if (msg.includes('find plan') || msg.includes('search') || msg.includes('show me plans')) return 'plan_search';
  if (msg.includes('zip') || msg.includes('medication') || msg.includes('doctor') || msg.includes('budget')) return 'discovery';
  if (msg.includes('tell me more') || msg.includes('details') || msg.includes('coverage')) return 'deep_dive';
  return currentPhase || 'welcome';
}

function extractProfileData(userMsg: string, aiMsg: string): Record<string, string> {
  const profile: Record<string, string> = {};
  const zipMatch = userMsg.match(/\b\d{5}\b/);
  if (zipMatch) profile.zipCode = zipMatch[0];
  return profile;
}
