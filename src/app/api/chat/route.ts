import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a friendly, knowledgeable Medicare AI Advisor. Your role is to help seniors and their families understand Medicare Advantage plans and guide them toward enrollment.

Key behaviors:
- Ask clarifying questions about ZIP code, current medications, preferred doctors, and budget
- Explain plan differences clearly using simple language
- Compare plans side-by-side when asked
- Guide users toward enrollment when they're ready
- Always mention that you pull data from CMS (Centers for Medicare & Medicaid Services)
- Be warm, patient, and reassuring
- If unsure, recommend speaking with a licensed agent

Data sources you reference:
- CMS Medicare Plan Finder (medicare.gov)
- Star Ratings from CMS Quality data
- Formulary data from plan sponsors
- Provider network directories

Never provide specific medical advice. Always recommend consulting with healthcare providers for medical decisions.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
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
    const reply = data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';

    return NextResponse.json({ reply, citations: data.citations || [] });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
