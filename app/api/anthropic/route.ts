import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'sk-ant-your-key-here') {
      return NextResponse.json({ error: 'API key not configured. Please add ANTHROPIC_API_KEY to .env.local' }, { status: 500 })
    }

    let prompt: string
    let model = 'claude-sonnet-4-20250514'
    let maxTokens = 8000

    if (body.messages) {
      prompt = body.messages[0]?.content || ''
      model = body.model || model
      maxTokens = body.max_tokens || maxTokens
    } else {
      const { city, country, cuisine } = body
      prompt = `You are a world-class food and travel expert. Generate exactly 55 real, famous, and highly-regarded restaurants for ${city}${country ? ', ' + country : ''}${cuisine ? ' specializing in ' + cuisine : ''}.

For each restaurant provide:
- id: unique slug
- name: Famous real restaurant name
- location: Specific neighborhood/area
- cuisine: The type of cuisine served
- cuisineType: indian|japanese|italian|thai|chinese|french|mediterranean|mexican|korean|american|seafood|other
- diet: array of veg|nonveg|vegan|halal|seafood
- budget: cheap|mid|upscale|luxury
- rating: Rating out of 5 (4.3-4.9)
- price: ₹|₹₹|₹₹₹|₹₹₹₹
- emoji: relevant food emoji
- desc: 1-2 sentence description
- tags: array of 4 relevant tags
- michelin: boolean
- stars: ⭐ count if michelin is true
- book: real booking URL (zomato for India, tripadvisor/opentable for international)
- gmapUrl: Google Maps URL
- mustOrder: signature dish name

Return ONLY a valid JSON array with exactly 55 restaurants. No markdown, no explanation, just the JSON array.`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: 'AI service error', details: error }, { status: response.status })
    }

    const data = await response.json()
    const content = data.content?.[0]?.text

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let restaurants
    try {
      restaurants = JSON.parse(content)
      if (!Array.isArray(restaurants)) {
        throw new Error('Not an array')
      }
    } catch {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        restaurants = JSON.parse(jsonMatch[0])
      } else {
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
      }
    }

    return NextResponse.json({ restaurants: restaurants.slice(0, 55) })
  } catch (error: any) {
    console.error('Anthropic API error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
