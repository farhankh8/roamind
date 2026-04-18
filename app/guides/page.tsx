'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const BG = '#000814'
const BG2 = '#05090f'
const BG3 = '#0a1628'
const GR = '#51cf66'
const PURPLE = '#a855f7'

const CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', emoji: '🍽️' },
  { id: 'heritage', name: 'Heritage & History', emoji: '🏛️' },
  { id: 'adventure', name: 'Adventure', emoji: '🧗' },
  { id: 'nightlife', name: 'Nightlife', emoji: '🌃' },
  { id: 'culture', name: 'Art & Culture', emoji: '🎨' },
]

const CITIES = [
  { id: 'jaipur', name: 'Jaipur', emoji: '🇮🇳', country: 'India' },
  { id: 'lisbon', name: 'Lisbon', emoji: '🇵🇹', country: 'Portugal' },
  { id: 'kyoto', name: 'Kyoto', emoji: '🇯🇵', country: 'Japan' },
  { id: 'marrakech', name: 'Marrakech', emoji: '🇲🇦', country: 'Morocco' },
  { id: 'rome', name: 'Rome', emoji: '🇮🇹', country: 'Italy' },
  { id: 'paris', name: 'Paris', emoji: '🇫🇷', country: 'France' },
  { id: 'tokyo', name: 'Tokyo', emoji: '🇯🇵', country: 'Japan' },
  { id: 'new-york', name: 'New York', emoji: '🇺🇸', country: 'USA' },
]

const GUIDES = [
  { id: 1, name: 'Arjun Sharma', location: 'Jaipur', country: 'India', flag: '🇮🇳', avatar: 'AS', avatarColor: '#8b5cf6', rating: 4.9, reviews: 287, languages: ['Hindi', 'English'], categories: ['heritage', 'culture'], experience: '12 years', bio: 'Born and raised in the Pink City, I specialize in uncovering Jaipur\'s hidden havelis and untold stories.', verified: true, superhost: true, tripsCompleted: 450, priceHourly: 500, priceFullDay: 2500 },
  { id: 2, name: 'Maria Santos', location: 'Lisbon', country: 'Portugal', flag: '🇵🇹', avatar: 'MS', avatarColor: '#ec4899', rating: 4.8, reviews: 156, languages: ['Portuguese', 'English'], categories: ['food', 'nightlife'], experience: '8 years', bio: 'A Lisbon native who left the corporate world to share my city\'s soul beyond the tourist trail.', verified: true, superhost: false, tripsCompleted: 312, priceHourly: 60, priceFullDay: 100 },
  { id: 3, name: 'Kenji Tanaka', location: 'Kyoto', country: 'Japan', flag: '🇯🇵', avatar: 'KT', avatarColor: '#14b8a6', rating: 5.0, reviews: 198, languages: ['Japanese', 'English'], categories: ['heritage', 'culture'], experience: '15 years', bio: 'Former temple monk turned guide. I offer spiritual walks, tea ceremonies, and temple photography sessions.', verified: true, superhost: true, tripsCompleted: 523, priceHourly: 3000, priceFullDay: 12000 },
  { id: 4, name: 'Fatima Al-Hassan', location: 'Marrakech', country: 'Morocco', flag: '🇲🇦', avatar: 'FA', avatarColor: '#f59e0b', rating: 4.9, reviews: 143, languages: ['Arabic', 'French'], categories: ['food', 'culture'], experience: '10 years', bio: 'From a family of spice merchants, I help you haggle like a local and discover artisan traditions.', verified: true, superhost: true, tripsCompleted: 389, priceHourly: 200, priceFullDay: 800 },
  { id: 5, name: 'Marco Benedetti', location: 'Rome', country: 'Italy', flag: '🇮🇹', avatar: 'MB', avatarColor: '#6366f1', rating: 4.7, reviews: 211, languages: ['Italian', 'English'], categories: ['heritage', 'food'], experience: '9 years', bio: 'Third-generation Roman with a passion for food and history. Skip the tourist traps.', verified: true, superhost: false, tripsCompleted: 476, priceHourly: 80, priceFullDay: 140 },
  { id: 6, name: 'Yuki Suzuki', location: 'Tokyo', country: 'Japan', flag: '🇯🇵', avatar: 'YS', avatarColor: '#ec4899', rating: 4.9, reviews: 203, languages: ['Japanese', 'English'], categories: ['food', 'nightlife'], experience: '10 years', bio: 'Shinjuku alleyways are my backyard. From golden gai\'s tiny bars to Tsukiji\'s pre-dawn auctions.', verified: true, superhost: true, tripsCompleted: 487, priceHourly: 3500, priceFullDay: 14000 },
]

