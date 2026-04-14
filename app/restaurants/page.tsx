'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'
import { ALL_CITIES, RESTAURANTS_BY_CITY, FOOD_TIPS, BOOKING_PLATFORMS, DELIVERY_PLATFORMS, CUISINE_TYPES, BUDGET_LEVELS, DIETARY_OPTIONS, getMichelinRestaurants } from './data'
import { Restaurant } from './types'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const BG = '#000814'

const COLORS = [
  '#ff9800', '#e53935', '#7b1fa2', '#00bcd4', '#4caf50', '#f44336', '#9c27b0', '#3f51b5', '#009688', '#ff5722', '#ffc107', '#673ab7', '#03a9f4', '#e91e63', '#795548', '#607d8b'
]

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

export default function Restaurants() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/restaurants')
  
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dietFilter, setDietFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [cuisineFilter, setCuisineFilter] = useState('all')
  const [sortMode, setSortMode] = useState('rating')
  const [viewMode, setViewMode] = useState<'all' | 'india' | 'international'>('all')

  // Feature 1: Restaurant Detail Modal
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  // Feature 2: Quick Compare Mode
  const [compareList, setCompareList] = useState<Restaurant[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Feature 3: Smart Search Suggestions
  const [searchSuggestions, setSearchSuggestions] = useState<{type: string, items: Restaurant[]}[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  // Feature 4: Personalized For You
  const [userCuisines, setUserCuisines] = useState<string[]>([])
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<Restaurant[]>([])

  // Feature 6: Cuisine Trend Tags
  const [cuisineTagFilter, setCuisineTagFilter] = useState('all')
  const [cuisineTags] = useState([
    { name: 'Italian', emoji: '🍕' },
    { name: 'Ramen', emoji: '🍜' },
    { name: 'Indian', emoji: '🥘' },
    { name: 'Japanese', emoji: '🍣' },
    { name: 'Mediterranean', emoji: '🥗' },
    { name: 'American', emoji: '🍔' },
    { name: 'Chinese', emoji: '🥡' },
    { name: 'French', emoji: '🥐' },
    { name: 'Thai', emoji: '🍲' },
    { name: 'Seafood', emoji: '🦐' },
    { name: 'BBQ', emoji: '🍖' },
    { name: 'Korean', emoji: '🥘' },
    { name: 'Mexican', emoji: '🌮' },
    { name: 'Vietnamese', emoji: '🍜' },
    { name: 'British', emoji: '🍟' },
    { name: 'Steakhouse', emoji: '🥩' },
  ])

  // Feature 7: Hidden Gem Badge
  const [showHiddenGemsOnly, setShowHiddenGemsOnly] = useState(false)

  // Feature 8: City Spotlight
  const citySpotlights = useMemo(() => {
    return ALL_CITIES.slice(0, 8).map(city => {
      const restaurants = RESTAURANTS_BY_CITY[city.id] || []
      const cuisineCount: Record<string, number> = {}
      restaurants.forEach(r => {
        const mainCuisine = r.cuisineType
        cuisineCount[mainCuisine] = (cuisineCount[mainCuisine] || 0) + 1
      })
      const topCuisine = Object.entries(cuisineCount).sort((a, b) => b[1] - a[1])[0]
      return { city, count: restaurants.length, topCuisine: topCuisine?.[0] || 'Multi' }
    })
  }, [])

  // Helper functions
  const isHiddenGem = (r: Restaurant) => r.rating >= 4.3 && !r.michelin && (r.budget === 'cheap' || r.budget === 'mid')

  const getBudgetLevel = (budget: string): number => {
    switch (budget) {
      case 'cheap': return 1
      case 'mid': return 2
      case 'upscale': return 3
      case 'luxury': return 4
      default: return 1
    }
  }

  const getBudgetColor = (budget: string): string => {
    switch (budget) {
      case 'cheap': return '#4caf50'
      case 'mid': return '#ffc107'
      case 'upscale': return '#ff9800'
      case 'luxury': return '#ff5722'
      default: return '#4caf50'
    }
  }

  const getBudgetRange = (budget: string): string => {
    switch (budget) {
      case 'cheap': return '₹200–500 per person'
      case 'mid': return '₹500–1000 per person'
      case 'upscale': return '₹1000–2500 per person'
      case 'luxury': return '₹2500+ per person'
      default: return '₹500–1500 per person'
    }
  }

  const getCurrentTime = (): { day: number, hour: number } => {
    const now = new Date()
    return { day: now.getDay(), hour: now.getHours() }
  }

  const isOpenNow = (openingHours?: string): boolean => {
    if (!openingHours) return true
    const { day, hour } = getCurrentTime()
    return hour >= 11 && hour < 22
  }

  const toggleCompare = (restaurant: Restaurant) => {
    if (compareList.find(r => r.id === restaurant.id)) {
      setCompareList(compareList.filter(r => r.id !== restaurant.id))
    } else if (compareList.length < 3) {
      setCompareList([...compareList, restaurant])
    }
  }

  const isInCompareList = (id: string): boolean => !!compareList.find(r => r.id === id)

  // Load user cuisines from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentCuisines')
      if (saved) setUserCuisines(JSON.parse(saved))
    } catch (e) { console.log('localStorage not available') }
  }, [])

  // Save cuisine when restaurant is clicked
  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    try {
      const mainCuisine = restaurant.cuisineType
      let saved = userCuisines
      if (!saved.includes(mainCuisine)) {
        saved = [mainCuisine, ...saved].slice(0, 5)
        setUserCuisines(saved)
        localStorage.setItem('recentCuisines', JSON.stringify(saved))
      }
    } catch (e) { console.log('localStorage not available') }
  }

  // Calculate recommendations
  useEffect(() => {
    const getRestaurants = () => {
      const restaurants: Restaurant[] = []
      ALL_CITIES.forEach(city => {
        if (RESTAURANTS_BY_CITY[city.id]) {
          restaurants.push(...RESTAURANTS_BY_CITY[city.id])
        }
      })
      return restaurants
    }
    const all = getRestaurants()
    if (userCuisines.length > 0) {
      const scored = all.map(r => {
        let score = r.rating * 10
        if (userCuisines.includes(r.cuisineType)) score += 20
        if (r.michelin) score += 5
        return { restaurant: r, score }
      }).sort((a, b) => b.score - a.score)
      setRecommendedRestaurants(scored.slice(0, 6).map(s => s.restaurant))
    } else {
      const topRated = all.filter(r => r.michelin).sort((a, b) => b.rating - a.rating).slice(0, 6)
      setRecommendedRestaurants(topRated)
    }
  }, [viewMode, userCuisines])

  // Search suggestions
  const getAllRestaurantsData = () => {
    const restaurants: Restaurant[] = []
    ALL_CITIES.forEach(city => {
      if (RESTAURANTS_BY_CITY[city.id]) {
        restaurants.push(...RESTAURANTS_BY_CITY[city.id])
      }
    })
    return restaurants
  }

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase()
      const all = getAllRestaurantsData()
      const matched: {type: string, items: Restaurant[]}[] = []
      
      const nameMatch = all.filter(r => r.name.toLowerCase().includes(q))
      if (nameMatch.length > 0) matched.push({ type: 'Restaurant', items: nameMatch.slice(0, 5) })
      
      const cuisineMatch = all.filter(r => r.cuisine.toLowerCase().includes(q))
      if (cuisineMatch.length > 0) matched.push({ type: 'Cuisine', items: cuisineMatch.slice(0, 5) })
      
      const cityMatch = all.filter(r => r.location.toLowerCase().includes(q))
      if (cityMatch.length > 0) matched.push({ type: 'City', items: cityMatch.slice(0, 5) })
      
      setSearchSuggestions(matched)
      setShowSuggestions(matched.length > 0)
      setSelectedSuggestionIndex(-1)
    } else {
      setShowSuggestions(false)
      setSearchSuggestions([])
    }
  }, [searchQuery, viewMode])

  // Keyboard navigation for suggestions
  const handleSuggestionKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = searchSuggestions.flatMap(s => s.items)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => Math.min(prev + 1, allSuggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault()
      handleRestaurantClick(allSuggestions[selectedSuggestionIndex])
      setShowSuggestions(false)
      setSearchQuery('')
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // ESC key to close modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedRestaurant(null)
        setShowCompareModal(false)
        setShowSuggestions(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const allRestaurants = useMemo(() => {
    const filteredCities = viewMode === 'india' 
      ? ALL_CITIES.filter(c => c.emoji === '🇮🇳')
      : viewMode === 'international' 
      ? ALL_CITIES.filter(c => c.emoji !== '🇮🇳')
      : ALL_CITIES
    
    const restaurants: Restaurant[] = []
    filteredCities.forEach(city => {
      if (RESTAURANTS_BY_CITY[city.id]) {
        restaurants.push(...RESTAURANTS_BY_CITY[city.id])
      }
    })
    return restaurants
  }, [viewMode])

  const cityRestaurants = useMemo(() => {
    if (!selectedCity || !RESTAURANTS_BY_CITY[selectedCity]) return []
    return RESTAURANTS_BY_CITY[selectedCity]
  }, [selectedCity])

  const filteredRestaurants = useMemo(() => {
    let result = selectedCity ? cityRestaurants : allRestaurants
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.mustTry?.toLowerCase().includes(q)
      )
    }
    
    if (dietFilter !== 'all') {
      result = result.filter(r => r.diet.includes(dietFilter))
    }
    
    if (budgetFilter !== 'all') {
      result = result.filter(r => r.budget === budgetFilter)
    }
    
    if (cuisineFilter !== 'all') {
      result = result.filter(r => r.cuisineType === cuisineFilter)
    }

    if (cuisineTagFilter !== 'all') {
      result = result.filter(r => r.cuisineType.toLowerCase() === cuisineTagFilter.toLowerCase())
    }

    if (showHiddenGemsOnly) {
      result = result.filter(r => isHiddenGem(r))
    }
    
    if (sortMode === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    } else if (sortMode === 'michelin') {
      result = [...result].sort((a, b) => (b.michelin ? 1 : 0) - (a.michelin ? 1 : 0))
    }
    
    return result
  }, [selectedCity, cityRestaurants, allRestaurants, searchQuery, dietFilter, budgetFilter, cuisineFilter, cuisineTagFilter, showHiddenGemsOnly, sortMode])

  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()
  const selectedCityData = ALL_CITIES.find(c => c.id === selectedCity)
  const indianCities = ALL_CITIES.filter(c => c.emoji === '🇮🇳')
  const intlCities = ALL_CITIES.filter(c => c.emoji !== '🇮🇳')
  const displayCities = viewMode === 'india' ? indianCities : viewMode === 'international' ? intlCities : ALL_CITIES

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
              <div style={{ fontSize: 14, fontWeight: 600 }}>🍽️ Restaurants & Food</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>Discover authentic local food</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 10 }}>
              <span style={{ fontSize: 12 }}>🍽️</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>500+ Restaurants</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { icon: '🇮🇳', label: 'Indian Cities', value: indianCities.length.toString(), color: G },
              { icon: '🌍', label: 'International', value: intlCities.length.toString(), color: C },
              { icon: '🍽️', label: 'Restaurants', value: '500+', color: '#51cf66' },
              { icon: '⭐', label: 'Michelin Stars', value: '60+', color: G },
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

          {/* SEARCH & FILTERS */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="🔍 Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSuggestionKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', marginBottom: 12 }}
              />
              {/* Smart Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a1628', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, marginTop: 4, maxHeight: 300, overflowY: 'auto', zIndex: 100 }}>
                  {searchSuggestions.map((group, gIdx) => (
                    <div key={gIdx}>
                      <div style={{ fontSize: 10, color: C, padding: '8px 12px 4px', fontWeight: 600, letterSpacing: 1 }}>{group.type.toUpperCase()}</div>
                      {group.items.map((item, iIdx) => {
                        const globalIdx = searchSuggestions.slice(0, gIdx).reduce((acc, g) => acc + g.items.length, 0) + iIdx
                        const isSelected = globalIdx === selectedSuggestionIndex
                        return (
                          <div key={item.id} onClick={() => { handleRestaurantClick(item); setShowSuggestions(false); setSearchQuery('') }}
                            style={{ padding: '10px 12px', cursor: 'pointer', background: isSelected ? 'rgba(99,210,255,0.15)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 20 }}>{item.emoji}</span>
                            <div>
                              <div style={{ fontSize: 13, color: '#fff' }} dangerouslySetInnerHTML={{ __html: item.name.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark style="background:#63d2ff40;color:#fff;padding:0 2px;border-radius:2px">$1</mark>') }} />
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.cuisine} · {item.location}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                  {searchSuggestions.length === 0 && searchQuery.length >= 2 && (
                    <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>No results found</div>
                  )}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <select value={dietFilter} onChange={(e) => setDietFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 8, padding: '8px 12px', color: G, fontSize: 12, outline: 'none', cursor: 'pointer' }}>
                {DIETARY_OPTIONS.map(d => <option key={d.id} value={d.id} style={{ background: '#05090f' }}>{d.emoji} {d.name}</option>)}
              </select>
              <select value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 8, padding: '8px 12px', color: C, fontSize: 12, outline: 'none', cursor: 'pointer' }}>
                {BUDGET_LEVELS.map(b => <option key={b.id} value={b.id} style={{ background: '#05090f' }}>{b.emoji} {b.name}</option>)}
              </select>
              <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12, outline: 'none', cursor: 'pointer' }}>
                <option value="rating" style={{ background: '#05090f' }}>⭐ Top Rated</option>
                <option value="michelin" style={{ background: '#05090f' }}>🏆 Michelin</option>
              </select>
              {/* Hidden Gems Toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 12px', background: showHiddenGemsOnly ? 'rgba(99,215,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showHiddenGemsOnly ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 8 }}>
                <input type="checkbox" checked={showHiddenGemsOnly} onChange={(e) => setShowHiddenGemsOnly(e.target.checked)} style={{ display: 'none' }} />
                <span style={{ fontSize: 12 }}>💎</span>
                <span style={{ fontSize: 11, color: showHiddenGemsOnly ? C : 'rgba(255,255,255,0.6)' }}>Hidden Gems</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setSelectedCity(''); setViewMode('all') }} style={{ flex: 1, background: viewMode === 'all' && !selectedCity ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${viewMode === 'all' && !selectedCity ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 16px', color: viewMode === 'all' && !selectedCity ? C : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                🌍 All Cities
              </button>
              <button onClick={() => { setSelectedCity(''); setViewMode('india') }} style={{ flex: 1, background: viewMode === 'india' ? 'rgba(255,183,77,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${viewMode === 'india' ? G : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 16px', color: viewMode === 'india' ? G : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                🇮🇳 India ({indianCities.length})
              </button>
              <button onClick={() => { setSelectedCity(''); setViewMode('international') }} style={{ flex: 1, background: viewMode === 'international' ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${viewMode === 'international' ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '10px 16px', color: viewMode === 'international' ? C : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                ✈️ International ({intlCities.length})
              </button>
            </div>
          </div>

          {/* Feature 6: Cuisine Trend Tags */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10, fontWeight: 500 }}>Popular Cuisines</h3>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
              {cuisineTags.map(tag => (
                <button key={tag.name} onClick={() => setCuisineTagFilter(cuisineTagFilter === tag.name ? 'all' : tag.name)}
                  style={{ whiteSpace: 'nowrap', padding: '8px 14px', background: cuisineTagFilter === tag.name ? C : 'rgba(255,255,255,0.05)', border: `1px solid ${cuisineTagFilter === tag.name ? C : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, fontSize: 12, color: cuisineTagFilter === tag.name ? '#000814' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {tag.emoji} {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Feature 8: City Spotlight Cards */}
          {selectedCity === '' && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                🌟 City Spotlights
              </h2>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
                {citySpotlights.map((spot, idx) => {
                  const gradients = [
                    'linear-gradient(135deg, #667eea20, #764ba220)',
                    'linear-gradient(135deg, #f093fb20, #f5576c20)',
                    'linear-gradient(135deg, #4facfe20, #00f2fe20)',
                    'linear-gradient(135deg, #43e97b20, #38f9d720)',
                    'linear-gradient(135deg, #fa709a20, #fee14020)',
                    'linear-gradient(135deg, #a8edea20, #fed6e320)',
                    'linear-gradient(135deg, #ff9a9e20, #fecfef20)',
                    'linear-gradient(135deg, #ffecd220, #fcb69f20)',
                  ]
                  const grad = gradients[idx % gradients.length]
                  return (
                    <button key={spot.city.id} onClick={() => setSelectedCity(spot.city.id)}
                      style={{ minWidth: 160, background: grad, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s', flexShrink: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{spot.city.emoji}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{spot.city.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{spot.count} restaurants</div>
                      <div style={{ fontSize: 10, color: C, fontWeight: 600, textTransform: 'capitalize' }}>{spot.topCuisine}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* CITIES GRID */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              {selectedCity ? `${selectedCityData?.emoji || '📍'} ${selectedCityData?.name || selectedCity}` : `🌆 Select a City`}
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>({displayCities.length} cities)</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {displayCities.map((city, idx) => {
                const colorIndex = idx % COLORS.length
                const color = COLORS[colorIndex]
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    style={{
                      background: selectedCity === city.id 
                        ? `linear-gradient(135deg, ${color}25, ${color}10)` 
                        : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${selectedCity === city.id ? color : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 12,
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      animation: `fadeIn 0.3s ease ${idx * 0.015}s both`,
                    }}
                    onMouseEnter={e => { if (selectedCity !== city.id) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${color}15` } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{city.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: selectedCity === city.id ? color : '#fff', marginBottom: 2 }}>{city.name}</div>
                    <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{city.sub}</div>
                    <div style={{ fontSize: 9.5, color: color, fontWeight: 600 }}>
                      {RESTAURANTS_BY_CITY[city.id]?.length || 0} places
                    </div>
                  </button>
                )
              })}
            </div>
            {selectedCity && (
              <button onClick={() => setSelectedCity('')} style={{ marginTop: 14, background: 'rgba(99,210,255,0.08)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '8px 16px', color: C, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,210,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,210,255,0.08)'}
              >← Back to All Cities</button>
            )}
          </div>

          {/* Feature 4: Personalized For You Section */}
          {selectedCity === '' && recommendedRestaurants.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✨ Recommended For You
                {userCuisines.length > 0 && (
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(Based on your interests)</span>
                )}
              </h2>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
                {recommendedRestaurants.map((restaurant, idx) => (
                  <div key={restaurant.id} onClick={() => handleRestaurantClick(restaurant)}
                    style={{ minWidth: 240, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, cursor: 'pointer', transition: 'all 0.25s', flexShrink: 0, display: 'flex', gap: 10, alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ fontSize: 32, flexShrink: 0 }}>{restaurant.emoji}</div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{restaurant.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{restaurant.cuisine}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: G, fontWeight: 600 }}>⭐ {restaurant.rating}</span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{restaurant.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESULTS HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 12, padding: '12px 16px' }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                {selectedCity ? `${selectedCityData?.emoji || '📍'} ${filteredRestaurants.length} Restaurants in ${selectedCityData?.name}` : `🍽️ ${filteredRestaurants.length} Restaurants Found`}
              </h2>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
                {searchQuery ? `Searching: "${searchQuery}"` : 'Sorted by rating'}
              </p>
            </div>
          </div>

          {/* RESTAURANT CARDS */}
          {filteredRestaurants.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginBottom: 24 }}>
              {filteredRestaurants.map((restaurant, idx) => {
                const colorIndex = idx % COLORS.length
                const restaurantColor = COLORS[colorIndex]
                return (
                  <div key={restaurant.id} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${restaurant.michelin ? G : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: 16, transition: 'all 0.25s', animation: `fadeIn 0.3s ease ${idx * 0.03}s both`, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => handleRestaurantClick(restaurant)}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = restaurant.michelin ? G : C; e.currentTarget.style.boxShadow = `0 12px 28px ${restaurant.michelin ? G : C}15` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = restaurant.michelin ? G : 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    {/* Feature 7: Hidden Gem Badge */}
                    {isHiddenGem(restaurant) && (
                      <div style={{ position: 'absolute', top: 0, left: 0, background: 'linear-gradient(135deg, #67c23a, #409eff)', padding: '3px 8px', borderRadius: '14px 0 12px 0', fontSize: 8, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 3 }}>
                        💎 Hidden Gem
                      </div>
                    )}

                    {/* Feature 1: Michelin Badge */}
                    {restaurant.michelin && (
                      <div style={{ position: 'absolute', top: 0, right: 0, background: `linear-gradient(135deg, ${G}, #ff9800)`, padding: '3px 10px', borderRadius: '0 14px 0 12px', fontSize: 8, fontWeight: 800, color: '#000814' }}>
                        {restaurant.stars} MICHELIN
                      </div>
                    )}

                    {/* Feature 2: Compare Button */}
                    <button onClick={(e) => { e.stopPropagation(); toggleCompare(restaurant) }} style={{ position: 'absolute', top: 8, right: isHiddenGem(restaurant) ? 100 : restaurant.michelin ? 80 : 8, background: isInCompareList(restaurant.id) ? 'rgba(255,107,107,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isInCompareList(restaurant.id) ? R : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: '4px 8px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', zIndex: 10 }}>
                      {isInCompareList(restaurant.id) ? '❤️' : '🤍'}
                    </button>
                    
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10, marginTop: isHiddenGem(restaurant) ? 10 : 0 }}>
                      <div style={{ fontSize: 36 }}>{restaurant.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: '#fff' }}>{restaurant.name}</h3>
                        <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{restaurant.location}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={{ background: `${C}15`, padding: '2px 8px', borderRadius: 12, fontSize: 10, color: C, fontWeight: 600 }}>{restaurant.cuisine}</span>
                      
                      {/* Feature 5: Visual Budget Meter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: `${getBudgetColor(restaurant.budget)}15`, padding: '2px 8px', borderRadius: 12 }} title={getBudgetRange(restaurant.budget)}>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span key={i} style={{ fontSize: 8, color: i < getBudgetLevel(restaurant.budget) ? getBudgetColor(restaurant.budget) : 'rgba(255,255,255,0.2)' }}>●</span>
                        ))}
                      </div>
                      
                      <span style={{ background: `${R}15`, padding: '2px 8px', borderRadius: 12, fontSize: 10, color: R, fontWeight: 600 }}>⭐ {restaurant.rating}</span>
                    </div>
                    
                    <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', margin: '0 0 10px', lineHeight: 1.5 }}>{restaurant.desc}</p>
                    
                    {restaurant.mustTry && (
                      <div style={{ background: `${G}10`, padding: '8px 10px', borderRadius: 8, marginBottom: 10, border: `1px solid ${G}20` }}>
                        <span style={{ fontSize: 9.5, color: G, fontWeight: 700 }}>🍽️ MUST TRY: </span>
                        <span style={{ fontSize: 11, color: '#fff' }}>{restaurant.mustTry}</span>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={(e) => { e.stopPropagation(); window.open(restaurant.book, '_blank') }} style={{ flex: 1, background: `linear-gradient(135deg, ${C}, #3bb8e8)`, color: '#000814', padding: '8px 12px', borderRadius: 8, textAlign: 'center', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 4px 14px ${C}40` }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                      >📋 Book Table</button>
                      <button onClick={(e) => { e.stopPropagation(); window.open(restaurant.gmapUrl, '_blank') }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', padding: '8px 12px', borderRadius: 8, fontSize: 11, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      >📍 Map</button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(99,210,255,0.08)', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>No restaurants found</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Try adjusting your filters or search query</p>
            </div>
          )}

          {/* FOOD TIPS */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>💡 Food Travel Tips</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {FOOD_TIPS.slice(0, 6).map((tip, i) => (
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

          {/* MICHELIN RESTAURANTS */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>⭐ Michelin Star Restaurants</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {getMichelinRestaurants().slice(0, 20).map((r, i) => (
                <div key={r.id} style={{ background: 'rgba(255,255,255,0.025)', padding: '6px 14px', borderRadius: 20, border: `1px solid ${G}30`, fontSize: 11, color: G, fontWeight: 600, transition: 'all 0.2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = G; e.currentTarget.style.color = '#000814' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.color = G }}
                >
                  {r.stars} {r.name}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Feature 1: Restaurant Detail Modal */}
      {selectedRestaurant && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,5,14,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelectedRestaurant(null)}>
          <div style={{ background: '#0a1628', border: `1px solid ${C}30`, borderRadius: 20, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedRestaurant(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#fff', zIndex: 10 }}>✕</button>
            
            {/* Hero Image / Gradient */}
            <div style={{ height: 180, background: selectedRestaurant.image ? `url(${selectedRestaurant.image}) center/cover` : `linear-gradient(135deg, ${C}30, ${G}30)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 72 }}>{selectedRestaurant.emoji}</span>
            </div>
            
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>{selectedRestaurant.name}</h2>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>{selectedRestaurant.location}</p>
                </div>
                {selectedRestaurant.michelin && (
                  <div style={{ background: `linear-gradient(135deg, ${G}, #ff9800)`, padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 800, color: '#000814' }}>
                    {selectedRestaurant.stars} Michelin
                  </div>
                )}
              </div>
              
              {/* Cuisine Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ background: `${C}20`, padding: '4px 12px', borderRadius: 20, fontSize: 11, color: C, fontWeight: 600 }}>{selectedRestaurant.cuisine}</span>
                <span style={{ background: `${G}20`, padding: '4px 12px', borderRadius: 20, fontSize: 11, color: G, fontWeight: 600 }}>{selectedRestaurant.price}</span>
                <span style={{ background: `${R}20`, padding: '4px 12px', borderRadius: 20, fontSize: 11, color: R, fontWeight: 600 }}>⭐ {selectedRestaurant.rating}</span>
                {isHiddenGem(selectedRestaurant) && (
                  <span style={{ background: 'linear-gradient(135deg, #67c23a, #409eff)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#fff' }}>💎 Hidden Gem</span>
                )}
              </div>
              
              {/* Rating Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ fontSize: 18, color: i < Math.floor(selectedRestaurant.rating) ? G : 'rgba(255,255,255,0.2)' }}>★</span>
                ))}
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>({selectedRestaurant.rating}/5)</span>
              </div>
              
              {/* Budget Indicator */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Budget</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span key={i} style={{ fontSize: 14, color: i < getBudgetLevel(selectedRestaurant.budget) ? getBudgetColor(selectedRestaurant.budget) : 'rgba(255,255,255,0.2)' }}>●</span>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: getBudgetColor(selectedRestaurant.budget), fontWeight: 600 }}>{getBudgetRange(selectedRestaurant.budget)}</span>
                </div>
              </div>
              
              {/* About Section */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>About</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{selectedRestaurant.desc}</p>
              </div>
              
              {/* Opening Hours */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Opening Hours</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, fontSize: 11 }}>
                  {['Mon-Fri: 11AM-10PM', 'Sat-Sun: 10AM-11PM'].map(h => (
                    <div key={h} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: 8, color: 'rgba(255,255,255,0.7)' }}>{h}</div>
                  ))}
                </div>
                <div style={{ marginTop: 8, padding: '4px 10px', background: isOpenNow() ? 'rgba(76,175,80,0.2)' : 'rgba(255,107,107,0.2)', borderRadius: 8, display: 'inline-block', fontSize: 11, fontWeight: 600, color: isOpenNow() ? '#4caf50' : '#ff6b6b' }}>
                  {isOpenNow() ? '🟢 Open Now' : '🔴 Closed'}
                </div>
              </div>
              
              {/* Amenities */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Amenities</h3>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['WiFi', 'Parking', 'Outdoor Seating', 'AC', 'Bar', 'Takeaway'].map(amenity => (
                    <span key={amenity} style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{amenity}</span>
                  ))}
                </div>
              </div>
              
              {/* Photo Gallery Strip */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Photos</h3>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ minWidth: 100, height: 70, background: `linear-gradient(135deg, ${COLORS[(i*3)%COLORS.length]}30, ${COLORS[(i*5)%COLORS.length]}30)`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 24 }}>{selectedRestaurant.emoji}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Location</h3>
                <a href={selectedRestaurant.gmapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: 24 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>View on Google Maps</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{selectedRestaurant.location}</div>
                  </div>
                </a>
              </div>
              
              {/* CTA Button */}
              <button onClick={() => alert('Redirecting to booking platform...')} style={{ width: '100%', background: `linear-gradient(135deg, ${C}, #3bb8e8)`, border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#000814', cursor: 'pointer', transition: 'all 0.2s' }}>
                📋 Book a Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Compare Modal */}
      {showCompareModal && compareList.length >= 2 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,5,14,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowCompareModal(false)}>
          <div style={{ background: '#0a1628', border: `1px solid ${G}30`, borderRadius: 20, maxWidth: 800, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCompareModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: '#fff', zIndex: 10 }}>✕</button>
            
            <div style={{ padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20, textAlign: 'center' }}>🍽️ Compare Restaurants</h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 12, textAlign: 'left', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Feature</th>
                      {compareList.map(r => (
                        <th key={r.id} style={{ padding: 12, textAlign: 'center', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', minWidth: 150 }}>
                          <div style={{ fontSize: 32 }}>{r.emoji}</div>
                          <div style={{ fontWeight: 700, marginTop: 4 }}>{r.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Cuisine</td>
                      {compareList.map(r => (
                        <td key={r.id} style={{ padding: 12, textAlign: 'center', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{r.cuisine}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Budget</td>
                      {compareList.map(r => (
                        <td key={r.id} style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: getBudgetColor(r.budget), fontWeight: 600 }}>{r.price}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Rating</td>
                      {compareList.map(r => (
                        <td key={r.id} style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: G, fontWeight: 700 }}>★ {r.rating}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Michelin</td>
                      {compareList.map(r => (
                        <td key={r.id} style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {r.michelin ? <span style={{ color: G }}>✓</span> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>✗</span>}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Dietary</td>
                      {compareList.map(r => (
                        <td key={r.id} style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: 11 }}>{r.diet.join(', ')}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: 12, color: 'rgba(255,255,255,0.5)' }}>City</td>
                      {compareList.map(r => (
                        <td key={r.id} style={{ padding: 12, textAlign: 'center', color: '#fff' }}>{r.location}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Floating Compare Bar */}
      {compareList.length >= 2 && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#0a1628', border: `1px solid ${G}30`, borderRadius: 16, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 50, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {compareList.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20 }}>
                <span>{r.emoji}</span>
                <span style={{ fontSize: 11, color: '#fff' }}>{r.name}</span>
                <button onClick={() => toggleCompare(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>✕</button>
              </div>
            ))}
          </div>
          <button onClick={() => setShowCompareModal(true)} style={{ background: `linear-gradient(135deg, ${G}, #ff9800)`, border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 700, color: '#000814', cursor: 'pointer' }}>
            Compare Now ({compareList.length})
          </button>
          <button onClick={() => setCompareList([])} style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, padding: '10px 16px', fontSize: 11, color: R, cursor: 'pointer' }}>
            Clear All
          </button>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
