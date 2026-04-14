'use client'

import { useState, useEffect, useMemo } from 'react'
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

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

const guidePlatforms = [
  { name: 'GetYourGuide', logo: '🎫', color: '#FF5400', url: 'https://www.getyourguide.com', desc: 'Book tours & activities worldwide' },
  { name: 'Airbnb Experiences', logo: '🏠', color: '#FF5A5F', url: 'https://www.airbnb.com/experiences', desc: 'Hosted local experiences' },
  { name: 'Viator', logo: '✈️', color: '#0077CC', url: 'https://www.viator.com', desc: 'Largest tours marketplace' },
  { name: 'Withlocals', logo: '🌍', color: '#00B686', url: 'https://www.withlocals.com', desc: 'Private tours with locals' },
  { name: 'Klook', logo: '🎟️', color: '#FF4D00', url: 'https://www.klook.com', desc: 'Popular in Asia-Pacific' },
  { name: 'Spotted by Locals', logo: '📍', color: '#4CAF50', url: 'https://www.spottedbylocals.com', desc: 'Honest local travel tips' },
  { name: 'CouchSurfing', logo: '🤝', color: '#FF6B35', url: 'https://www.couchsurfing.com', desc: 'Stay with locals for free' },
  { name: 'Showaround', logo: '👥', color: '#9C27B0', url: 'https://www.showaround.com', desc: 'Find local guides everywhere' },
  { name: 'ToursByLocals', logo: '🚶', color: '#3F51B5', url: 'https://www.toursbylocals.com', desc: 'Private guided tours' },
  { name: 'Context Travel', logo: '📚', color: '#795548', url: 'https://www.contexttravel.com', desc: 'Expert-led cultural tours' },
]

