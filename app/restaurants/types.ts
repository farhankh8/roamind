export interface Restaurant {
  id: string
  name: string
  location: string
  cuisine: string
  cuisineType: string
  diet: string[]
  budget: string
  rating: number
  price: string
  emoji: string
  mustTry?: string
  desc: string
  tags?: string[]
  michelin: boolean
  stars?: string
  book: string
  gmapUrl: string
  knownFor?: string
  image?: string
  images?: string[]
  amenities?: string[]
  openingHours?: string
}

export interface City {
  id: string
  name: string
  sub: string
  emoji: string
  type: string
}

export interface FoodTip {
  icon: string
  title: string
  desc: string
}

export interface Platform {
  name: string
  url: string
  icon: string
}
