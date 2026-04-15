export const APP_NAME = 'Roamind'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://roamind.app'
export const APP_DESCRIPTION = 'Your AI-powered travel intelligence platform'

export const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.2,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  THB: 35.2,
  SGD: 1.34,
  AUD: 1.53,
  AED: 3.67,
  MYR: 4.72,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  NZD: 1.64,
  PKR: 279.5,
  BDT: 110.2,
}

export const BUDGET_TIERS = {
  low: { label: 'Budget', icon: '🎒', dailyRange: '₹600-1,500' },
  mid: { label: 'Comfort', icon: '🏨', dailyRange: '₹2,000-5,000' },
  high: { label: 'Luxury', icon: '✨', dailyRange: '₹8,000-25,000' },
} as const

export const TRAVEL_PREFERENCES = [
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'food', label: 'Food & Dining', icon: '🍽️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'spiritual', label: 'Spiritual', icon: '🧘' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'romantic', label: 'Romantic', icon: '💑' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { id: 'wildlife', label: 'Wildlife', icon: '🦁' },
] as const

export const STAY_TYPES = [
  { id: 'hostel', icon: '🏠', label: 'Hostel', desc: 'Budget, social, shared' },
  { id: 'hotel', icon: '🏨', label: 'Hotel', desc: 'Comfortable & convenient' },
  { id: 'airbnb', icon: '🏡', label: 'Airbnb', desc: 'Local home experience' },
  { id: 'resort', icon: '🌴', label: 'Resort', desc: 'All-inclusive luxury' },
  { id: 'boutique', icon: '🏩', label: 'Boutique Hotel', desc: 'Unique & stylish' },
  { id: 'camping', icon: '⛺', label: 'Camping / Glamping', desc: 'Close to nature' },
  { id: 'villa', icon: '🏖️', label: 'Private Villa', desc: 'Spacious & private' },
  { id: 'guesthouse', icon: '🏘️', label: 'Guesthouse / Homestay', desc: 'Homely & authentic' },
] as const

export const REGIONS = [
  { id: 'Southeast Asia', label: 'Southeast Asia', flag: '🌏', countries: 'Thailand · Bali · Vietnam · Singapore · Cambodia' },
  { id: 'Europe', label: 'Europe', flag: '🏰', countries: 'France · Italy · Spain · Greece · Portugal · Germany · Norway' },
  { id: 'Middle East', label: 'Middle East', flag: '🕌', countries: 'Egypt · Dubai · Jordan · Turkey' },
  { id: 'Americas', label: 'Americas', flag: '🗽', countries: 'USA · Canada · Mexico · Argentina · Peru · Cuba · Colombia' },
  { id: 'East Asia', label: 'East Asia', flag: '🏯', countries: 'Japan · South Korea' },
  { id: 'South Asia', label: 'South Asia', flag: '🙏', countries: 'Sri Lanka · Nepal · Maldives' },
  { id: 'Africa', label: 'Africa', flag: '🦁', countries: 'Kenya · South Africa' },
  { id: 'Oceania', label: 'Oceania', flag: '🏝️', countries: 'Australia · New Zealand · Bora Bora' },
] as const

export const AI_MODELS = {
  gemini: 'google/gemini-2.0-flash-001',
  anthropic: 'claude-sonnet-4-20250514',
} as const

export const RATE_LIMITS = {
  api: { requests: 10, windowMs: 60000 },
  chat: { requests: 20, windowMs: 60000 },
} as const