const CITIES_GUIDES = [
  { id: 'jaipur', name: 'Jaipur', emoji: '🇮🇳', country: 'India', guides: 45, avgPrice: '₹1,500', rating: 4.8, bestTime: 'Oct-Mar', tips: 'Book heritage walks early. Morning tours avoid heat.', weather: 'Oct–Mar 🌤️' },
  { id: 'lisbon', name: 'Lisbon', emoji: '🇵🇹', country: 'Portugal', guides: 38, avgPrice: '€60', rating: 4.7, bestTime: 'Mar-Oct', tips: 'Fado shows book fast. Evening tours magical.', weather: 'Mar–Oct ☀️' },
  { id: 'kyoto', name: 'Kyoto', emoji: '🇯🇵', country: 'Japan', guides: 52, avgPrice: '¥8,000', rating: 4.9, bestTime: 'Mar-May, Oct-Nov', tips: 'Temple tours at dawn. Cherry blossom peak.', weather: 'Mar–May, Oct–Nov 🌸' },
  { id: 'marrakech', name: 'Marrakech', emoji: '🇲🇦', country: 'Morocco', guides: 41, avgPrice: 'MAD 500', rating: 4.6, bestTime: 'Mar-May, Sep-Nov', tips: 'Medina tours at sunrise. Bargaining expected.', weather: 'Mar–May, Sep–nov ☀️' },
  { id: 'rome', name: 'Rome', emoji: '🇮🇹', country: 'Italy', guides: 67, avgPrice: '€80', rating: 4.7, bestTime: 'Apr-Jun, Sep-Oct', tips: 'Underground tours popular. Book Colosseum ahead.', weather: 'Apr–Jun, Sep–Oct 🌸' },
  { id: 'paris', name: 'Paris', emoji: '🇫🇷', country: 'France', guides: 72, avgPrice: '€75', rating: 4.6, bestTime: 'Apr-Oct', tips: 'Food tours highly rated. Montmartre at sunset.', weather: 'Apr–Oct ☀️' },
  { id: 'barcelona', name: 'Barcelona', emoji: '🇪🇸', country: 'Spain', guides: 55, avgPrice: '€65', rating: 4.7, bestTime: 'May-Jun, Sep-Oct', tips: 'Gothic quarter tours. Tapas crawl popular.', weather: 'May–Jun, Sep–Oct ☀️' },
  { id: 'london', name: 'London', emoji: '🇬🇧', country: 'UK', guides: 89, avgPrice: '£55', rating: 4.5, bestTime: 'May-Sep', tips: 'Jack the Ripper tours. Royal history popular.', weather: 'May–Sep ☀️' },
  { id: 'new-york', name: 'New York', emoji: '🇺🇸', country: 'USA', guides: 124, avgPrice: '$75', rating: 4.6, bestTime: 'Apr-Oct', tips: 'Food tours amazing. Brooklyn walking tours.', weather: 'Apr–Oct 🌤️' },
  { id: 'tokyo', name: 'Tokyo', emoji: '🇯🇵', country: 'Japan', guides: 83, avgPrice: '¥9,000', rating: 4.8, bestTime: 'Mar-May, Sep-Nov', tips: 'Ramen tours. Night photography tours.', weather: 'Mar–May, Sep–Nov 🌸' },
  { id: 'dubai', name: 'Dubai', emoji: '🇦🇪', country: 'UAE', guides: 42, avgPrice: 'AED 300', rating: 4.5, bestTime: 'Nov-Mar', tips: 'Desert safaris popular. Evening dhow cruises.', weather: 'Nov–Mar 🌤️' },
  { id: 'bali', name: 'Bali', emoji: '🇮🇩', country: 'Indonesia', guides: 58, avgPrice: 'IDR 400K', rating: 4.7, bestTime: 'Apr-Oct', tips: 'Temple ceremonies. Ubud art tours.', weather: 'Apr–Oct ☀️' },
  { id: 'sydney', name: 'Sydney', emoji: '🇦🇺', country: 'Australia', guides: 46, avgPrice: 'AUD 85', rating: 4.6, bestTime: 'Sep-Mar', tips: 'Harbor walks. Blue Mountains tours.', weather: 'Sep–Mar ☀️' },
  { id: 'singapore', name: 'Singapore', emoji: '🇸🇬', country: 'Singapore', guides: 34, avgPrice: 'SGD 80', rating: 4.7, bestTime: 'Year-round', tips: 'Food tours essential. Night Safari popular.', weather: 'Year-round 🌴' },
  { id: 'amsterdam', name: 'Amsterdam', emoji: '🇳🇱', country: 'Netherlands', guides: 39, avgPrice: '€55', rating: 4.6, bestTime: 'Apr-Oct', tips: 'Canal tours. Red light district tours.', weather: 'Apr–Oct ☀️' },
  { id: 'prague', name: 'Prague', emoji: '🇨🇿', country: 'Czech Republic', guides: 31, avgPrice: 'CZK 1,200', rating: 4.7, bestTime: 'Apr-Jun, Sep-Oct', tips: 'Ghost tours popular. Castle tours essential.', weather: 'Apr–Jun, Sep–Oct 🌸' },
  { id: 'vienna', name: 'Vienna', emoji: '🇦🇹', country: 'Austria', guides: 28, avgPrice: '€70', rating: 4.8, bestTime: 'Apr-Jun, Sep-Oct', tips: 'Music tours. Classical concerts.', weather: 'Apr–Jun, Sep–Oct 🌸' },
  { id: 'budapest', name: 'Budapest', emoji: '🇭🇺', country: 'Hungary', guides: 33, avgPrice: 'HUF 25,000', rating: 4.6, bestTime: 'Apr-Jun, Sep-Nov', tips: 'Ruin bar tours. Thermal bath experiences.', weather: 'Apr–Jun, Sep–Nov 🌸' },
  { id: 'istanbul', name: 'Istanbul', emoji: '🇹🇷', country: 'Turkey', guides: 47, avgPrice: 'TRY 2,000', rating: 4.5, bestTime: 'Apr-May, Sep-Nov', tips: 'Bosphorus cruises. Hagia Sophia tours.', weather: 'Apr–May, Sep–Nov 🌤️' },
  { id: 'cape-town', name: 'Cape Town', emoji: '🇿🇦', country: 'South Africa', guides: 29, avgPrice: 'ZAR 1,500', rating: 4.8, bestTime: 'Nov-Mar', tips: 'Wine tours essential. Table Mountain at sunset.', weather: 'Nov–Mar ☀️' },
]

