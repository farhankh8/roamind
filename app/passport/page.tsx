'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const BG = '#000814'
const BG2 = '#05090f'
const BG3 = '#0a1628'
const GR = '#51cf66'
const PURPLE = '#a855f7'

const countryCoordinates: Record<string, [number, number]> = {
  IN: [20.5937, 78.9629], US: [37.0902, -95.7129], GB: [55.3781, -3.4360], FR: [46.2276, 2.2137], DE: [51.1657, 10.4515], IT: [41.8719, 12.5674], ES: [40.4637, -3.7492], JP: [36.2048, 138.2529], CN: [35.8617, 104.1954], AU: [-25.2744, 133.7751], CA: [56.1304, -106.3468], BR: [-14.2350, -51.9253], MX: [23.6345, -102.5528], AE: [23.4241, 53.8478], TH: [15.8700, 100.9925], SG: [1.3521, 103.8198], MY: [4.2105, 101.9758], ID: [-0.7893, 113.9213], VN: [14.0583, 108.2772], KR: [35.9078, 127.7669], NL: [52.1326, 5.2913], CH: [46.8182, 8.2275], AT: [47.5162, 14.5501], PT: [39.3999, -8.2245], GR: [39.0742, 21.8243], SE: [60.1282, 18.6435], NO: [60.4720, 8.4689], DK: [56.2639, 9.5018], FI: [61.9241, 25.7482], IE: [53.1424, -7.6921], PL: [51.9194, 19.1451], CZ: [49.8175, 15.4730], HU: [47.1625, 19.5033], HR: [45.1000, 15.2000], TR: [38.9637, 35.2433], EG: [26.8206, 30.8025], ZA: [-30.5595, 22.9375], MA: [31.7917, -7.0926], KE: [-0.0236, 37.9062], NZ: [-40.9006, 174.8860], AR: [-38.4161, -63.6167], CL: [-35.6751, -71.5430], CO: [4.5709, -74.2973], PE: [-9.1900, -75.0152], RU: [61.5240, 105.3188], IL: [31.0461, 34.8516], SA: [23.8859, 45.0792], PH: [12.8797, 121.7740], TW: [23.6978, 120.9605], HK: [22.3193, 114.1694], NP: [28.3949, 84.1240], FJ: [-17.7134, 178.0650],
}

function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function calculateTotalDistance(visited: string[]): number {
  let total = 0
  for (let i = 0; i < visited.length - 1; i++) {
    const c1 = countryCoordinates[visited[i]]
    const c2 = countryCoordinates[visited[i + 1]]
    if (c1 && c2) total += calculateDistance(c1, c2)
  }
  return total
}

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

interface Visit {
  date: string
  duration: number
  purpose: 'tourism' | 'work' | 'transit' | 'family' | 'business'
  photos: string[]
  rating: number
  spots: string[]
  tips: string
  mood: 'loved' | 'liked' | 'ok' | 'disliked'
  flightNumber?: string
  airline?: string
  companion?: string
  spending?: number
  currency?: string
}

interface CountryVisit {
  code: string
  name: string
  flag: string
  continent: string
  visits: Visit[]
  notes: string
  badges: string[]
  moments: string[]
  visitedDate?: string
  spendings?: { amount: number; category: string; date: string }[]
}

interface PassportSettings {
  coverColor: 'navy' | 'green' | 'red' | 'black' | 'gold'
  avatar: string
  displayName: string
  homeCountry: string
  style: 'classic' | 'modern' | 'minimal' | 'vintage'
  wishlist: string[]
}

const allCountries = [
  { code: 'IN', name: 'India', flag: '🇮🇳', continent: 'Asia' },
  { code: 'US', name: 'United States', flag: '🇺🇸', continent: 'Americas' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', continent: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', continent: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', continent: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', continent: 'Europe' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', continent: 'Asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', continent: 'Asia' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', continent: 'Oceania' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', continent: 'Americas' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', continent: 'Americas' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', continent: 'Americas' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', continent: 'Middle East' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', continent: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', continent: 'Asia' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', continent: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', continent: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', continent: 'Asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', continent: 'Asia' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', continent: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', continent: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', continent: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', continent: 'Europe' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', continent: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', continent: 'Europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', continent: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', continent: 'Europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', continent: 'Europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', continent: 'Europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', continent: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', continent: 'Europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', continent: 'Europe' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', continent: 'Europe' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', continent: 'Middle East' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', continent: 'Africa' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', continent: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', continent: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', continent: 'Africa' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', continent: 'Oceania' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', continent: 'Americas' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', continent: 'Americas' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', continent: 'Americas' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', continent: 'Americas' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', continent: 'Europe' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', continent: 'Middle East' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', continent: 'Middle East' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', continent: 'Asia' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', continent: 'Asia' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', continent: 'Asia' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', continent: 'Asia' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', continent: 'Oceania' },
]

