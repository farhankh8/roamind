'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const BG = '#000814'

const CITIES = [
  { id: 'delhi', name: 'Delhi', code: 'DEL', emoji: '🇮🇳' },
  { id: 'mumbai', name: 'Mumbai', code: 'BOM', emoji: '🇮🇳' },
  { id: 'bangalore', name: 'Bangalore', code: 'BLR', emoji: '🇮🇳' },
  { id: 'chennai', name: 'Chennai', code: 'MAA', emoji: '🇮🇳' },
  { id: 'kolkata', name: 'Kolkata', code: 'CCU', emoji: '🇮🇳' },
  { id: 'hyderabad', name: 'Hyderabad', code: 'HYD', emoji: '🇮🇳' },
  { id: 'pune', name: 'Pune', code: 'PNQ', emoji: '🇮🇳' },
  { id: 'goa', name: 'Goa', code: 'GOI', emoji: '🇮🇳' },
  { id: 'jaipur', name: 'Jaipur', code: 'JAI', emoji: '🇮🇳' },
  { id: 'lucknow', name: 'Lucknow', code: 'LKO', emoji: '🇮🇳' },
  { id: 'cochin', name: 'Kochi', code: 'COK', emoji: '🇮🇳' },
  { id: 'ahmedabad', name: 'Ahmedabad', code: 'AMD', emoji: '🇮🇳' },
  { id: 'chandigarh', name: 'Chandigarh', code: 'IXC', emoji: '🇮🇳' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', code: 'BBI', emoji: '🇮🇳' },
  { id: 'guwahati', name: 'Guwahati', code: 'GAU', emoji: '🇮🇳' },
  { id: 'srinagar', name: 'Srinagar', code: 'SXR', emoji: '🇮🇳' },
  { id: 'port_blair', name: 'Port Blair', code: 'IXZ', emoji: '🇮🇳' },
  { id: 'mangalore', name: 'Mangalore', code: 'IXE', emoji: '🇮🇳' },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', code: 'TRZ', emoji: '🇮🇳' },
  { id: 'varanasi', name: 'Varanasi', code: 'VNS', emoji: '🇮🇳' },
  { id: 'dubai', name: 'Dubai', code: 'DXB', emoji: '🇦🇪' },
  { id: 'singapore', name: 'Singapore', code: 'SIN', emoji: '🇸🇬' },
  { id: 'bangkok', name: 'Bangkok', code: 'BKK', emoji: '🇹🇭' },
  { id: 'london', name: 'London', code: 'LHR', emoji: '🇬🇧' },
  { id: 'new_york', name: 'New York', code: 'JFK', emoji: '🇺🇸' },
  { id: 'paris', name: 'Paris', code: 'CDG', emoji: '🇫🇷' },
  { id: 'tokyo', name: 'Tokyo', code: 'NRT', emoji: '🇯🇵' },
  { id: 'sydney', name: 'Sydney', code: 'SYD', emoji: '🇦🇺' },
  { id: 'kuala_lumpur', name: 'Kuala Lumpur', code: 'KUL', emoji: '🇲🇾' },
  { id: 'hong_kong', name: 'Hong Kong', code: 'HKG', emoji: '🇭🇰' },
  { id: 'maldives', name: 'Male', code: 'MLE', emoji: '🇲🇻' },
  { id: 'doha', name: 'Doha', code: 'DOH', emoji: '🇶🇦' },
  { id: 'muscat', name: 'Muscat', code: 'MCT', emoji: '🇴🇲' },
  { id: 'colombo', name: 'Colombo', code: 'CMB', emoji: '🇱🇰' },
  { id: 'kathmandu', name: 'Kathmandu', code: 'KTM', emoji: '🇳🇵' },
  { id: 'frankfurt', name: 'Frankfurt', code: 'FRA', emoji: '🇩🇪' },
  { id: 'amsterdam', name: 'Amsterdam', code: 'AMS', emoji: '🇳🇱' },
  { id: 'zurich', name: 'Zurich', code: 'ZRH', emoji: '🇨🇭' },
]

const AIRLINES = [
  { name: 'IndiGo', code: '6E', color: '#0057e7', url: 'https://www.goindigo.in' },
  { name: 'Air India', code: 'AI', color: '#e31837', url: 'https://www.airindia.in' },
  { name: 'Vistara', code: 'UK', color: '#8256d0', url: 'https://www.airvistara.com' },
  { name: 'SpiceJet', code: 'SG', color: '#ff9f1a', url: 'https://www.spicejet.com' },
  { name: 'Emirates', code: 'EK', color: '#d71921', url: 'https://www.emirates.com' },
  { name: 'Qatar Airways', code: 'QR', color: '#5a0d80', url: 'https://www.qatarairways.com' },
  { name: 'Singapore Airlines', code: 'SQ', color: '#f5a623', url: 'https://www.singaporeair.com' },
  { name: 'Thai Airways', code: 'TG', color: '#4b286d', url: 'https://www.thaiairways.com' },
  { name: 'Oman Air', code: 'WY', color: '#8bc34a', url: 'https://www.omanair.com' },
  { name: 'SriLankan Airlines', code: 'UL', color: '#f9a825', url: 'https://www.srilankan.com' },
]

const BOOKING_SITES = [
  { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/flights', icon: '🟠', color: '#ff6b00', features: ['Best India Deals', '24/7 Support'] },
  { name: 'Cleartrip', url: 'https://www.cleartrip.com/flights', icon: '🔵', color: '#2196f3', features: ['Easy Interface', 'Fast Booking'] },
  { name: 'EaseMyTrip', url: 'https://www.easemytrip.com/flights', icon: '🟢', color: '#4caf50', features: ['No Markup', 'Best Prices'] },
  { name: 'Goibibo', url: 'https://www.goibibo.com/flights', icon: '🟡', color: '#ffcc00', features: ['Price Beat', 'MMT Refund'] },
  { name: 'Google Flights', url: 'https://www.google.com/travel/flights', icon: '🔍', color: '#4285f4', features: ['Compare All', 'Price Graph'] },
  { name: 'Skyscanner', url: 'https://www.skyscanner.com', icon: '🌤️', color: '#00d084', features: ['Any Date', 'Best Deals'] },
  { name: 'Kiwi.com', url: 'https://www.kiwi.com', icon: '🥝', color: '#84cc16', features: ['Multi-City', 'Guarantee'] },
  { name: 'Expedia', url: 'https://www.expedia.com/Flights', icon: '✈️', color: '#003580', features: ['Bundle Save', 'Rewards'] },
]

const FLIGHT_TIPS = [
  { icon: '📅', title: 'Book 6-8 Weeks Ahead', desc: 'Domestic flights are cheapest 6-8 weeks before. International flights are best booked 2-3 months ahead.' },
  { icon: '🕐', title: 'Tuesday is Best Day', desc: 'Tuesdays are typically the cheapest day to book flights. Avoid Fridays and weekends.' },
  { icon: '🔄', title: 'Use Flexible Dates', desc: 'Use +/- 3 day filters. Shifting dates by 2-3 days can save you 20-30%.' },
  { icon: '🛑', title: 'Check Layover Visas', desc: 'Long layovers mean cheaper flights, but check if you need a transit visa!' },
  { icon: '🎒', title: 'Baggage Matters', desc: 'Basic fares exclude checked bags. Calculate total cost including baggage fees.' },
  { icon: '🔍', title: 'Use Incognito Mode', desc: 'Search in private mode. Some sites track cookies and show higher prices.' },
  { icon: '💳', title: 'Use Right Card', desc: 'HDFC/Axis cards offer 5-10% off on flight bookings. Use them for extra savings!' },
  { icon: '⏰', title: 'Set Price Alerts', desc: 'Set up price alerts on Google Flights. Get notified when prices drop.' },
]

interface Flight {
  id: string
  airline: string
  airlineCode: string
  airlineColor: string
  airlineUrl: string
  from: string
  fromCode: string
  to: string
  toCode: string
  departure: string
  arrival: string
  duration: string
  durationMin: number
  stops: number
  stopDetails: string
  price: string
  priceNum: number
}

function generateFlights(fromId: string, toId: string): Flight[] {
  const from = CITIES.find(c => c.id === fromId)
  const to = CITIES.find(c => c.id === toId)
  if (!from || !to) return []

  const flights = []
  const airlines = AIRLINES.slice(0, 8)
  const basePrice = 3000 + Math.random() * 25000
  
    for (let i = 0; i < 10; i++) {
      const airline = airlines[i % airlines.length]
      const stops = Math.random() > 0.5 ? 0 : 1
      const depHour = 4 + Math.floor(Math.random() * 17)
      const depMin = Math.floor(Math.random() * 60)
      const durationBase = 90 + Math.floor(Math.random() * 300) + (stops * 90)
      const arrHour = (depHour + Math.floor(durationBase / 60)) % 24
      const arrMin = (depMin + (durationBase % 60)) % 60
      const availableStopCities = CITIES.filter(c => c.id !== fromId && c.id !== toId)
      const stopCity = stops === 1 ? availableStopCities[Math.floor(Math.random() * availableStopCities.length)]?.name ?? '' : ''
      const priceMultiplier = stops === 0 ? 1.4 : 1
      const finalPrice = basePrice * priceMultiplier * (0.8 + Math.random() * 0.4)
    
    flights.push({
      id: `flight-${i}-${Date.now()}`,
      airline: airline.name,
      airlineCode: airline.code,
      airlineColor: airline.color,
      airlineUrl: airline.url,
      from: from.name,
      fromCode: from.code,
      to: to.name,
      toCode: to.code,
      departure: `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`,
      arrival: `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`,
      duration: `${Math.floor(durationBase / 60)}h ${durationBase % 60}m`,
      durationMin: durationBase,
      stops: stops,
      stopDetails: stops === 0 ? 'Non-stop' : `1 Stop via ${stopCity}`,
      price: `₹${Math.round(finalPrice).toLocaleString('en-IN')}`,
      priceNum: finalPrice,
    })
  }
  
  return flights.sort((a, b) => a.priceNum - b.priceNum)
}

export default function Flights() {
  const router = useRouter()
  const { user, loading, signOut: doSignOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath] = useState('/flights')

  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [tripType, setTripType] = useState('oneway')
  const [passengers, setPassengers] = useState(1)

  const [flights, setFlights] = useState<Flight[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price')

  const [fareTracker, setFareTracker] = useState<{active: boolean; basePrice: number; currentPrice: number; trend: 'up' | 'down' | 'stable' | null}>({active: false, basePrice: 0, currentPrice: 0, trend: null})
  const [cabinClass, setCabinClass] = useState<'economy' | 'business' | 'first'>('economy')
  const [multiCityLegs, setMultiCityLegs] = useState<{from: string; to: string; date: string}[]>([{from: '', to: '', date: ''}])
  const [showMultiCity, setShowMultiCity] = useState(false)
  const [pricePredictor, setPricePredictor] = useState<{show: boolean; prediction: string; confidence: number; trend: 'rise' | 'fall' | 'stable'} | null>(null)
  const [seatMapFlight, setSeatMapFlight] = useState<Flight | null>(null)
  const [seatMapData, setSeatMapData] = useState<{ row: number; col: string; isOccupied: boolean; isPremium: boolean; price: number }[]>([])
  const [priceHistory, setPriceHistory] = useState<{date: string; price: number}[]>([])
  const [filters, setFilters] = useState({ stops: [] as number[], priceRange: [0, 100000] as [number, number], airlines: [] as string[], departureTime: [] as string[] })
  const [showFareCalendar, setShowFareCalendar] = useState(false)
  const [fareCalendarData, setFareCalendarData] = useState<{date: string; price: number; available: boolean}[]>([])
  const [recentSearches, setRecentSearches] = useState<{from: string; to: string; date: string}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentFlightSearches')
      if (saved) {
        try { return JSON.parse(saved) } catch { return [] }
      }
    }
    return []
  })
  const [compareFlights, setCompareFlights] = useState<Flight[]>([])
  const [showCompareDrawer, setShowCompareDrawer] = useState(false)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  const AIRPORT_INFO = [
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', terminals: 3, facilities: ['WiFi', 'Lounges', 'Duty Free', 'Food Court'], transport: ['Metro', 'Taxi', 'Bus'], emoji: '🇮🇳' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', terminals: 2, facilities: ['WiFi', 'Lounges', 'Duty Free', 'Spa'], transport: ['Taxi', 'Bus', 'Train'], emoji: '🇮🇳' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', terminals: 1, facilities: ['WiFi', 'Lounges', 'Duty Free'], transport: ['Taxi', 'Bus'], emoji: '🇮🇳' },
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', terminals: 3, facilities: ['WiFi', 'Lounges', 'Duty Free', 'Swimming Pool'], transport: ['Metro', 'Taxi', 'Bus'], emoji: '🇦🇪' },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', terminals: 4, facilities: ['WiFi', 'Lounges', 'Duty Free', 'Jewel'], transport: ['MRT', 'Taxi', 'Bus'], emoji: '🇸🇬' },
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', terminals: 4, facilities: ['WiFi', 'Lounges', 'Duty Free'], transport: ['Tube', 'Taxi', 'Bus'], emoji: '🇬🇧' },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentFlightSearches', JSON.stringify(recentSearches))
    }
  }, [recentSearches])

  const generateFareAlerts = () => {
    if (flights.length === 0) return
    const base = flights[0]?.priceNum || 5000
    setFareTracker({ active: true, basePrice: base, currentPrice: base, trend: 'stable' })
  }

  const predictPrice = (): { prediction: string; confidence: number; trend: 'rise' | 'fall' | 'stable' } => {
    const rand = Math.random()
    if (rand < 0.3) return { prediction: 'Expected to drop 10-20%', confidence: 75, trend: 'fall' }
    if (rand < 0.6) return { prediction: 'Expected to rise 5-15%', confidence: 68, trend: 'rise' }
    return { prediction: 'Prices expected to remain stable', confidence: 82, trend: 'stable' }
  }

  const handleShowSeatMap = useCallback((flight: Flight) => {
    const rows = 30
    const seats: { row: number; col: string; isOccupied: boolean; isPremium: boolean; price: number }[] = []
    for (let r = 1; r <= rows; r++) {
      for (const col of ['A', 'B', 'C', 'D', 'E', 'F']) {
        const isOccupied = Math.random() > 0.7
        const isPremium = r <= 5
        seats.push({ row: r, col, isOccupied, isPremium, price: isPremium ? 150 : 50 })
      }
    }
    setSeatMapFlight(flight)
    setSeatMapData(seats)
  }, [])

  const generatePriceHistory = (basePrice: number) => {
    const data = []
    const now = new Date()
    for (let i = 30; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const variance = (Math.random() - 0.5) * 0.3
      data.push({ date: d.toISOString().split('T')[0], price: Math.round(basePrice * (1 + variance)) })
    }
    return data
  }

  const generateFareCalendar = () => {
    const data = []
    const now = new Date()
    for (let i = 0; i < 60; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() + i)
      const isAvailable = Math.random() > 0.2
      const basePrice = flights[0]?.priceNum || 5000
      const price = isAvailable ? basePrice * (0.7 + Math.random() * 0.6) : 0
      data.push({ date: d.toISOString().split('T')[0], price: Math.round(price), available: isAvailable })
    }
    return data
  }

  const handleSaveSearch = () => {
    if (!fromCity || !toCity) return
    const newSearch = { from: fromCity, to: toCity, date: departDate }
    const updated = [newSearch, ...recentSearches.filter(s => !(s.from === fromCity && s.to === toCity))].slice(0, 5)
    setRecentSearches(updated)
  }

  const handleAddToCompare = (flight: Flight) => {
    if (compareFlights.find(f => f.id === flight.id)) return
    if (compareFlights.length >= 3) {
      setCompareFlights([...compareFlights.slice(1), flight])
    } else {
      setCompareFlights([...compareFlights, flight])
    }
  }

  const handleRemoveFromCompare = (flightId: string) => {
    setCompareFlights(compareFlights.filter(f => f.id !== flightId))
  }

  const handleSwap = () => {
    const temp = fromCity
    setFromCity(toCity)
    setToCity(temp)
  }

  const handleSearchWithDate = () => {
    if (!fromCity || !toCity || !departDate) return
    setHasSearched(true)
    const results = generateFlights(fromCity, toCity)
    setFlights(results)
    handleSaveSearch()
    if (results.length > 0) {
      const basePrice = results[0].priceNum
      setPriceHistory(generatePriceHistory(basePrice))
      setPricePredictor({ show: true, ...predictPrice() })
      setFareTracker({ active: true, basePrice, currentPrice: basePrice, trend: 'stable' })
    }
  }

  const filteredFlights = [...flights].filter(f => {
    if (filters.stops.length > 0 && !filters.stops.includes(f.stops)) return false
    if (f.priceNum < filters.priceRange[0] || f.priceNum > filters.priceRange[1]) return false
    if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'price') return a.priceNum - b.priceNum
    return a.durationMin - b.durationMin
  })

  const handleLogout = () => doSignOut().then(() => router.push('/landing'))

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()
  const fromCityData = CITIES.find(c => c.id === fromCity)
  const toCityData = CITIES.find(c => c.id === toCity)

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
              <div style={{ fontSize: 14, fontWeight: 600 }}>✈️ Search Flights</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Find the best flight deals</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 10 }}>
              <span style={{ fontSize: 12 }}>✈️</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>100+ Airlines</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { icon: '✈️', label: 'Airlines', value: '100+', color: C },
              { icon: '🌍', label: 'Countries', value: '40+', color: G },
              { icon: '💰', label: 'Avg Domestic', value: '₹3K+', color: C },
              { icon: '⭐', label: 'User Rating', value: '4.8', color: G },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}16`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.border = `1px solid ${s.color}30`; e.currentTarget.style.boxShadow = `0 8px 28px ${s.color}0e` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = `1px solid ${s.color}16`; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}12`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.32)', marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* SEARCH BOX - MATCHING DASHBOARD STYLE */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 18, padding: 22, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button onClick={() => setTripType('oneway')} style={{ padding: '7px 16px', background: tripType === 'oneway' ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${tripType === 'oneway' ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, color: tripType === 'oneway' ? C : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                One Way
              </button>
              <button onClick={() => setTripType('roundtrip')} style={{ padding: '7px 16px', background: tripType === 'roundtrip' ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${tripType === 'roundtrip' ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, color: tripType === 'roundtrip' ? C : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                Round Trip
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>From</label>
                <select value={fromCity} onChange={(e) => setFromCity(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                  <option value="" style={{ background: '#05090f' }}>Select City</option>
                  {CITIES.map(c => <option key={c.id} value={c.id} style={{ background: '#05090f' }}>{c.emoji} {c.name} ({c.code})</option>)}
                </select>
              </div>

              <button onClick={handleSwap} style={{ width: 40, height: 40, background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: C, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.2)'; e.currentTarget.style.transform = 'scale(1.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.1)'; e.currentTarget.style.transform = 'scale(1)' }}
              >⇄</button>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>To</label>
                <select value={toCity} onChange={(e) => setToCity(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                  <option value="" style={{ background: '#05090f' }}>Select City</option>
                  {CITIES.map(c => <option key={c.id} value={c.id} style={{ background: '#05090f' }}>{c.emoji} {c.name} ({c.code})</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Departure</label>
                <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ width: 120 }}>
                <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Passengers</label>
                <select value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ background: '#05090f' }}>{n}</option>)}
                </select>
              </div>
              <div style={{ width: 130 }}>
                <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Class</label>
                <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value as 'economy' | 'business' | 'first')} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                  <option value="economy" style={{ background: '#05090f' }}>Economy</option>
                  <option value="business" style={{ background: '#05090f' }}>Business</option>
                  <option value="first" style={{ background: '#05090f' }}>First Class</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button onClick={() => setShowMultiCity(!showMultiCity)} style={{ padding: '6px 14px', background: showMultiCity ? 'rgba(255,183,77,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showMultiCity ? G : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, color: showMultiCity ? G : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                🔄 Multi-City
              </button>
              <button onClick={() => { setShowFiltersPanel(!showFiltersPanel) }} style={{ padding: '6px 14px', background: showFiltersPanel ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showFiltersPanel ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, color: showFiltersPanel ? C : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                🔍 Filters
              </button>
              <button onClick={() => { setShowFareCalendar(!showFareCalendar); if (!showFareCalendar) setFareCalendarData(generateFareCalendar()) }} style={{ padding: '6px 14px', background: showFareCalendar ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showFareCalendar ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, color: showFareCalendar ? C : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                📅 Fare Calendar
              </button>
            </div>

            <button onClick={handleSearchWithDate} disabled={!fromCity || !toCity || !departDate} style={{ width: '100%', background: (!fromCity || !toCity || !departDate) ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg,${C},#3bb8e8)`, border: 'none', borderRadius: 12, padding: '14px 24px', color: (!fromCity || !toCity || !departDate) ? 'rgba(255,255,255,0.3)' : '#000814', fontSize: 14, fontWeight: 700, cursor: (!fromCity || !toCity || !departDate) ? 'not-allowed' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onMouseEnter={e => { if (fromCity && toCity && departDate) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${C}40` } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              🔍 Search Flights
            </button>

            {/* MULTI-CITY TRIP PLANNER */}
            {showMultiCity && (
              <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: G, marginBottom: 12 }}>🔄 Multi-City Trip Planner</div>
                {multiCityLegs.map((leg, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${G}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: G }}>{idx + 1}</div>
                    <select value={leg.from} onChange={(e) => { const updated = [...multiCityLegs]; updated[idx].from = e.target.value; setMultiCityLegs(updated) }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
                      <option value="" style={{ background: '#05090f' }}>From</option>
                      {CITIES.map(c => <option key={c.id} value={c.id} style={{ background: '#05090f' }}>{c.emoji} {c.code}</option>)}
                    </select>
                    <span style={{ color: G }}>→</span>
                    <select value={leg.to} onChange={(e) => { const updated = [...multiCityLegs]; updated[idx].to = e.target.value; setMultiCityLegs(updated) }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
                      <option value="" style={{ background: '#05090f' }}>To</option>
                      {CITIES.map(c => <option key={c.id} value={c.id} style={{ background: '#05090f' }}>{c.emoji} {c.code}</option>)}
                    </select>
                    <input type="date" value={leg.date} onChange={(e) => { const updated = [...multiCityLegs]; updated[idx].date = e.target.value; setMultiCityLegs(updated) }} style={{ width: 120, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: 12 }} />
                  </div>
                ))}
                <button onClick={() => setMultiCityLegs([...multiCityLegs, {from: '', to: '', date: ''}])} style={{ padding: '6px 12px', background: 'rgba(255,183,77,0.1)', border: `1px solid ${G}30`, borderRadius: 8, color: G, fontSize: 11, cursor: 'pointer', marginTop: 8 }}>+ Add Another Leg</button>
              </div>
            )}

            {/* FARE CALENDAR */}
            {showFareCalendar && fareCalendarData.length > 0 && (
              <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 12 }}>📅 Fare Calendar - Next 60 Days</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                  {fareCalendarData.slice(0, 30).map((day, idx) => (
                    <div key={idx} style={{ background: day.available ? 'rgba(99,210,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${day.available ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: 8, textAlign: 'center', cursor: day.available ? 'pointer' : 'default', opacity: day.available ? 1 : 0.5 }}
                      onMouseEnter={e => { if (day.available) { e.currentTarget.style.background = 'rgba(99,210,255,0.2)'; e.currentTarget.style.transform = 'scale(1.05)' } }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.08)'; e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{day.date.slice(5)}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: day.available ? C : 'rgba(255,255,255,0.3)' }}>{day.available ? `₹${Math.round(day.price).toLocaleString('en-IN')}` : 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RESULTS */}
          {hasSearched && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {fromCityData?.emoji} {fromCityData?.name} → {toCityData?.emoji} {toCityData?.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {departDate} · {passengers} passenger{passengers > 1 ? 's' : ''} · {filteredFlights.length} flights found
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'price' | 'duration')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12, outline: 'none', cursor: 'pointer' }}>
                    <option value="price" style={{ background: '#05090f' }}>Sort: Price</option>
                    <option value="duration" style={{ background: '#05090f' }}>Sort: Duration</option>
                  </select>
                </div>
              </div>

              {/* FLIGHT CARDS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {filteredFlights.map((flight, idx) => (
                  <div key={flight.id} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${flight.airlineColor}25`, borderRadius: 16, padding: 18, transition: 'all 0.25s', animation: `fadeIn 0.3s ease ${idx * 0.05}s both`, position: 'relative' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = flight.airlineColor; e.currentTarget.style.boxShadow = `0 12px 32px ${flight.airlineColor}15` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${flight.airlineColor}25`; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    {/* PRICE PREDICTOR BADGE */}
                    {idx === 0 && pricePredictor && (
                      <div style={{ position: 'absolute', top: -10, right: 80, background: pricePredictor.trend === 'fall' ? 'rgba(81,207,102,0.2)' : pricePredictor.trend === 'rise' ? 'rgba(255,107,107,0.2)' : 'rgba(255,183,77,0.2)', border: `1px solid ${pricePredictor.trend === 'fall' ? '#51cf66' : pricePredictor.trend === 'rise' ? R : G}`, borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, zIndex: 10 }}>
                        <span style={{ fontSize: 12 }}>{pricePredictor.trend === 'fall' ? '📉' : pricePredictor.trend === 'rise' ? '📈' : '➡️'}</span>
                        <span style={{ fontSize: 9, color: pricePredictor.trend === 'fall' ? '#51cf66' : pricePredictor.trend === 'rise' ? R : G, fontWeight: 600 }}>{pricePredictor.confidence}%</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ background: flight.airlineColor, padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 800, color: '#fff', minWidth: 50, textAlign: 'center' }}>
                          {flight.airlineCode}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{flight.airline}</div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{flight.stopDetails}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, justifyContent: 'center', minWidth: 280 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{flight.departure}</div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{flight.fromCode}</div>
                        </div>

                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{flight.duration}</div>
                          <div style={{ height: 2, background: `linear-gradient(90deg, ${flight.airlineColor}, ${C})`, borderRadius: 2, position: 'relative', minWidth: 80 }}>
                            <div style={{ position: 'absolute', left: 0, top: -4, width: 10, height: 10, borderRadius: '50%', background: flight.airlineColor }} />
                            <div style={{ position: 'absolute', right: 0, top: -4, width: 10, height: 10, borderRadius: '50%', background: C }} />
                          </div>
                          <div style={{ fontSize: 10.5, color: flight.stops === 0 ? '#51cf66' : G, marginTop: 4 }}>
                            {flight.stops === 0 ? 'Direct ✈️' : `${flight.stops} Stop(s)`}
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{flight.arrival}</div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>{flight.toCode}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 24, fontWeight: 900, color: G }}>{flight.price}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>per person</div>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button onClick={() => handleShowSeatMap(flight)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                          >💺 Seat Map</button>
                          <button onClick={() => handleAddToCompare(flight)} style={{ padding: '8px 12px', background: 'rgba(255,183,77,0.1)', border: `1px solid ${G}30`, borderRadius: 8, color: G, fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${G}20` }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,183,77,0.1)' }}
                          >⚖️ Compare</button>
                          <a href={flight.airlineUrl} target="_blank" rel="noopener noreferrer" style={{ background: `linear-gradient(135deg,${C},#3bb8e8)`, padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#000814', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 4px 16px ${C}40` }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                          >Book Now</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRICE HISTORY MINI CHART */}
              {priceHistory.length > 0 && (
                <div style={{ marginBottom: 20, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 12 }}>📊 Price History (Last 30 Days)</div>
                  <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    {priceHistory.filter((_, i) => i % 3 === 0).map((point, idx) => {
                      const maxPrice = Math.max(...priceHistory.map(p => p.price))
                      const minPrice = Math.min(...priceHistory.map(p => p.price))
                      const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 60 + 10
                      return (
                        <div key={idx} style={{ flex: 1, background: C, borderRadius: 2, height: `${height}px`, opacity: 0.7, transition: 'all 0.2s', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = G }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.background = C }}
                          title={`${point.date}: ₹${point.price.toLocaleString('en-IN')}`}
                        />
                      )
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>
                    <span>{priceHistory[0]?.date}</span>
                    <span>₹{Math.min(...priceHistory.map(p => p.price)).toLocaleString('en-IN')}</span>
                    <span>₹{Math.max(...priceHistory.map(p => p.price)).toLocaleString('en-IN')}</span>
                    <span>{priceHistory[priceHistory.length-1]?.date}</span>
                  </div>
                </div>
              )}

              {/* LIVE FARE TRACKER STRIP */}
              {fareTracker.active && (
                <div style={{ marginBottom: 20, background: 'linear-gradient(90deg,rgba(99,210,255,0.1),rgba(255,183,77,0.1))', border: `1px solid ${C}30`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>📈</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Live Fare Tracker</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Base: ₹{fareTracker.basePrice.toLocaleString('en-IN')} · Current: ₹{fareTracker.currentPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ padding: '4px 10px', background: fareTracker.trend === 'down' ? 'rgba(81,207,102,0.2)' : fareTracker.trend === 'up' ? 'rgba(255,107,107,0.2)' : 'rgba(255,183,77,0.2)', borderRadius: 20, fontSize: 11, fontWeight: 600, color: fareTracker.trend === 'down' ? '#51cf66' : fareTracker.trend === 'up' ? R : G }}>
                      {fareTracker.trend === 'down' ? '↓ Prices Dropping' : fareTracker.trend === 'up' ? '↑ Prices Rising' : '➡️ Stable'}
                    </div>
                    <button onClick={generateFareAlerts} style={{ padding: '6px 12px', background: `${C}20`, border: `1px solid ${C}`, borderRadius: 8, color: C, fontSize: 11, cursor: 'pointer' }}>🔔 Set Alert</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* RECENTLY SEARCHED ROUTES - Always visible */}
          {recentSearches.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 12 }}>🕐 Recently Searched Routes</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {recentSearches.map((search, idx) => {
                  const fromData = CITIES.find(c => c.id === search.from)
                  const toData = CITIES.find(c => c.id === search.to)
                  return (
                    <button key={idx} onClick={() => { setFromCity(search.from); setToCity(search.to); setDepartDate(search.date); handleSearchWithDate() }} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,210,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      <span style={{ fontSize: 16 }}>{fromData?.emoji}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>→</span>
                      <span style={{ fontSize: 16 }}>{toData?.emoji}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>{search.date?.slice(5) || ''}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* FILTERS SIDEBAR PANEL - Always visible */}
          {showFiltersPanel && hasSearched && (
            <div style={{ marginBottom: 20, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 14 }}>🔍 Filters</div>
              
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Stops</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[0, 1, 2].map(stop => (
                    <button key={stop} onClick={() => { const updated = filters.stops.includes(stop) ? filters.stops.filter(s => s !== stop) : [...filters.stops, stop]; setFilters({...filters, stops: updated}) }} style={{ padding: '6px 12px', background: filters.stops.includes(stop) ? 'rgba(99,210,255,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${filters.stops.includes(stop) ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: filters.stops.includes(stop) ? C : 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer' }}>
                      {stop === 0 ? 'Non-stop' : stop === 1 ? '1 Stop' : '2+ Stops'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Price Range</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" value={filters.priceRange[0]} onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]})} style={{ width: 80, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: 11 }} placeholder="Min" />
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>to</span>
                  <input type="number" value={filters.priceRange[1]} onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value) || 100000]})} style={{ width: 80, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '6px 10px', color: '#fff', fontSize: 11 }} placeholder="Max" />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Airlines</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {AIRLINES.slice(0, 6).map(airline => (
                    <button key={airline.code} onClick={() => { const updated = filters.airlines.includes(airline.name) ? filters.airlines.filter(a => a !== airline.name) : [...filters.airlines, airline.name]; setFilters({...filters, airlines: updated}) }} style={{ padding: '4px 10px', background: filters.airlines.includes(airline.name) ? `${airline.color}30` : 'rgba(255,255,255,0.03)', border: `1px solid ${filters.airlines.includes(airline.name) ? airline.color : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, color: filters.airlines.includes(airline.name) ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: 10, cursor: 'pointer' }}>
                      {airline.code}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setFilters({ stops: [], priceRange: [0, 100000], airlines: [], departureTime: [] })} style={{ marginTop: 12, padding: '6px 12px', background: 'rgba(255,107,107,0.1)', border: `1px solid ${R}30`, borderRadius: 8, color: R, fontSize: 11, cursor: 'pointer' }}>Clear All Filters</button>
            </div>
          )}

          {/* AIRPORT INFORMATION CARDS */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: G, marginBottom: 12 }}>🛫 Popular Airports</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {AIRPORT_INFO.map((airport, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,183,77,0.1)', borderRadius: 12, padding: 14, transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = G }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,183,77,0.1)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{airport.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{airport.code}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{airport.city}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{airport.name}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                    {airport.facilities.slice(0, 3).map((f, i) => (
                      <span key={i} style={{ fontSize: 8, color: C, background: `${C}15`, padding: '2px 6px', borderRadius: 4 }}>{f}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Transport: {airport.transport.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>💡 Flight Booking Tips</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {FLIGHT_TIPS.map((tip, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.025)', padding: 14, borderRadius: 12, border: '1px solid rgba(99,210,255,0.08)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = C }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,210,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{tip.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C }}>{tip.title}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING SITES */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📅 Flight Booking Platforms</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {BOOKING_SITES.map((site, i) => (
                <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${site.color}30`, borderRadius: 12, padding: 14, textDecoration: 'none', transition: 'all 0.25s', display: 'block' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = site.color; e.currentTarget.style.boxShadow = `0 10px 28px ${site.color}15` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${site.color}30`; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{site.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{site.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {site.features.map((f, idx) => (
                      <span key={idx} style={{ fontSize: 9.5, color: site.color, background: `${site.color}15`, padding: '2px 6px', borderRadius: 6 }}>{f}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SEAT MAP MODAL */}
      {seatMapFlight && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,5,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 20 }} onClick={() => setSeatMapFlight(null)}>
          <div style={{ background: '#05090f', border: `1px solid ${C}30`, borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>💺 Seat Map</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{seatMapFlight.airline} · {seatMapFlight.fromCode} → {seatMapFlight.toCode}</div>
              </div>
              <button onClick={() => setSeatMapFlight(null)} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ background: 'rgba(99,210,255,0.05)', border: `1px solid ${C}20`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>AIRCRAFT LAYOUT</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
                {seatMapData.slice(0, 72).map((seat, idx) => (
                  <div key={idx} style={{ padding: '8px 4px', borderRadius: 4, fontSize: 10, textAlign: 'center', cursor: seat.isOccupied ? 'not-allowed' : 'pointer', background: seat.isOccupied ? 'rgba(255,107,107,0.3)' : seat.isPremium ? 'rgba(255,183,77,0.2)' : 'rgba(81,207,102,0.2)', color: seat.isOccupied ? R : seat.isPremium ? G : '#51cf66', opacity: seat.isOccupied ? 0.6 : 1 }}>
                    {seat.row}{seat.col}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(81,207,102,0.3)' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Available (₹50)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,183,77,0.3)' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Premium (₹150)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255,107,107,0.3)' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Occupied</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLIGHT COMPARISON DRAWER */}
      {showCompareDrawer && compareFlights.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#05090f', borderTop: `1px solid ${G}30`, borderRadius: '20px 20px 0 0', padding: 20, zIndex: 55, maxHeight: '60vh', overflow: 'auto', animation: 'slideUp 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: G }}>⚖️ Flight Comparison</div>
            <button onClick={() => setShowCompareDrawer(false)} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 14, cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareFlights.length}, 1fr)`, gap: 12 }}>
            {compareFlights.map((flight, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${flight.airlineColor}30`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: flight.airlineColor, padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#fff' }}>{flight.airlineCode}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{flight.airline}</div>
                  <button onClick={() => handleRemoveFromCompare(flight.id)} style={{ marginLeft: 'auto', width: 20, height: 20, background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: 4, color: R, fontSize: 10, cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                  <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Departure:</span> <span style={{ color: '#fff' }}>{flight.departure}</span></div>
                  <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Arrival:</span> <span style={{ color: '#fff' }}>{flight.arrival}</span></div>
                  <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Duration:</span> <span style={{ color: '#fff' }}>{flight.duration}</span></div>
                  <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Stops:</span> <span style={{ color: flight.stops === 0 ? '#51cf66' : G }}>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</span></div>
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Price:</span> <span style={{ color: G, fontWeight: 700, fontSize: 16 }}>{flight.price}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPARE FLOATING BUTTON */}
      {compareFlights.length > 0 && !showCompareDrawer && (
        <button onClick={() => setShowCompareDrawer(true)} style={{ position: 'fixed', bottom: 24, right: 24, background: `linear-gradient(135deg,${G},#e5a33d)`, border: 'none', borderRadius: 50, padding: '14px 20px', color: '#000814', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 24px ${G}40`, zIndex: 50, display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚖️ Compare ({compareFlights.length})
        </button>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  )
}