const TIPS_GUIDES = [
  { icon: '💰', title: 'Book Direct', desc: 'Booking directly with guides saves 15-30% in platform fees.' },
  { icon: '📅', title: 'Book Early', desc: 'Popular guides book out 2-3 weeks in advance.' },
  { icon: '💬', title: 'Message First', desc: 'Chat with guides before booking to customize your experience.' },
  { icon: '⭐', title: 'Read Recent Reviews', desc: 'Focus on detailed reviews with photos for authenticity.' },
  { icon: '🏷️', title: 'Look for Badges', desc: 'Verified, Superhost, and Certified guides are more reliable.' },
  { icon: '📸', title: 'Ask for Custom Photos', desc: 'Request specific photo spots only locals know about.' },
  { icon: '🕐', title: 'Timing Matters', desc: 'Early morning tours avoid crowds and heat.' },
  { icon: '🍽️', title: 'Food Tours', desc: 'Local food experiences often provide the best insights.' },
]

const SCAM_WARNINGS = [
  { icon: '⚠️', title: 'Too Good to Be True', desc: 'Extremely low prices usually mean hidden costs.' },
  { icon: '💳', title: 'Wire Transfers', desc: 'Never pay via Western Union or gift cards.' },
  { icon: '📞', title: 'Off-Platform Contact', desc: 'Scammers ask to communicate outside the platform.' },
  { icon: '🖼️', title: 'Stolen Photos', desc: 'Reverse image search guide photos to verify authenticity.' },
]

