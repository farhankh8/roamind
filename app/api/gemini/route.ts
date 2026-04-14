import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait 1 minute.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { city, country } = body

    const apiKey = process.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
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
          max_tokens: 4096,
        })
      }
    )

    const responseText = await response.text()
    
    if (!response.ok) {
      return NextResponse.json({ error: 'API Error: ' + responseText.substring(0, 200) }, { status: 500 })
    }

    const data = JSON.parse(responseText)
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })
    }

    const cleanContent = content.replace(/```json|```/g, '').trim()
    const start = cleanContent.indexOf('[')
    const end = cleanContent.lastIndexOf(']') + 1
    
    if (start === -1) {
      return NextResponse.json({ error: 'No JSON array found' }, { status: 500 })
    }

    const jsonStr = cleanContent.substring(start, end)
    
    let restaurants;
    try {
      restaurants = JSON.parse(jsonStr)
    } catch {
      const fixedJson = jsonStr.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}')
      try {
        restaurants = JSON.parse(fixedJson)
      } catch {
        return NextResponse.json({ error: 'Failed to parse data' }, { status: 500 })
      }
    }

    if (!Array.isArray(restaurants)) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 500 })
    }

    return NextResponse.json({ restaurants: restaurants.slice(0, 20) })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
