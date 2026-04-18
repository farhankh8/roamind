import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, userContext } = body

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set ANTHROPIC_API_KEY in environment.' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are an expert travel assistant with deep knowledge of visa requirements, local customs, safety, budgeting, food, transport, hidden gems, and trip planning. ${userContext || ''}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.slice(-10)
      })
    })

    const result = await response.json()

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || 'API request failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      content: result.content?.[0]?.text || 'Sorry, I could not generate a response.'
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}