const guides = [
  { id: 1, name: 'Arjun Sharma', location: 'Jaipur', country: 'India', flag: '🇮🇳', avatar: 'AS', avatarColor: '#8b5cf6', rating: 4.9, reviews: 287, price: 1500, priceUnit: '/half day', languages: ['Hindi', 'English', 'Rajasthani'], specialties: ['Heritage Walks', 'Art & Culture', 'Hidden Gems'], experience: '12 years', bio: 'Born and raised in the Pink City, I specialize in uncovering Jaipur\'s hidden havelis, secret temples, and untold stories.', shortBio: 'Pink City native | Heritage expert', verified: true, certified: true, superhost: true, responseTime: '~1 hour', availability: 'available', responseRate: 98, tripsCompleted: 450 },
  { id: 2, name: 'Maria Santos', location: 'Lisbon', country: 'Portugal', flag: '🇵🇹', avatar: 'MS', avatarColor: '#ec4899', rating: 4.8, reviews: 156, price: 60, priceUnit: '/hour', languages: ['Portuguese', 'English', 'Spanish'], specialties: ['Food Tours', 'Nightlife', 'Hidden Gems'], experience: '8 years', bio: 'A Lisbon native who left the corporate world to share my city\'s soul beyond the tourist trail.', shortBio: 'Lisbon native | Food expert', verified: true, certified: true, superhost: false, responseTime: '~30 mins', availability: 'available', responseRate: 96, tripsCompleted: 312 },
  { id: 3, name: 'Kenji Tanaka', location: 'Kyoto', country: 'Japan', flag: '🇯🇵', avatar: 'KT', avatarColor: '#14b8a6', rating: 5.0, reviews: 198, price: 8000, priceUnit: '/half day', languages: ['Japanese', 'English'], specialties: ['Heritage Walks', 'Photography', 'Art & Culture'], experience: '15 years', bio: 'Former temple monk turned guide. I offer spiritual walks, tea ceremonies, and temple photography sessions.', shortBio: 'Former monk | NatGeo featured', verified: true, certified: true, superhost: true, responseTime: '~2 hours', availability: 'limited', responseRate: 92, tripsCompleted: 523 },
  { id: 4, name: 'Fatima Al-Hassan', location: 'Marrakech', country: 'Morocco', flag: '🇲🇦', avatar: 'FA', avatarColor: '#f59e0b', rating: 4.9, reviews: 143, price: 550, priceUnit: '/half day', languages: ['Arabic', 'French', 'English'], specialties: ['Food Tours', 'Shopping', 'Art & Culture'], experience: '10 years', bio: 'From a family of spice merchants, I help you haggle like a local and discover artisan traditions.', shortBio: 'Spice merchant family | Medina native', verified: true, certified: true, superhost: true, responseTime: '~1 hour', availability: 'available', responseRate: 97, tripsCompleted: 389 },
  { id: 5, name: 'Marco Benedetti', location: 'Rome', country: 'Italy', flag: '🇮🇹', avatar: 'MB', avatarColor: '#6366f1', rating: 4.7, reviews: 211, price: 80, priceUnit: '/hour', languages: ['Italian', 'English', 'Spanish'], specialties: ['Heritage Walks', 'Food Tours', 'Hidden Gems'], experience: '9 years', bio: 'Third-generation Roman with a passion for food and history. Skip the tourist traps.', shortBio: '3rd generation Roman | Food & history', verified: true, certified: true, superhost: false, responseTime: '~45 mins', availability: 'available', responseRate: 94, tripsCompleted: 476 },
  { id: 6, name: 'Priya Krishnan', location: 'Bangalore', country: 'India', flag: '🇮🇳', avatar: 'PK', avatarColor: '#10b981', rating: 4.8, reviews: 167, price: 1200, priceUnit: '/half day', languages: ['Kannada', 'English', 'Hindi'], specialties: ['Food Tours', 'Nightlife', 'Art & Culture'], experience: '7 years', bio: 'Bangalore\'s original craft beer and street food queen. I showcase the city\'s transformation.', shortBio: 'Craft beer queen | Street food expert', verified: true, certified: false, superhost: false, responseTime: '~1 hour', availability: 'available', responseRate: 95, tripsCompleted: 298 },
  { id: 7, name: 'Yuki Suzuki', location: 'Tokyo', country: 'Japan', flag: '🇯🇵', avatar: 'YS', avatarColor: '#ec4899', rating: 4.9, reviews: 203, price: 9000, priceUnit: '/half day', languages: ['Japanese', 'English'], specialties: ['Food Tours', 'Hidden Gems', 'Photography'], experience: '10 years', bio: 'Shinjuku alleyways are my backyard. From golden gai\'s tiny bars to Tsukiji\'s pre-dawn auctions.', shortBio: 'Shinjuku native | Ramen obsessive', verified: true, certified: true, superhost: true, responseTime: '~1 hour', availability: 'limited', responseRate: 96, tripsCompleted: 487 },
  { id: 8, name: 'Sarah Chen', location: 'Taipei', country: 'Taiwan', flag: '🇹🇼', avatar: 'SC', avatarColor: '#06b6d4', rating: 4.8, reviews: 124, price: 2500, priceUnit: '/half day', languages: ['Mandarin', 'English'], specialties: ['Food Tours', 'Nightlife', 'Hidden Gems'], experience: '6 years', bio: 'Taipei\'s night market expert and bubble tea connoisseur. Let me show you where locals actually eat.', shortBio: 'Night market expert | Bubble tea ranker', verified: true, certified: false, superhost: false, responseTime: '~30 mins', availability: 'available', responseRate: 98, tripsCompleted: 234 },
  { id: 9, name: 'Carlos Mendoza', location: 'Mexico City', country: 'Mexico', flag: '🇲🇽', avatar: 'CM', avatarColor: '#f97316', rating: 4.9, reviews: 189, price: 700, priceUnit: '/half day', languages: ['Spanish', 'English'], specialties: ['Heritage Walks', 'Art & Culture', 'Food Tours'], experience: '11 years', bio: 'Anthropologist and historian who shares Mexico City\'s pre-Hispanic and colonial layers.', shortBio: 'Anthropologist | Frida expert', verified: true, certified: true, superhost: true, responseTime: '~1 hour', availability: 'booked', responseRate: 95, tripsCompleted: 401 },
  { id: 10, name: 'Liam O\'Brien', location: 'Dublin', country: 'Ireland', flag: '🇮🇪', avatar: 'LO', avatarColor: '#22c55e', rating: 4.7, reviews: 178, price: 55, priceUnit: '/hour', languages: ['English'], specialties: ['Heritage Walks', 'Nightlife', 'Art & Culture'], experience: '8 years', bio: 'A poet and musician who gives literary pub crawls and whiskey tasting experiences.', shortBio: 'Poet | Musician | Whiskey connoisseur', verified: true, certified: true, superhost: false, responseTime: '~2 hours', availability: 'available', responseRate: 90, tripsCompleted: 356 },
]

const allSpecialties = ['All', ...new Set(guides.flatMap(g => g.specialties))]
const allLanguages = ['All', ...new Set(guides.flatMap(g => g.languages))]
const allCountries = ['All', ...new Set(guides.map(g => g.country))]

