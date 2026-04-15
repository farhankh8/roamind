export interface Destination {
  name: string
  state?: string
  country?: string
  flag: string
  tags: string[]
  img: string
  budget?: { low: number; mid: number; high: number }
  dayRate?: { low: number; mid: number; high: number }
  highlights: string[]
  food: string[]
  hotels: { low: string; mid: string; high: string }
  transport: string
  bestTime: string
  emergency: string
  packing: string[]
  region?: string
}

export interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  notes?: string
  savedAt: string
}

export interface Expense {
  id: string
  category: string
  amount: number
  currency: string
  description: string
  date: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface UserSettings {
  anthropicApiKey?: string
  preferredCurrency?: string
  theme?: 'light' | 'dark'
  language?: string
}

export interface PassportBadge {
  id: string
  destination: string
  visitedAt: string
  badge: string
}

export interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  aqi?: number
  city: string
}
