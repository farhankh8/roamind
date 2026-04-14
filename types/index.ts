export interface Destination {
  id: string
  name: string
  state: string
  category: string
  description: string
  bestTime?: string
  highlights?: string[]
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