const EXTERNAL = [
  { name: 'GetYourGuide', emoji: '🎫', url: 'https://getyourguide.com' },
  { name: 'Airbnb', emoji: '🏠', url: 'https://airbnb.com/experiences' },
  { name: 'Viator', emoji: '✈️', url: 'https://viator.com' },
]

export default function GuidesPage() {
  const router = useRouter()
  const { user, loading, signOut: doSignOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath] = useState('/guides')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [selectedGuide, setSelectedGuide] = useState<typeof GUIDES[0] | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [messages, setMessages] = useState<{from: string, text: string}[]>([])
  const [showBecomeGuide, setShowBecomeGuide] = useState(false)
  const [isVolunteer, setIsVolunteer] = useState(false)
  const [application, setApplication] = useState({ name: '', email: '', city: '', languages: [] as string[], bio: '' })
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading])

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
        setShowBookingModal(false)
        setShowChat(false)
        setShowBecomeGuide(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      try { localStorage.setItem('roamind_favorites', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const filteredGuides = useMemo(() => {
    return GUIDES.filter(g => {
      const matchesSearch = !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCity = selectedCity === 'all' || g.location.toLowerCase() === selectedCity
      const matchesCategory = selectedCategory === 'all' || g.categories.includes(selectedCategory)
      const matchesVerified = !verifiedOnly || g.verified
      return matchesSearch && matchesCity && matchesCategory && matchesVerified
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating
        case 'reviews': return b.reviews - a.reviews
        default: return 0
      }
    })
  }, [searchQuery, selectedCity, selectedCategory, verifiedOnly, sortBy])

  const handleBooking = () => {
    alert('Booking confirmed! Check your email for details.')
    setShowBookingModal(false)
    setSelectedGuide(null)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    setMessages([...messages, { from: 'You', text: chatMessage }])
    setChatMessage('')
  }

  const handleBecomeGuide = () => {
    alert('Application submitted! We\'ll contact you within 48 hours.')
    setShowBecomeGuide(false)
    setApplication({ name: '', email: '', city: '', languages: [], bio: '' })
    setIsVolunteer(false)
  }

  const handleLogout = () => doSignOut().then(() => router.push('/landing'))

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  if (selectedGuide) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', overflow: 'hidden' }}>
        <Sidebar sidebarOpen={true} activePath={activePath} user={user} onLogout={handleLogout} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', flexShrink: 0 }}>
            <button onClick={() => setSelectedGuide(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>← Back</button>
            <span style={{ fontWeight: 600 }}>{selectedGuide.name}</span>
            {selectedGuide.verified && <span style={{ color: C, fontSize: 12 }}>✓ Verified</span>}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: selectedGuide.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700 }}>{selectedGuide.avatar}</div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{selectedGuide.name}</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{selectedGuide.flag} {selectedGuide.location}</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div><span style={{ color: G }}>★</span> <strong>{selectedGuide.rating}</strong> <span style={{ color: 'rgba(255,255,255,0.5)' }}>({selectedGuide.reviews})</span></div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedGuide.tripsCompleted} tours</div>
                </div>
              </div>
            </div>
            <div style={{ background: BG3, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ lineHeight: 1.6 }}>{selectedGuide.bio}</p>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div onClick={() => setShowChat(true)} style={{ flex: 1, background: `${PURPLE}15`, border: `1px solid ${PURPLE}`, borderRadius: 10, padding: 14, textAlign: 'center', cursor: 'pointer', color: PURPLE, fontWeight: 600 }}>💬 Message</div>
              <div onClick={() => setShowBookingModal(true)} style={{ flex: 2, background: C, borderRadius: 10, padding: 14, textAlign: 'center', cursor: 'pointer', color: BG, fontWeight: 700 }}>Book Now</div>
            </div>
          </div>
        </div>
        {showBookingModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: BG2, borderRadius: 16, padding: 24, maxWidth: 400, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ color: '#fff', fontSize: 18 }}>Book {selectedGuide.name}</h2>
                <button onClick={() => setShowBookingModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>×</button>
              </div>
              <input type="date" style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', marginBottom: 12 }} />
              <input type="number" placeholder="Guests" defaultValue={1} style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', marginBottom: 16 }} />
              <button onClick={handleBooking} style={{ width: '100%', background: C, color: BG, padding: 14, borderRadius: 10, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Confirm Booking</button>
            </div>
          </div>
        )}
        {showChat && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: BG2, borderRadius: 16, padding: 24, maxWidth: 400, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ color: '#fff', fontSize: 18 }}>Chat</h2>
                <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ height: 200, overflowY: 'auto', marginBottom: 12, padding: 12, background: BG3, borderRadius: 8 }}>
                {messages.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Start a conversation...</p> : messages.map((m, i) => <div key={i} style={{ padding: 8, marginBottom: 8 }}><strong>{m.from}:</strong> {m.text}</div>)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={chatMessage} onChange={e => setChatMessage(e.target.value)} placeholder="Type..." style={{ flex: 1, padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                <button onClick={handleSendMessage} style={{ background: C, color: BG, padding: '12px 16px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', overflow: 'hidden' }}>
      <Sidebar sidebarOpen={true} activePath={activePath} user={user} onLogout={handleLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>👨‍🎓 Local Guides</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>{GUIDES.length} verified guides</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setShowBecomeGuide(true)} style={{ background: GR, color: BG, padding: '8px 16px', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Become Guide</button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: BG }}>{avatar}</div>
          </div>
        </div>
        <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="text" placeholder="Search guides..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', outline: 'none' }} />
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}>
              <option value="all">All Cities</option>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <div style={{ marginBottom: 16, color: 'rgba(255,255,255,0.5)' }}>Showing <strong style={{ color: C }}>{filteredGuides.length}</strong> guides</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filteredGuides.map(guide => (
              <div key={guide.id} onClick={() => setSelectedGuide(guide)} style={{ background: BG2, borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: guide.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{guide.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600 }}>{guide.name}</span>
                      {guide.verified && <span style={{ color: C, fontSize: 12 }}>✓</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{guide.flag} {guide.location}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleFavorite(guide.id) }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>{favorites.includes(guide.id) ? '❤️' : '🤍'}</button>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12, lineHeight: 1.5 }}>{guide.bio.substring(0, 80)}...</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                  {guide.categories.slice(0, 2).map((cat, i) => {
                    const c = CATEGORIES.find(x => x.id === cat)
                    return <span key={i} style={{ background: `${C}15`, color: C, padding: '3px 10px', borderRadius: 20, fontSize: 11 }}>{c?.emoji} {c?.name || cat}</span>
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><span style={{ color: G }}>★</span> <strong>{guide.rating}</strong> <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>({guide.reviews})</span></div>
                  <div><span style={{ color: C, fontWeight: 700 }}>{guide.priceHourly}</span>/hr</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: 20, background: BG2, borderRadius: 14 }}>
            <h3 style={{ marginBottom: 16 }}>External Platforms</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              {EXTERNAL.map((p, i) => (
                <a key={i} href={p.url} target="_blank" style={{ flex: 1, padding: 14, background: BG3, borderRadius: 10, textAlign: 'center', textDecoration: 'none' }}>
                  <span style={{ fontSize: 20 }}>{p.emoji}</span>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showBecomeGuide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ background: BG2, borderRadius: 16, padding: 24, maxWidth: 500, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ color: '#fff', fontSize: 20 }}>Become a Guide</h2>
            <button onClick={() => setShowBecomeGuide(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>×</button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: isVolunteer ? `${PURPLE}15` : BG3, borderRadius: 10, marginBottom: 16, cursor: 'pointer', border: `1px solid ${isVolunteer ? PURPLE : 'transparent'}` }}>
            <input type="checkbox" checked={isVolunteer} onChange={e => setIsVolunteer(e.target.checked)} />
            <span>Volunteer Guide (free/tip-based)</span>
          </label>
          <input type="text" placeholder="Your name" value={application.name} onChange={e => setApplication({...application, name: e.target.value})} style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', marginBottom: 12 }} />
          <input type="email" placeholder="Email" value={application.email} onChange={e => setApplication({...application, email: e.target.value})} style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', marginBottom: 12 }} />
          <select value={application.city} onChange={e => setApplication({...application, city: e.target.value})} style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', marginBottom: 12 }}>
            <option value="">Select city</option>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
          <textarea placeholder="About you..." value={application.bio} onChange={e => setApplication({...application, bio: e.target.value})} rows={3} style={{ width: '100%', padding: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', marginBottom: 16, resize: 'vertical' }} />
          <button onClick={handleBecomeGuide} disabled={!application.name || !application.email || !application.city} style={{ width: '100%', background: application.name && application.email && application.city ? C : 'rgba(255,255,255,0.1)', color: application.name && application.email && application.city ? BG : 'rgba(255,255,255,0.3)', padding: 14, borderRadius: 10, fontWeight: 600, border: 'none', cursor: application.name && application.email && application.city ? 'pointer' : 'not-allowed' }}>Submit</button>
        </div>
        </div>
      )}
    </div>
  )
}