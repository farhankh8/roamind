import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const _cache = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

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
  city: z.string().min(1).max(100).trim(),
  country: z.string().max(100).trim().optional(),
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
    
    const { city, country } = validation.data

    const apiKey = process.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      console.error('OpenRouter API key not configured')
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 500 })
    }

    const prompt = `List exactly 20 famous restaurants in ${city}${country ? ', ' + country : ''}. 

Return ONLY valid JSON array (no markdown, no explanation):
[{"id":"1","name":"Restaurant Name","location":"Area, City","cuisine":"Italian","cuisineType":"italian","diet":["nonveg"],"budget":"mid","rating":4.5,"price":"$$","emoji":"🍕","mustTry":"Pasta","desc":"Great Italian food","michelin":false,"stars":"","book":"https://tripadvisor.com","gmapUrl":"https://maps.google.com/?q=Restaurant+Name+City"}]`

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
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: MAX_TOKENS,
        }),
        signal: AbortSignal.timeout(30000)
      }
    )
    
    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText)
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })
    }

    const cleanContent = content.replace(/```json|```/g, '').trim()
    const start = cleanContent.indexOf('[')
    const end = cleanContent.lastIndexOf(']') + 1
    
    if (start === -1) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
    }

    const jsonStr = cleanContent.substring(start, end)
    
    let restaurants
    try {
      restaurants = JSON.parse(jsonStr)
    } catch {
      const fixedJson = jsonStr.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}')
      try {
        restaurants = JSON.parse(fixedJson)
      } catch {
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
      }
    }

    if (!Array.isArray(restaurants)) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 500 })
    }

    return NextResponse.json({ restaurants: restaurants.slice(0, 20) })
  } catch (error: unknown) {
    console.error('Gemini API route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}
