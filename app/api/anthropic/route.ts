import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)
  if (!limit || now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }
  if (limit.count >= 10) return false
  limit.count++
  return true
}

const requestSchema = z.object({
  city: z.string().min(1).max(100).trim().optional(),
  country: z.string().max(100).trim().optional(),
  cuisine: z.string().max(50).trim().optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  model: z.string().optional(),
  max_tokens: z.number().optional(),
})

const MAX_TOKENS = 4000

export async function POST(req: NextRequest) {
  // Auth is handled by middleware - protected routes can't reach here without auth
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait 1 minute.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    
    const validation = requestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid request', 
        details: validation.error.issues 
      }, { status: 400 })
    }
    
    const data = validation.data

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error('OpenRouter API key not configured')
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 500 })
    }

    let prompt: string
    let model = 'google/gemini-2.0-flash-001'
    let maxTokens = MAX_TOKENS

    if (data.messages) {
      prompt = data.messages[0]?.content || ''
      model = data.model || model
      maxTokens = Math.min(data.max_tokens || MAX_TOKENS, MAX_TOKENS)
    } else {
      prompt = `You are a world-class food and travel expert. Generate exactly 55 real, famous, and highly-regarded restaurants for ${data.city}${data.country ? ', ' + data.country : ''}${data.cuisine ? ' specializing in ' + data.cuisine : ''}.

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
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: AbortSignal.timeout(30000)
      }
    )

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText)
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 })
    }

    const responseData = await response.json()
    const content = responseData.choices?.[0]?.message?.content

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
  } catch (error: unknown) {
    console.error('OpenRouter API route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
