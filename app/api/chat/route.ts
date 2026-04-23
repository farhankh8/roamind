import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Auth is handled by middleware - protected routes can't reach here without auth
  try {
    const body = await req.json()
    const { messages, userContext } = body

    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set OPENROUTER_API_KEY in environment.' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are an expert travel assistant with deep knowledge of visa requirements, local customs, safety, budgeting, food, transport, hidden gems, and trip planning. ${userContext || ''}`

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Roamind Travel App',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          max_tokens: 1024,
          messages: [{ role: 'user', content: systemPrompt + '\n\n' + messages[0]?.content }]
        }),
        signal: AbortSignal.timeout(30000)
      }
    )

    const result = await response.json()

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || 'API request failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      content: result.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}