const BADGE_DEFS = [
  { id: 'first_step', icon: '🌱', name: 'First Step', desc: 'Visit 1st country', req: (c: number) => c >= 1 },
  { id: 'explorer', icon: '🗺️', name: 'Explorer', desc: 'Visit 5 countries', req: (c: number) => c >= 5 },
  { id: 'frequent_flyer', icon: '✈️', name: 'Frequent Flyer', desc: 'Visit 10 countries', req: (c: number) => c >= 10 },
  { id: 'globetrotter', icon: '🌍', name: 'Globetrotter', desc: 'Visit 25 countries', req: (c: number) => c >= 25 },
  { id: 'world_master', icon: '👑', name: 'World Master', desc: 'Visit 50 countries', req: (c: number) => c >= 50 },
  { id: 'euro_tripper', icon: '🏰', name: 'Euro Tripper', desc: '5+ European countries', req: (_: number, c: Record<string, number>) => (c['Europe'] || 0) >= 5 },
  { id: 'asia_explorer', icon: '🐉', name: 'Asia Explorer', desc: '5+ Asian countries', req: (_: number, c: Record<string, number>) => (c['Asia'] || 0) >= 5 },
  { id: 'africa_adventurer', icon: '🦁', name: 'Africa Adventurer', desc: '3+ African countries', req: (_: number, c: Record<string, number>) => (c['Africa'] || 0) >= 3 },
  { id: 'americas_traveler', icon: '🦅', name: 'Americas Traveler', desc: '5+ American countries', req: (_: number, c: Record<string, number>) => (c['Americas'] || 0) >= 5 },
  { id: 'oceania_pioneer', icon: '🦘', name: 'Oceania Pioneer', desc: '2+ Oceanian countries', req: (_: number, c: Record<string, number>) => (c['Oceania'] || 0) >= 2 },
  { id: 'memory_keeper', icon: '📸', name: 'Memory Keeper', desc: 'Upload 10+ photos', req: (_: number, __: Record<string, number>, p: number) => p >= 10 },
  { id: 'critic', icon: '⭐', name: 'Critic', desc: 'Rate 10+ countries', req: (_: number, __: Record<string, number>, _p: number, r: number) => r >= 10 },
  { id: 'storyteller', icon: '📖', name: 'Storyteller', desc: 'Write notes for 5+ countries', req: (_: number, __: Record<string, number>, _p: number, _r: number, n: number) => n >= 5 },
  { id: 'mountain_seeker', icon: '🏔️', name: 'Mountain Seeker', desc: 'Visit NP, PE, CH, NO', req: (_: number, __: Record<string, number>, __p: number, _r: number, _n: number, c: string[]) => ['NP', 'PE', 'CH', 'NO'].every(cn => c.includes(cn)) },
  { id: 'beach_lover', icon: '🏖️', name: 'Beach Lover', desc: 'Visit TH, ID, MY, FJ, FI', req: (_: number, __: Record<string, number>, __p: number, _r: number, _n: number, c: string[]) => ['TH', 'ID', 'MY', 'FJ', 'FI'].some(cn => c.includes(cn)) },
  { id: 'city_slicker', icon: '🏙️', name: 'City Slicker', desc: 'Visit JP, US, GB, FR', req: (_: number, __: Record<string, number>, __p: number, _r: number, _n: number, c: string[]) => ['JP', 'US', 'GB', 'FR'].every(cn => c.includes(cn)) },
  { id: 'foodie', icon: '🍜', name: 'Foodie', desc: 'Visit IT, JP, MX, IN, TH', req: (_: number, __: Record<string, number>, __p: number, _r: number, _n: number, c: string[]) => ['IT', 'JP', 'MX', 'IN', 'TH'].some(cn => c.includes(cn)) },
  { id: 'backpacker', icon: '🎒', name: 'Backpacker', desc: 'Visit 3 continents', req: (_: number, __: Record<string, number>, ___p: number, __r: number, ___n: number, _c: string[], conts: string[]) => new Set(conts).size >= 3 },
  { id: 'culture_vulture', icon: '🤝', name: 'Culture Vulture', desc: 'Add notes to 10+ countries', req: (_: number, __: Record<string, number>, __p: number, _r: number, n: number) => n >= 10 },
  { id: 'passport_pro', icon: '💎', name: 'Passport Pro', desc: 'Earn 10+ other badges', req: (_: number, __: Record<string, number>, ___p: number, __r: number, ___n: number, __c: string[], _conts: string[], b: number) => b >= 10 },
]

const CONTINENT_COLORS: Record<string, string> = {
  Europe: '#3b82f6',
  Asia: '#ef4444',
  Americas: '#22c55e',
  Africa: '#f59e0b',
  Oceania: '#a855f7',
  'Middle East': '#ec4899',
}

const coverColors: Record<PassportSettings['coverColor'], string> = {
  navy: '#1e3a5f',
  green: '#14532d',
  red: '#7f1d1d',
  black: '#18181b',
  gold: '#854d0e',
}

function generatePassportNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TRP-2024-'
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function RealMap({ visited, wishlist, onCountryClick }: { visited: string[], wishlist: string[], onCountryClick: (code: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    import('leaflet').then(() => {
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    setMapKey(k => k + 1)
  }, [visited.length, wishlist.length])

  useEffect(() => {
    if (!loaded || !containerRef.current) return
    
    let mapInstance: any = null
    let mounted = true

    import('leaflet').then((L: any) => {
      if (!mounted || !containerRef.current) return
      
      const existingContainer = containerRef.current.querySelector('.leaflet-container')
      if (existingContainer) {
        existingContainer.remove()
      }

      const mapDiv = document.createElement('div')
      mapDiv.className = 'leaflet-container'
      mapDiv.style.height = '100%'
      mapDiv.style.width = '100%'
      containerRef.current.appendChild(mapDiv)

      mapInstance = L.map(mapDiv, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: true,
        worldCopyJump: true
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO'
      }).addTo(mapInstance)

      const createIcon = (color: string) => {
        return L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 20px; 
            height: 20px; 
            background: ${color}; 
            border-radius: 50%; 
            border: 3px solid #fff; 
            box-shadow: 0 0 12px ${color};
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }

      visited.forEach(code => {
        const coord = countryCoordinates[code]
        const country = allCountries.find(c => c.code === code)
        if (coord && country) {
          const marker = L.marker(coord, { icon: createIcon('#63d2ff') }).addTo(mapInstance)
          marker.bindPopup(`
            <div style="text-align: center; padding: 8px; font-family: system-ui;">
              <span style="font-size: 28px;">${country.flag}</span>
              <div style="font-weight: 600; font-size: 14px; margin-top: 4px;">${country.name}</div>
              <div style="font-size: 11px; color: #666;">Visited ✓</div>
            </div>
          `)
          marker.on('click', () => onCountryClick(code))
        }
      })

      wishlist.forEach(code => {
        const coord = countryCoordinates[code]
        const country = allCountries.find(c => c.code === code)
        if (coord && country) {
          const marker = L.marker(coord, { icon: createIcon('#ffb74d') }).addTo(mapInstance)
          marker.bindPopup(`
            <div style="text-align: center; padding: 8px; font-family: system-ui;">
              <span style="font-size: 28px;">${country.flag}</span>
              <div style="font-weight: 600; font-size: 14px; margin-top: 4px;">${country.name}</div>
              <div style="font-size: 11px; color: #f59e0b;">On Wishlist ⭐</div>
            </div>
          `)
          marker.on('click', () => onCountryClick(code))
        }
      })

      if (visited.length > 1) {
        const latLngs = visited.map(code => countryCoordinates[code]).filter(Boolean)
        if (latLngs.length > 1) {
          L.polyline(latLngs, {
            color: '#63d2ff',
            weight: 2,
            opacity: 0.7,
            dashArray: '8, 12'
          }).addTo(mapInstance)
        }
      }
    })

    return () => {
      mounted = false
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [loaded, mapKey, visited, wishlist])

  if (!loaded) {
    return (
      <div style={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG2, borderRadius: 16, position: 'relative' }}>
        <svg style={{ width: 60, height: 60, animation: 'spin 2s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="#63d2ff" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ height: 500, borderRadius: 16, overflow: 'hidden', position: 'relative' }} />
  )
}

function WorldMapSVG({ visited, onCountryClick }: { visited: string[], onCountryClick: (code: string) => void }) {
  const countries: Record<string, string> = {
    'IN': 'M350,380 L360,370 L370,375 L365,390 L340,395 L330,385 Z',
    'US': 'M80,180 L180,170 L200,180 L190,220 L150,250 L100,240 Z',
    'GB': 'M320,130 L340,125 L345,145 L330,150 Z',
    'FR': 'M320,180 L350,175 L355,195 L325,200 Z',
    'DE': 'M355,160 L385,155 L390,175 L360,180 Z',
    'IT': 'M365,195 L390,190 L395,220 L370,230 Z',
    'ES': 'M280,185 L320,180 L325,210 L285,215 Z',
    'JP': 'M680,200 L700,190 L705,220 L685,230 Z',
    'CN': 'M550,180 L650,170 L660,230 L560,240 Z',
    'AU': 'M620,380 L720,370 L730,410 L630,420 Z',
    'CA': 'M80,100 L180,90 L190,150 L100,170 Z',
    'BR': 'M180,300 L240,290 L250,360 L190,370 Z',
    'MX': 'M100,220 L160,210 L165,250 L105,260 Z',
    'AE': 'M450,230 L480,225 L485,250 L455,255 Z',
    'TH': 'M560,260 L590,255 L595,285 L565,290 Z',
    'SG': 'M580,310 L600,305 L605,320 L585,325 Z',
    'MY': 'M560,290 L590,285 L595,320 L565,325 Z',
    'ID': 'M600,330 L750,320 L760,370 L610,380 Z',
    'VN': 'M590,250 L620,245 L625,270 L595,275 Z',
    'KR': 'M645,195 L665,190 L670,210 L650,215 Z',
    'NL': 'M360,145 L380,140 L385,160 L365,165 Z',
    'CH': 'M365,175 L385,170 L390,185 L370,190 Z',
    'AT': 'M385,175 L405,170 L410,190 L390,195 Z',
    'PT': 'M270,185 L290,180 L295,200 L275,205 Z',
    'GR': 'M400,205 L420,200 L425,225 L405,230 Z',
    'SE': 'M385,80 L420,70 L425,110 L390,120 Z',
    'NO': 'M360,60 L400,50 L405,100 L365,110 Z',
    'DK': 'M375,120 L400,115 L405,140 L380,145 Z',
    'FI': 'M420,50 L470,40 L475,90 L430,100 Z',
    'IE': 'M290,130 L315,125 L320,150 L295,155 Z',
    'PL': 'M410,145 L450,140 L455,165 L415,170 Z',
    'CZ': 'M400,160 L425,155 L430,175 L405,180 Z',
    'HU': 'M415,175 L440,170 L445,190 L420,195 Z',
    'HR': 'M390,190 L415,185 L420,205 L395,210 Z',
    'TR': 'M430,195 L470,185 L475,220 L435,230 Z',
    'EG': 'M420,260 L460,250 L465,280 L425,290 Z',
    'ZA': 'M440,420 L490,410 L500,450 L450,460 Z',
    'MA': 'M280,215 L320,210 L325,240 L285,245 Z',
    'KE': 'M450,340 L485,335 L490,365 L455,370 Z',
    'NZ': 'M760,420 L790,415 L795,440 L765,445 Z',
    'AR': 'M170,380 L220,370 L230,450 L180,460 Z',
    'CL': 'M140,350 L155,345 L160,480 L145,485 Z',
    'CO': 'M150,280 L190,275 L195,310 L155,315 Z',
    'PE': 'M130,320 L170,315 L175,380 L135,385 Z',
    'RU': 'M450,50 L700,30 L720,150 L500,170 Z',
    'IL': 'M440,235 L460,230 L465,250 L445,255 Z',
    'SA': 'M440,260 L490,250 L500,290 L450,300 Z',
    'PH': 'M640,280 L680,275 L685,310 L645,315 Z',
    'TW': 'M620,250 L650,245 L655,265 L625,270 Z',
    'HK': 'M600,265 L615,260 L620,275 L605,280 Z',
  }
  
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: 'auto' }}>
      <rect fill="#0a1628" width="800" height="500" rx="12" />
      {Object.entries(countries).map(([code, path]) => {
        const isVisited = visited.includes(code)
        const country = allCountries.find(c => c.code === code)
        return (
          <g key={code} onClick={() => onCountryClick(code)} style={{ cursor: isVisited ? 'pointer' : 'default' }}>
            <path
              d={path}
              fill={isVisited ? C : '#1a2332'}
              stroke={isVisited ? C : '#2a3342'}
              strokeWidth="1"
              style={{
                transition: 'all 0.3s',
                filter: isVisited ? `drop-shadow(0 0 8px ${C})` : 'none',
                opacity: isVisited ? 1 : 0.6,
              }}
            />
          </g>
        )
      })}
      <text fill="#64748b" fontSize="12" x="400" y="30">AMERICAS</text>
      <text fill="#64748b" fontSize="12" x="550" y="30">ASIA</text>
      <text fill="#64748b" fontSize="12" x="350" y="30">EUROPE</text>
      <text fill="#64748b" fontSize="12" x="450" y="300">AFRICA</text>
      <text fill="#64748b" fontSize="12" x="650" y="380">OCEANIA</text>
    </svg>
  )
}

export default function TravelPassport() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/passport')
  const [countries, setCountries] = useState<Record<string, CountryVisit>>({})
  const [settings, setSettings] = useState<PassportSettings>({
    coverColor: 'navy',
    avatar: '',
    displayName: 'Traveler',
    homeCountry: 'IN',
    style: 'modern',
    wishlist: [],
  })
  const [viewMode, setViewMode] = useState<'cover' | 'map' | 'stamps' | 'photos' | 'leaderboard' | 'timeline' | 'stats'>('cover')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<typeof allCountries[0] | null>(null)
  const [passportNumber, setPassportNumber] = useState<string>('TRP-0000-00000')
  const [lastSaved, setLastSaved] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [animatedStats, setAnimatedStats] = useState({ countries: 0, badges: 0, photos: 0, visits: 0 })
  const [showStampAnimation, setShowStampAnimation] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) })
      return () => unsubscribe()
    } catch { setLoading(false) }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('roamind_passport_v2')
      if (saved) {
        const data = JSON.parse(saved)
        setCountries(data.countries || {})
        setSettings({ ...settings, ...data.settings })
        if (data.lastSaved) setLastSaved(data.lastSaved)
        if (data.passportNumber) setPassportNumber(data.passportNumber)
        else setPassportNumber(generatePassportNumber())
      } else {
        setPassportNumber(generatePassportNumber())
      }
    } catch {
      setPassportNumber(generatePassportNumber())
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = { countries, settings, lastSaved: new Date().toISOString(), passportNumber }
      try {
        localStorage.setItem('roamind_passport_v2', JSON.stringify(data))
        setLastSaved(new Date().toLocaleTimeString())
      } catch {}
    }, 500)
    return () => clearTimeout(timer)
  }, [countries, settings, passportNumber])

  useEffect(() => {
    const visitedCount = Object.keys(countries).length
    const totalPhotos = Object.values(countries).reduce((acc, c) => acc + c.visits.reduce((a, v) => a + v.photos.length, 0), 0)
    const totalVisits = Object.values(countries).reduce((acc, c) => acc + c.visits.length, 0)
    const duration = 500
    const steps = 30
    let step = 0
    const interval = setInterval(() => {
      step++
      setAnimatedStats({
        countries: Math.floor((visitedCount / steps) * step),
        badges: Math.floor((getEarnedBadges().length / steps) * step),
        photos: Math.floor((totalPhotos / steps) * step),
        visits: Math.floor((totalVisits / steps) * step),
      })
      if (step >= steps) clearInterval(interval)
    }, duration / steps)
    return () => clearInterval(interval)
  }, [countries])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false)
        setShowDetailModal(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))
  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  const totalCountries = Object.keys(countries).length
  const totalPhotos = Object.values(countries).reduce((acc, c) => acc + c.visits.reduce((a, v) => a + v.photos.length, 0), 0)
  const totalVisits = Object.values(countries).reduce((acc, c) => acc + c.visits.length, 0)
  const totalNotes = Object.values(countries).filter(c => c.notes).length
  const totalRatings = Object.values(countries).filter(c => c.visits.some(v => v.rating)).length

  const continentCounts = Object.values(countries).reduce((acc, c) => {
    acc[c.continent] = (acc[c.continent] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const visitedCodes = Object.keys(countries)
  const conts = visitedCodes.map(code => allCountries.find(cn => cn.code === code)?.continent || '').filter(Boolean)

  const getEarnedBadges = (): typeof BADGE_DEFS => {
    return BADGE_DEFS.filter(b => {
      return b.req(totalCountries, continentCounts, totalPhotos, totalRatings, totalNotes, visitedCodes, conts, 0)
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, visitIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.match(/^image\/(jpeg|png|webp|heic)$/)) {
      alert('Please upload JPEG, PNG, WebP, or HEIC images only')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB')
      return
    }
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p === null) return null
        if (p >= 100) {
          clearInterval(interval)
          return null
        }
        return p + 10
      })
    }, 50)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      if (selectedCountry) {
        setCountries(prev => {
          const country = prev[selectedCountry.code] || {
            code: selectedCountry.code,
            name: selectedCountry.name,
            flag: selectedCountry.flag,
            continent: selectedCountry.continent,
            visits: [],
            notes: '',
            badges: [],
            moments: [],
          }
          const visits = [...country.visits]
          if (!visits[visitIndex]) visits[visitIndex] = { date: new Date().toISOString().split('T')[0], duration: 1, purpose: 'tourism', photos: [], rating: 5, spots: [], tips: '', mood: 'loved' }
          visits[visitIndex].photos = [...(visits[visitIndex].photos || []), base64].slice(0, 3)
          return { ...prev, [selectedCountry.code]: { ...country, visits } }
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const addCountry = () => {
    if (!selectedCountry) return
    const newVisit: Visit = {
      date: new Date().toISOString().split('T')[0],
      duration: 1,
      purpose: 'tourism',
      photos: [],
      rating: 5,
      spots: [],
      tips: '',
      mood: 'loved',
    }
    setCountries(prev => ({
      ...prev,
      [selectedCountry.code]: {
        code: selectedCountry.code,
        name: selectedCountry.name,
        flag: selectedCountry.flag,
        continent: selectedCountry.continent,
        visits: [newVisit],
        notes: '',
        badges: ['first_step'],
        moments: [],
      },
    }))
    setShowStampAnimation(true)
    setTimeout(() => setShowStampAnimation(false), 1500)
    setShowAddModal(false)
    setSelectedCountry(null)
    setViewMode('stamps')
  }

  const deletePhoto = (countryCode: string, visitIndex: number, photoIndex: number) => {
    setCountries(prev => {
      const country = prev[countryCode]
      if (!country) return prev
      const visits = [...country.visits]
      visits[visitIndex] = { ...visits[visitIndex], photos: visits[visitIndex].photos.filter((_: string, i: number) => i !== photoIndex) }
      return { ...prev, [countryCode]: { ...country, visits } }
    })
  }

  const getAllPhotos = () => {
    const photos: { url: string, country: CountryVisit }[] = []
    Object.values(countries).forEach(c => {
      c.visits.forEach(v => {
        v.photos.forEach(p => {
          photos.push({ url: p, country: c })
        })
      })
    })
    return photos
  }

  const generateShareCard = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 800
    canvas.height = 400
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, 800, 400)
    ctx.fillStyle = C
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText('🏅 Travel Passport', 40, 60)
    ctx.fillStyle = '#fff'
    ctx.font = '24px sans-serif'
    ctx.fillText(`🌍 ${totalCountries} Countries Visited`, 40, 120)
    ctx.fillText(`📸 ${totalPhotos} Photos | ${totalVisits} Trips`, 40, 160)
    ctx.font = '16px sans-serif'
    const badges = getEarnedBadges().slice(0, 6).map(b => b.icon).join(' ')
    ctx.fillText(`Badges: ${badges}`, 40, 200)
    const link = document.createElement('a')
    link.download = 'travel-passport.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const unvisitedCountries = allCountries.filter(c => !visitedCodes.includes(c.code))
  const earnedBadges = getEarnedBadges()
  const favoriteContinent = Object.entries(continentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
      
      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
            >☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>🏅 Travel Passport</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Your journey, one stamp at a time!</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {lastSaved && <span style={{ fontSize: 11, color: GR }}>✓ Saved {lastSaved}</span>}
            <button onClick={generateShareCard} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: G, fontSize: 13 }}>📤 Share</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {(['cover', 'map', 'stamps', 'photos', 'timeline', 'stats', 'leaderboard'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: '10px 18px', background: viewMode === mode ? C : 'rgba(255,255,255,0.05)', borderRadius: 25, cursor: 'pointer', border: `1px solid ${viewMode === mode ? C : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => { if (viewMode !== mode) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' } }}
                onMouseLeave={e => { if (viewMode !== mode) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
              >
                <span style={{ color: viewMode === mode ? BG : '#fff', fontSize: 13, fontWeight: 500 }}>
                  {mode === 'cover' && '📔'} {mode === 'map' && '🗺️'} {mode === 'stamps' && '📮'} {mode === 'photos' && '📸'} {mode === 'timeline' && '📅'} {mode === 'stats' && '📊'} {mode === 'leaderboard' && '🏆'}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
            <div style={{ background: BG3, padding: 16, borderRadius: 14, textAlign: 'center', border: '1px solid rgba(99,210,255,0.1)' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: C }}>{animatedStats.countries}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Countries</div>
            </div>
            <div style={{ background: BG3, padding: 16, borderRadius: 14, textAlign: 'center', border: '1px solid rgba(255,183,77,0.1)' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: G }}>{animatedStats.badges}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Badges</div>
            </div>
            <div style={{ background: BG3, padding: 16, borderRadius: 14, textAlign: 'center', border: '1px solid rgba(168,85,247,0.1)' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: PURPLE }}>{animatedStats.photos}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Photos</div>
            </div>
            <div style={{ background: BG3, padding: 16, borderRadius: 14, textAlign: 'center', border: '1px solid rgba(81,207,102,0.1)' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: GR }}>{animatedStats.visits}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Trips</div>
            </div>
            <div style={{ background: BG3, padding: 16, borderRadius: 14, textAlign: 'center', border: '1px solid rgba(255,107,107,0.1)' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: R }}>{calculateTotalDistance(visitedCodes).toLocaleString()}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>KM</div>
            </div>
          </div>
          {viewMode === 'cover' && (
            <div style={{ display: 'flex', justifyContent: 'center', perspective: '1000px' }}>
              <div style={{ 
                width: 350, 
                height: 480, 
                background: coverColors[settings.coverColor],
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-5deg)',
                transition: 'transform 0.5s',
                cursor: 'pointer',
              }} onClick={() => setShowAddModal(true)}>
                <div style={{ border: '3px solid rgba(255,215,0,0.3)', borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                  <div style={{ fontSize: 64, marginBottom: 20 }}>🌍</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', textAlign: 'center', letterSpacing: 4 }}>TRAVEL PASSPORT</div>
                  <div style={{ marginTop: 30, width: 80, height: 80, borderRadius: '50%', background: settings.avatar ? `url(${settings.avatar})` : `linear-gradient(135deg, ${C}, ${G})`, backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: BG }}>
                    {!settings.avatar && (settings.displayName?.charAt(0) || 'T')}
                  </div>
                  <div style={{ marginTop: 16, fontSize: 16, color: '#fff', fontWeight: 600 }}>{settings.displayName || 'Traveler'}</div>
                  <div style={{ marginTop: 30, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{passportNumber}</div>
                  <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Issued: {new Date().getFullYear()} | Expires: {new Date().getFullYear() + 10}</div>
                </div>
                {showStampAnimation && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', borderRadius: 16, animation: 'stampPress 1.5s' }}>
                    <div style={{ fontSize: 80, animation: 'stampDrop 0.5s ease-out' }}>📮</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'map' && (
            <div style={{ background: BG2, borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>🗺️ Interactive Map</h2>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Total Distance: {calculateTotalDistance(visitedCodes).toLocaleString()} km</div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: BG3, borderRadius: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: C }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Visited ({totalCountries})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: BG3, borderRadius: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: G }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Wishlist ({settings.wishlist.length})</span>
                  </div>
                </div>
              </div>
              <RealMap 
                visited={visitedCodes} 
                wishlist={settings.wishlist}
                onCountryClick={(code) => {
                  const country = allCountries.find(c => c.code === code)
                  if (country) {
                    setSelectedCountry(country)
                    if (visitedCodes.includes(code)) {
                      setShowDetailModal(code)
                    } else {
                      setShowAddModal(true)
                    }
                  }
                }} 
              />
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                {Object.entries(CONTINENT_COLORS).map(([cont, color]) => (
                  <div key={cont} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: BG3, borderRadius: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{cont}: {continentCounts[cont] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'stamps' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>📮 Passport Stamps</h2>
                <button onClick={() => setShowAddModal(true)} style={{ background: `linear-gradient(135deg, ${C}, #3b9fd4)`, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  + Add Stamp
                </button>
              </div>
              {Object.keys(countries).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: BG2, borderRadius: 20 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🛂</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>No stamps yet!</div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Start your journey and collect passport stamps.</p>
                  <button onClick={() => setShowAddModal(true)} style={{ background: C, color: BG, padding: '12px 24px', borderRadius: 10, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Add Your First Country</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {Object.values(countries).map((country) => {
                    const rotation = Math.random() * 6 - 3
                    return (
                      <div key={country.code} onClick={() => setShowDetailModal(country.code)} style={{ background: BG2, borderRadius: 20, padding: 24, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                          <div style={{ 
                            width: 80, height: 100, 
                            background: `linear-gradient(135deg, ${CONTINENT_COLORS[country.continent]}40, ${CONTINENT_COLORS[country.continent]}20)`,
                            borderRadius: 8, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: `2px solid ${CONTINENT_COLORS[country.continent]}`,
                            transform: `rotate(${rotation}deg)`,
                            opacity: 0.8,
                          }}>
                            <span style={{ fontSize: 40 }}>{country.flag}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{country.name}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{country.visits.length} visit(s)</div>
                            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                              {country.badges.map(b => {
                                const def = BADGE_DEFS.find(d => d.id === b)
                                return def ? <span key={b} style={{ fontSize: 16 }}>{def.icon}</span> : null
                              })}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                          {country.visits[0]?.photos.slice(0, 3).map((photo, i) => (
                            <div key={i} style={{ width: '100%', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: BG3 }}>
                              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                          {[...Array(Math.max(0, 3 - (country.visits[0]?.photos.length || 0)))].map((_, i) => (
                            <div key={`empty-${i}`} style={{ width: '100%', aspectRatio: '1', borderRadius: 8, background: BG3, border: '2px dashed rgba(255,255,255,0.1)' }} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {viewMode === 'photos' && (
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>📸 My Photos ({totalPhotos})</h2>
              {totalPhotos === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: BG2, borderRadius: 20 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>No photos yet!</div>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>Start uploading travel memories!</p>
                </div>
              ) : (
                <div style={{ columns: 3, columnGap: 16 }}>
                  {getAllPhotos().map((photo, i) => (
                    <div key={i} style={{ breakInside: 'avoid', marginBottom: 16, position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                      <img src={photo.url} alt="" style={{ width: '100%', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0.7, display: 'flex', alignItems: 'flex-end', padding: 8 }}>
                        <span style={{ fontSize: 20 }}>{photo.country.flag}</span>
                        <span style={{ fontSize: 12, color: '#fff', marginLeft: 8 }}>{photo.country.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'timeline' && (
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>📅 Travel Timeline</h2>
              {totalVisits === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: BG2, borderRadius: 20 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>No trips yet!</div>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>Your travel timeline will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {Object.values(countries)
                    .flatMap(c => c.visits.map(v => ({ ...v, country: c })))
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 20)
                    .map((visit, i) => (
                      <div key={i} style={{ display: 'flex', gap: 20, background: BG2, borderRadius: 16, padding: 20, alignItems: 'center' }}>
                        <div style={{ width: 60, height: 60, borderRadius: 12, background: `${CONTINENT_COLORS[visit.country.continent]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                          {visit.country.flag}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{visit.country.name}</div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                            {new Date(visit.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {visit.duration} days • {visit.purpose}
                          </div>
                          {visit.companion && <div style={{ fontSize: 12, color: G, marginTop: 4 }}>👥 {visit.companion}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {visit.mood === 'loved' && '❤️'}
                          {visit.mood === 'liked' && '😊'}
                          {visit.mood === 'ok' && '😐'}
                          {visit.mood === 'disliked' && '😕'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'stats' && (
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>📊 Travel Statistics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                <div style={{ background: BG2, borderRadius: 20, padding: 24 }}>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>🌍 Continents Visited</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(continentCounts).sort((a, b) => b[1] - a[1]).map(([cont, count]) => (
                      <div key={cont} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: CONTINENT_COLORS[cont] }} />
                        <div style={{ flex: 1, height: 8, background: BG3, borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${(count / totalCountries) * 100}%`, height: '100%', background: CONTINENT_COLORS[cont], borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 14, color: '#fff', width: 30 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: BG2, borderRadius: 20, padding: 24 }}>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📅 Trips by Year</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(
                      Object.values(countries).flatMap(c => c.visits).reduce((acc, v) => {
                        const year = new Date(v.date).getFullYear()
                        acc[year] = (acc[year] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 5).map(([year, count]) => (
                      <div key={year} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, background: BG3, borderRadius: 8 }}>
                        <span style={{ color: '#fff' }}>{year}</span>
                        <span style={{ color: C, fontWeight: 600 }}>{count} trips</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: BG2, borderRadius: 20, padding: 24 }}>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>✈️ Total Distance</h3>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: C }}>{calculateTotalDistance(visitedCodes).toLocaleString()}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>kilometers traveled</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: G, marginTop: 8 }}>{(calculateTotalDistance(visitedCodes) / 6371).toFixed(1)}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>times around Earth</div>
                  </div>
                </div>
                <div style={{ background: BG2, borderRadius: 20, padding: 24 }}>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>⭐ Average Rating</h3>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: G }}>
                      {(Object.values(countries).flatMap(c => c.visits).reduce((a, v) => a + v.rating, 0) / totalVisits || 0).toFixed(1)}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>out of 5</div>
                    <div style={{ marginTop: 8 }}>⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'leaderboard' && (
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>🏆 Top Travelers</h2>
              <div style={{ background: BG2, borderRadius: 20, padding: 24 }}>
                {[
                  { name: 'Alex Wanderlust', avatar: 'AW', countries: 45, badges: 18, rank: 1 },
                  { name: 'Sarah Globe', avatar: 'SG', countries: 38, badges: 15, rank: 2 },
                  { name: 'Mike Journey', avatar: 'MJ', countries: 32, badges: 12, rank: 3 },
                  { name: 'Emma Travel', avatar: 'ET', countries: 28, badges: 10, rank: 4 },
                  { name: 'John Explorer', avatar: 'JE', countries: 25, badges: 9, rank: 5 },
                  { name: 'Lisa Wanderer', avatar: 'LW', countries: 22, badges: 8, rank: 6 },
                  { name: 'Tom Voyager', avatar: 'TV', countries: 20, badges: 7, rank: 7 },
                  { name: 'Anna Globetrotter', avatar: 'AG', countries: 18, badges: 6, rank: 8 },
                  { name: 'David Explorer', avatar: 'DE', countries: 15, badges: 5, rank: 9 },
                  { name: 'Maria Voyager', avatar: 'MV', countries: 12, badges: 4, rank: 10 },
                ].map((entry, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: i === 0 ? `linear-gradient(135deg, ${G}20, ${G}10)` : BG3, borderRadius: 12, marginBottom: 12, border: `1px solid ${i === 0 ? G : 'transparent'}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? G : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : BG2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: i === 0 ? BG : '#fff' }}>
                      {entry.rank}
                    </div>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg, ${C}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {entry.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{entry.name}</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                        <span>🌍 {entry.countries}</span>
                        <span>🏅 {entry.badges}</span>
                      </div>
                    </div>
                    {i === 0 && <span style={{ fontSize: 24 }}>👑</span>}
                  </div>
                ))}
                <div style={{ marginTop: 24, padding: 20, background: BG3, borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Your Current Rank</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C }}># --</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 40, background: BG2, borderRadius: 20, padding: 24 }}>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🥇 Badge Collection ({earnedBadges.length}/{BADGE_DEFS.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {BADGE_DEFS.map(badge => {
                const earned = earnedBadges.find(b => b.id === badge.id)
                return (
                  <div key={badge.id} style={{ padding: 16, background: earned ? `${C}15` : BG3, borderRadius: 12, textAlign: 'center', border: `1px solid ${earned ? C : 'transparent'}`, opacity: earned ? 1 : 0.4 }}>
                    <div style={{ fontSize: 32, filter: earned ? 'none' : 'grayscale(100%)' }}>{badge.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginTop: 8 }}>{badge.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{badge.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: BG2, borderRadius: 24, padding: 32, maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>➕ Add to Passport</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button 
                onClick={() => setViewMode(viewMode)} 
                style={{ flex: 1, padding: 12, background: `${C}20`, border: `1px solid ${C}`, borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                ✓ Visited
              </button>
              <button 
                onClick={() => {}}
                style={{ flex: 1, padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
              >
                ⭐ Wishlist
              </button>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Select Country</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, maxHeight: 200, overflow: 'auto', padding: 12, background: BG3, borderRadius: 12 }}>
                {unvisitedCountries.filter(c => !settings.wishlist.includes(c.code)).map(country => (
                  <div key={country.code} onClick={() => setSelectedCountry(country)} style={{ padding: 8, borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: selectedCountry?.code === country.code ? `${C}30` : 'transparent', border: `1px solid ${selectedCountry?.code === country.code ? C : 'transparent'}` }}>
                    <div style={{ fontSize: 24 }}>{country.flag}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{country.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Or add to wishlist</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, maxHeight: 120, overflow: 'auto', padding: 12, background: BG3, borderRadius: 12 }}>
                {unvisitedCountries.filter(c => !visitedCodes.includes(c.code)).map(country => (
                  <div key={`wl-${country.code}`} onClick={() => {
                    setSettings(s => ({ ...s, wishlist: [...s.wishlist, country.code] }))
                  }} style={{ padding: 8, borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: settings.wishlist.includes(country.code) ? `${G}30` : 'transparent', border: `1px solid ${settings.wishlist.includes(country.code) ? G : 'transparent'}` }}>
                    <div style={{ fontSize: 24 }}>{country.flag}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>⭐</div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedCountry && (
              <button onClick={addCountry} style={{ width: '100%', background: `linear-gradient(135deg, ${C}, #3b9fd4)`, color: '#000', padding: 16, borderRadius: 12, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>
                🏆 Add to Passport
              </button>
            )}
          </div>
        </div>
      )}

      {showDetailModal && countries[showDetailModal] && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setShowDetailModal(null)}>
          <div style={{ background: BG2, borderRadius: 24, padding: 32, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 48 }}>{countries[showDetailModal].flag}</div>
                <div>
                  <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{countries[showDetailModal].name}</h2>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{countries[showDetailModal].continent}</div>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Add Photos</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[0, 1, 2].map(i => (
                  <label key={i} style={{ aspectRatio: '1', borderRadius: 12, border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', background: BG3 }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 0)} />
                    <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.3)' }}>+</span>
                    {uploadProgress !== null && (
                      <div style={{ position: 'absolute', inset: 0, background: `${C}80`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {uploadProgress}%
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>My Story</label>
              <textarea placeholder="Share your travel experience..." value={countries[showDetailModal].notes} onChange={(e) => setCountries(prev => ({ ...prev, [showDetailModal]: { ...prev[showDetailModal], notes: e.target.value } }))} rows={4} style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', resize: 'vertical' }} />
            </div>
            <button onClick={() => { setCountries(prev => { const { [showDetailModal]: _, ...rest } = prev; return rest }); setShowDetailModal(null) }} style={{ width: '100%', background: `${R}20`, color: R, padding: 12, borderRadius: 8, fontWeight: 600, border: `1px solid ${R}`, cursor: 'pointer' }}>
              🗑️ Delete Stamp
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes stampPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes stampDrop {
          0% { transform: translateY(-100px) scale(2); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .leaflet-container {
          background: #0a1628;
          border-radius: 16px;
        }
        .leaflet-popup-content-wrapper {
          background: #fff;
          border-radius: 12px;
        }
        .leaflet-popup-tip {
          background: #fff;
        }
      `}</style>
    </div>
  )
}