export default function GuidesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/guides')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [minRating, setMinRating] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null)
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [compareList, setCompareList] = useState<typeof guides[0][]>([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportGuide, setReportGuide] = useState<typeof guides[0] | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) })
      return () => unsubscribe()
    } catch { setLoading(false) }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('roamind_favorites')
      if (saved) setFavorites(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGuide(null)
        setShowCompareModal(false)
        setShowReportModal(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      try { localStorage.setItem('roamind_favorites', JSON.stringify(newFavorites)) } catch {}
      return newFavorites
    })
  }

  const handleReport = () => {
    if (!reportReason) return
    setReportSubmitted(true)
    setTimeout(() => {
      setShowReportModal(false)
      setReportReason('')
      setReportSubmitted(false)
    }, 2000)
  }

  const filteredGuides = guides.filter(g => {
    const matchesSearch = !searchTerm || g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.location.toLowerCase().includes(searchTerm.toLowerCase()) || g.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSpecialty = selectedSpecialty === 'All' || g.specialties.includes(selectedSpecialty)
    const matchesLanguage = selectedLanguage === 'All' || g.languages.some(l => l === selectedLanguage)
    const matchesCountry = selectedCountry === 'All' || g.country === selectedCountry
    const matchesPrice = g.price >= priceRange[0] && g.price <= priceRange[1]
    const matchesRating = g.rating >= minRating
    const matchesVerified = !verifiedOnly || g.verified
    return matchesSearch && matchesSpecialty && matchesLanguage && matchesCountry && matchesPrice && matchesRating && matchesVerified
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating
      case 'reviews': return b.reviews - a.reviews
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      default: return 0
    }
  })

  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))
  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  const hasActiveFilters = searchTerm || selectedSpecialty !== 'All' || selectedLanguage !== 'All' || selectedCountry !== 'All' || priceRange[1] < 10000 || minRating > 0 || verifiedOnly

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSpecialty('All')
    setSelectedLanguage('All')
    setSelectedCountry('All')
    setPriceRange([0, 10000])
    setMinRating(0)
    setVerifiedOnly(false)
    setSortBy('rating')
  }

  const addToCompare = (guide: typeof guides[0]) => {
    if (compareList.length < 3 && !compareList.find(g => g.id === guide.id)) {
      setCompareList([...compareList, guide])
    }
  }

  const getCityForGuide = (location: string) => CITIES_GUIDES.find(c => c.name === location)

  if (selectedGuide) {
    const cityInfo = getCityForGuide(selectedGuide.location)
    return (
      <div style={{ minHeight: '100vh', background: BG, padding: 20 }}>
        <button onClick={() => setSelectedGuide(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C, padding: '10px 20px', borderRadius: 10, cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          ← Back to Guides
        </button>
        <div style={{ background: BG2, borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: selectedGuide.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>{selectedGuide.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>{selectedGuide.name}</span>
                {selectedGuide.verified && <span style={{ color: C }}>✓</span>}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>{selectedGuide.flag} {selectedGuide.location}, {selectedGuide.country}</div>
              <div style={{ display: 'flex', gap: 20 }}>
                <div><span style={{ color: '#fbbf24' }}>★</span> <span style={{ fontWeight: 700 }}>{selectedGuide.rating}</span> <span style={{ color: 'rgba(255,255,255,0.5)' }}>({selectedGuide.reviews} reviews)</span></div>
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedGuide.tripsCompleted} trips</div>
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedGuide.experience}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {selectedGuide.verified && <span style={{ background: `${C}15`, border: `1px solid ${C}35`, padding: '6px 14px', borderRadius: 20, fontSize: 12, color: C }}>🪪 Verified</span>}
            {selectedGuide.certified && <span style={{ background: `${PURPLE}15`, border: `1px solid ${PURPLE}35`, padding: '6px 14px', borderRadius: 20, fontSize: 12, color: PURPLE }}>🏆 Certified</span>}
            {selectedGuide.superhost && <span style={{ background: `${G}15`, border: `1px solid ${G}35`, padding: '6px 14px', borderRadius: 20, fontSize: 12, color: G }}>⭐ Superhost</span>}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 24 }}>{selectedGuide.bio}</p>
          {cityInfo && (
            <div style={{ marginBottom: 24, padding: 16, background: BG3, borderRadius: 12 }}>
              <h4 style={{ color: '#fff', marginBottom: 12 }}>📍 {cityInfo.name} Travel Tips</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{cityInfo.tips}</p>
              <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                <span>🌡️ Best time: {cityInfo.bestTime}</span>
                <span>{cityInfo.weather}</span>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            {selectedGuide.languages.map((l, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{l}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => toggleFavorite(selectedGuide.id)} style={{ background: favorites.includes(selectedGuide.id) ? `${R}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${favorites.includes(selectedGuide.id) ? R : 'rgba(255,255,255,0.1)'}`, color: favorites.includes(selectedGuide.id) ? R : '#fff', padding: '12px 20px', borderRadius: 10, cursor: 'pointer', flex: 1 }}>
              {favorites.includes(selectedGuide.id) ? '❤️ Saved' : '🤍 Save'}
            </button>
            <button onClick={() => { setReportGuide(selectedGuide); setShowReportModal(true) }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '12px 20px', borderRadius: 10, cursor: 'pointer', flex: 1 }}>
              🚩 Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, color: '#fff' }}>
      {sidebarOpen && <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />}

      <div style={{ flex: 1, marginLeft: sidebarOpen ? 256 : 0, transition: 'margin-left 0.3s' }}>
        <div style={{ background: `linear-gradient(135deg, ${BG2} 0%, ${BG} 100%)`, padding: '40px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: 10, borderRadius: 10, cursor: 'pointer' }}>☰</button>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>Local Guides</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>{guides.length} verified guides in {new Set(guides.map(g => g.location)).size} cities</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="text" placeholder="Search guides..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', outline: 'none' }} />
            <button onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? `${C}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${showFilters ? C : 'rgba(255,255,255,0.1)'}`, color: C, padding: '12px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>
              ⚙️ Filters {hasActiveFilters && <span style={{ background: C, color: BG, padding: '2px 8px', borderRadius: 10, fontSize: 12 }}>{[searchTerm, selectedSpecialty, selectedLanguage, selectedCountry].filter(x => x && x !== 'All').length}</span>}
            </button>
            <button onClick={() => setShowCompareModal(true)} style={{ background: compareList.length > 0 ? `${PURPLE}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${compareList.length > 0 ? PURPLE : 'rgba(255,255,255,0.1)'}`, color: compareList.length > 0 ? PURPLE : '#fff', padding: '12px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>
              ⚖️ Compare ({compareList.length})
            </button>
          </div>

          {showFilters && (
            <div style={{ marginTop: 20, padding: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <div><label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Specialty</label><select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} style={{ width: '100%', padding: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}>{allSpecialties.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Language</label><select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} style={{ width: '100%', padding: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}>{allLanguages.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
              <div><label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Country</label><select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={{ width: '100%', padding: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}>{allCountries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' }}>Sort By</label><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}><option value="rating">Highest Rated</option><option value="reviews">Most Reviews</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} /><span style={{ color: 'rgba(255,255,255,0.7)' }}>Verified Only</span></div>
              {hasActiveFilters && <button onClick={clearFilters} style={{ gridColumn: '1 / -1', background: `${R}20`, border: `1px solid ${R}`, color: R, padding: 10, borderRadius: 8, cursor: 'pointer' }}>Clear All Filters</button>}
            </div>
          )}
        </div>

        <div style={{ padding: '24px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Showing <span style={{ color: C, fontWeight: 600 }}>{filteredGuides.length}</span> of {guides.length} guides</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 40 }}>
            {filteredGuides.map(guide => (
              <div key={guide.id} style={{ background: BG2, borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: guide.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{guide.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{guide.name}</span>
                      {guide.verified && <span style={{ color: C, fontSize: 14 }}>✓</span>}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{guide.flag} {guide.location}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(guide.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>{favorites.includes(guide.id) ? '❤️' : '🤍'}</button>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>{guide.shortBio}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {guide.specialties.slice(0, 2).map((s, i) => <span key={i} style={{ background: `${C}15`, color: C, padding: '4px 10px', borderRadius: 20, fontSize: 11 }}>{s}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: '#fbbf24' }}>★</span><span style={{ fontWeight: 600 }}>{guide.rating}</span><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>({guide.reviews})</span></div>
                  <div><span style={{ color: C, fontWeight: 700, fontSize: 18 }}>{guide.price}</span><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{guide.priceUnit}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedGuide(guide) }} style={{ flex: 1, background: C, color: BG, padding: 10, borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>View Profile</button>
                  <button onClick={(e) => { e.stopPropagation(); addToCompare(guide) }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' }}>⚖️</button>
                  <button onClick={(e) => { e.stopPropagation(); setReportGuide(guide); setShowReportModal(true) }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' }}>🚩</button>
                </div>
              </div>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: BG2, borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>No guides found</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Try adjusting your filters</p>
              <button onClick={clearFilters} style={{ background: `linear-gradient(135deg, ${C}, #3b9fd4)`, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Clear Filters</button>
            </div>
          )}

          <div style={{ background: BG2, borderRadius: 16, padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#fff' }}>📊 Guide Statistics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: 16, background: BG3, borderRadius: 12 }}><div style={{ fontSize: 28, fontWeight: 800, color: C }}>{guides.length}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Total Guides</div></div>
              <div style={{ textAlign: 'center', padding: 16, background: BG3, borderRadius: 12 }}><div style={{ fontSize: 28, fontWeight: 800, color: GR }}>{new Set(guides.map(g => g.location)).size}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Cities</div></div>
              <div style={{ textAlign: 'center', padding: 16, background: BG3, borderRadius: 12 }}><div style={{ fontSize: 28, fontWeight: 800, color: G }}>{guides.filter(g => g.certified).length}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Certified</div></div>
              <div style={{ textAlign: 'center', padding: 16, background: BG3, borderRadius: 12 }}><div style={{ fontSize: 28, fontWeight: 800, color: PURPLE }}>{guides.filter(g => g.superhost).length}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Superhosts</div></div>
              <div style={{ textAlign: 'center', padding: 16, background: BG3, borderRadius: 12 }}><div style={{ fontSize: 28, fontWeight: 800, color: R }}>{guides.reduce((a, g) => a + g.reviews, 0)}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Total Reviews</div></div>
            </div>
          </div>

          <div style={{ background: BG2, borderRadius: 16, padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#fff' }}>🗺️ Top Cities for Guides</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {CITIES_GUIDES.slice(0, 10).map((city, i) => (
                <div key={i} onClick={() => setSelectedCountry(city.country)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: BG3, borderRadius: 10, cursor: 'pointer', border: selectedCountry === city.country ? `1px solid ${C}` : '1px solid transparent' }}>
                  <span style={{ fontSize: 24 }}>{city.emoji}</span>
                  <div><div style={{ fontWeight: 600, color: '#fff' }}>{city.name}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{city.guides} guides • {city.avgPrice}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: BG2, borderRadius: 16, padding: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#fff' }}>🔗 Book with Trusted Platforms</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>These platforms offer verified local guides and buyer protection</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {guidePlatforms.map((platform, i) => (
                <a key={i} href={platform.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: BG3, borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 24 }}>{platform.logo}</span>
                  <div><div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{platform.name}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{platform.desc}</div></div>
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${C}10, ${PURPLE}10)`, borderRadius: 16, padding: 24, marginBottom: 32, border: '1px solid rgba(99, 210, 255, 0.1)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#fff' }}>💡 Tips for Booking Local Guides</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {TIPS_GUIDES.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 16, background: BG3, borderRadius: 12 }}>
                  <span style={{ fontSize: 24 }}>{tip.icon}</span>
                  <div><div style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>{tip.title}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{tip.desc}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${R}10, ${R}05)`, borderRadius: 16, padding: 24, marginBottom: 32, border: `1px solid ${R}30` }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#fff' }}>🛡️ Stay Safe from Scams</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {SCAM_WARNINGS.map((warning, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 16, background: BG3, borderRadius: 12, border: `1px solid ${R}20` }}>
                  <span style={{ fontSize: 24 }}>{warning.icon}</span>
                  <div><div style={{ fontWeight: 600, color: R, marginBottom: 4 }}>{warning.title}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{warning.desc}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`, borderRadius: 20, padding: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, marginBottom: 40, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ background: `linear-gradient(135deg, ${GR}, #22c55e)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Join Our Community</div>
              <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12, color: '#fff' }}>Become a Roamind Local Guide</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20, lineHeight: 1.7 }}>Share your city with travelers from around the world.</p>
              <ul style={{ color: 'rgba(255,255,255,0.8)', listStyle: 'none', padding: 0 }}>
                {['Set your own prices & schedule', 'Get featured to thousands of travelers', 'Secure payouts directly to your account', 'Join a community of passionate locals'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ color: GR, fontSize: 18 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`, borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700, color: '#fff' }}>Apply Now</h4>
              <form onSubmit={(e) => { e.preventDefault(); alert('Application submitted!') }}>
                <input type="text" placeholder="Your name" required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, marginBottom: 12, fontSize: 14, color: '#fff', outline: 'none' }} />
                <input type="text" placeholder="City you guide in" required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, marginBottom: 12, fontSize: 14, color: '#fff', outline: 'none' }} />
                <input type="email" placeholder="Email address" required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, marginBottom: 12, fontSize: 14, color: '#fff', outline: 'none' }} />
                <textarea placeholder="Tell us about yourself..." rows={3} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, marginBottom: 12, fontSize: 14, color: '#fff', outline: 'none', resize: 'vertical' }} />
                <button type="submit" style={{ width: '100%', background: `linear-gradient(135deg, ${C}, #3b9fd4)`, color: '#000', padding: '14px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15 }}>Submit Application</button>
              </form>
            </div>
          </div>

          <div style={{ padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>📞</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 600 }}>Need Help?</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Contact Roamind support: <span style={{ color: C }}>support@roamind.com</span></div>
            </div>
          </div>
        </div>
      </div>

      {showCompareModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: BG2, borderRadius: 20, padding: 32, maxWidth: 800, width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>⚖️ Compare Guides</h2>
              <button onClick={() => setShowCompareModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            {compareList.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Click ⚖️ on guides to add them for comparison</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareList.length}, 1fr)`, gap: 16 }}>
                {compareList.map(guide => (
                  <div key={guide.id} style={{ textAlign: 'center', padding: 16, background: BG3, borderRadius: 12 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: guide.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 12px' }}>{guide.avatar}</div>
                    <div style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>{guide.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>{guide.flag} {guide.location}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}><span style={{ color: '#fbbf24' }}>★</span><span style={{ fontWeight: 600 }}>{guide.rating}</span></div>
                    <div style={{ color: C, fontWeight: 700 }}>{guide.price}{guide.priceUnit}</div>
                    <button onClick={() => setCompareList(compareList.filter(g => g.id !== guide.id))} style={{ marginTop: 12, background: `${R}20`, border: `1px solid ${R}`, color: R, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showReportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: BG2, borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>🚩 Report Guide</h2>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            {reportGuide && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: BG3, borderRadius: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: reportGuide.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{reportGuide.avatar}</div>
                  <div><div style={{ fontWeight: 600, color: '#fff' }}>{reportGuide.name}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{reportGuide.flag} {reportGuide.location}</div></div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Why are you reporting this guide?</p>
                {['Fake profile', 'Inappropriate behavior', 'Scam suspected', 'Wrong information', 'Other'].map((reason, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: reportReason === reason ? `${C}15` : BG3, borderRadius: 10, marginBottom: 8, cursor: 'pointer' }}>
                    <input type="radio" name="reportReason" checked={reportReason === reason} onChange={() => setReportReason(reason)} />
                    <span style={{ color: '#fff' }}>{reason}</span>
                  </label>
                ))}
                {reportReason === 'Other' && (
                  <textarea placeholder="Please explain..." value={reportReason} onChange={(e) => setReportReason(e.target.value)} style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', marginTop: 12, resize: 'vertical' }} />
                )}
              </div>
            )}
            {reportSubmitted ? (
              <div style={{ textAlign: 'center', padding: 20, background: `${GR}20`, borderRadius: 12 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ color: GR, fontWeight: 600 }}>Report Submitted!</div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>We'll review and take action within 24 hours.</p>
              </div>
            ) : (
              <button onClick={handleReport} disabled={!reportReason} style={{ width: '100%', background: reportReason ? R : 'rgba(255,255,255,0.1)', color: reportReason ? '#fff' : 'rgba(255,255,255,0.3)', padding: 14, borderRadius: 10, fontWeight: 600, border: 'none', cursor: reportReason ? 'pointer' : 'not-allowed' }}>Submit Report</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
