'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const C = '#63d2ff', G = '#ffb74d', BG = '#020810', GR = '#4cff91'

interface SavedTrip {
  id: number
  savedAt: string
  destination: string
  state: string
  flag: string
  img: string
  days: number
  budget: 'low' | 'mid' | 'high'
  totalCost: number
  dailyCost: number
  travelers: number
  adults: number
  children: number
  stays: string[]
  hotelName: string
  highlights: string[]
  bestTime: string
  tags: string[]
}

export default function SavedTripsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [trips, setTrips] = useState<SavedTrip[]>(() => {
    try {
      const raw = localStorage.getItem('roamind_saved_trips')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [filterBudget, setFilterBudget] = useState<'all' | 'low' | 'mid' | 'high'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'cost_low' | 'cost_high' | 'days'>('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const deleteTrip = (id: number) => {
    const updated = trips.filter(t => t.id !== id)
    setTrips(updated)
    localStorage.setItem('roamind_saved_trips', JSON.stringify(updated))
    setDeleteId(null)
    showToast('🗑️ Trip removed from saved list')
  }

  const clearAll = () => {
    setTrips([])
    localStorage.removeItem('roamind_saved_trips')
    showToast('🗑️ All saved trips cleared')
  }

  const replan = (_trip: SavedTrip) => {
    router.push('/itinerary')
  }

  const budgetLabel = (b: string) => b === 'low' ? 'Budget' : b === 'mid' ? 'Comfort' : 'Luxury'
  const budgetColor = (b: string) => b === 'low' ? GR : b === 'mid' ? C : G

  const filtered = trips
    .filter(t => {
      const q = search.toLowerCase()
      const matchSearch = t.destination.toLowerCase().includes(q) || t.state.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q))
      const matchBudget = filterBudget === 'all' || t.budget === filterBudget
      return matchSearch && matchBudget
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id
      if (sortBy === 'oldest') return a.id - b.id
      if (sortBy === 'cost_low') return a.totalCost - b.totalCost
      if (sortBy === 'cost_high') return b.totalCost - a.totalCost
      if (sortBy === 'days') return b.days - a.days
      return 0
    })

  const stats = {
    total: trips.length,
    countries: new Set(trips.map(t => t.state)).size,
    totalDays: trips.reduce((s, t) => s + t.days, 0),
    totalBudget: trips.reduce((s, t) => s + t.totalCost, 0),
  }

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: `2px solid ${C}22`, borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif" }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 20px', background: 'rgba(2,8,16,0.97)', border: `1px solid ${C}44`, borderRadius: 12, fontSize: 13, color: '#fff', backdropFilter: 'blur(20px)', boxShadow: `0 8px 32px rgba(0,0,0,0.5)`, animation: 'slideIn 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#060d1a', border: '1px solid rgba(255,59,48,0.3)', borderRadius: 20, padding: '32px', maxWidth: 360, width: '90%', textAlign: 'center', animation: 'popIn 0.3s ease' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Delete this trip?</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6 }}>
              This will permanently remove <strong style={{ color: '#fff' }}>{trips.find(t => t.id === deleteId)?.destination}</strong> from your saved trips. Cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                Cancel
              </button>
              <button onClick={() => deleteTrip(deleteId)} style={{ flex: 1, padding: '11px', background: 'rgba(255,59,48,0.15)', border: '1px solid rgba(255,59,48,0.4)', borderRadius: 12, color: '#ff3b30', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2,8,16,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '13px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', fontFamily: "'Outfit',sans-serif" }}>
          <span style={{ fontSize: 20 }}>🌍</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, background: `linear-gradient(130deg,#fff 30%,${C} 70%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roamind</span>
        </button>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '4px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.07)' }}>{trips.length} saved trips</span>
          <button onClick={() => router.push('/itinerary')} style={{ padding: '7px 16px', background: `linear-gradient(135deg,${G},#ff8f00)`, border: 'none', color: BG, borderRadius: 100, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
            + Plan New Trip
          </button>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 100, cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>
            ← Dashboard
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 100px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: C, marginBottom: 9 }}>My Travel Collection</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, marginBottom: 7 }}>
            Saved <em style={{ fontStyle: 'italic', color: C }}>Trips</em>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
            All your AI-generated itineraries in one place. Edit, re-plan or delete anytime.
          </p>
        </div>

        {/* STATS ROW */}
        {trips.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '🗺️', label: 'Total Trips', value: stats.total, color: C },
              { icon: '📍', label: 'Destinations', value: stats.countries, color: G },
              { icon: '📅', label: 'Total Days', value: stats.totalDays, color: GR },
              { icon: '💰', label: 'Total Planned', value: `₹${(stats.totalBudget / 100000).toFixed(1)}L`, color: C },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}18`, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FILTERS & SEARCH */}
        {trips.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '9px 14px', flex: 1, minWidth: 200, maxWidth: 300 }}>
              <span style={{ opacity: 0.4 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations, tags..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#fff' }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>✕</button>}
            </div>

            {/* Budget Filter */}
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'low', 'mid', 'high'] as const).map(b => (
                <button key={b} onClick={() => setFilterBudget(b)} style={{ padding: '8px 14px', borderRadius: 100, border: `1px solid ${filterBudget === b ? C + '55' : 'rgba(255,255,255,0.1)'}`, background: filterBudget === b ? `${C}14` : 'rgba(255,255,255,0.03)', color: filterBudget === b ? C : 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s' }}>
                  {b === 'all' ? 'All' : budgetLabel(b)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              style={{ padding: '9px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12, fontFamily: "'Outfit',sans-serif", outline: 'none', cursor: 'pointer', colorScheme: 'dark' }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="cost_low">Cost: Low → High</option>
              <option value="cost_high">Cost: High → Low</option>
              <option value="days">Most Days</option>
            </select>

            {/* View Toggle */}
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 4 }}>
              {[['grid', '⊞'], ['list', '≡']].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v as 'grid' | 'list')} style={{ padding: '6px 12px', borderRadius: 7, border: 'none', background: view === v ? `${C}18` : 'transparent', color: view === v ? C : 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', transition: 'all .2s' }}>{icon}</button>
              ))}
            </div>

            {/* Clear All */}
            {trips.length > 0 && (
              <button onClick={() => { if (confirm('Clear ALL saved trips? This cannot be undone.')) clearAll() }}
                style={{ padding: '8px 16px', border: '1px solid rgba(255,59,48,0.3)', background: 'rgba(255,59,48,0.06)', color: 'rgba(255,100,100,0.7)', borderRadius: 100, cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit',sans-serif", marginLeft: 'auto', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,59,48,0.06)'}
              >🗑️ Clear All</button>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {trips.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🗺️</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 900, marginBottom: 10 }}>No saved trips yet</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32, lineHeight: 1.7 }}>
              Generate an AI itinerary and hit the <strong style={{ color: C }}>💾 Save Trip</strong> button<br />to see it here.
            </p>
            <button onClick={() => router.push('/itinerary')} style={{ padding: '14px 32px', background: `linear-gradient(135deg,${C},#3bb8e8)`, border: 'none', color: BG, borderRadius: 100, cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
              🤖 Generate My First Itinerary
            </button>
          </div>
        )}

        {/* NO RESULTS */}
        {trips.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No trips match your filter</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Try a different search or budget filter</p>
          </div>
        )}

        {/* GRID VIEW */}
        {filtered.length > 0 && view === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 18 }}>
            {filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={() => setDeleteId(trip.id)} onReplan={() => replan(trip)} budgetLabel={budgetLabel} budgetColor={budgetColor} />
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {filtered.length > 0 && view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(trip => (
              <TripListRow key={trip.id} trip={trip} onDelete={() => setDeleteId(trip.id)} onReplan={() => replan(trip)} budgetLabel={budgetLabel} budgetColor={budgetColor} />
            ))}
          </div>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(99,210,255,0.15);border-radius:10px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        select option{background:#060d1a;color:#fff;}
      `}</style>
    </div>
  )
}

// ─── GRID CARD ────────────────────────────────────────────────────────────────
function TripCard({ trip, onDelete, onReplan, budgetLabel, budgetColor }: {
  trip: SavedTrip
  onDelete: () => void
  onReplan: () => void
  budgetLabel: (b: string) => string
  budgetColor: (b: string) => string
}) {
  const [hovered, setHovered] = useState(false)
  const savedDate = new Date(trip.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${hovered ? C + '33' : 'rgba(255,255,255,0.07)'}`, borderRadius: 20, overflow: 'hidden', transition: 'all .3s', transform: hovered ? 'translateY(-5px)' : 'translateY(0)', boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.4)` : 'none' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <Image src={trip.img} alt={trip.destination} fill style={{ objectFit: 'cover', transition: 'transform .5s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} unoptimized />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(2,8,16,0.9) 0%,transparent 50%)' }} />

        {/* Budget badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', background: `${budgetColor(trip.budget)}22`, border: `1px solid ${budgetColor(trip.budget)}55`, borderRadius: 100, fontSize: 11, color: budgetColor(trip.budget), fontWeight: 700 }}>
          {budgetLabel(trip.budget)}
        </div>

        {/* Days badge */}
        <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', background: 'rgba(2,8,16,0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100, fontSize: 11, color: '#fff', fontWeight: 600 }}>
          📅 {trip.days} days
        </div>

        {/* Destination name */}
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18 }}>{trip.flag}</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, lineHeight: 1.1 }}>{trip.destination}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{trip.state}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
          {trip.tags.slice(0, 3).map((tag, i) => (
            <span key={i} style={{ fontSize: 10, padding: '3px 9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, color: 'rgba(255,255,255,0.45)' }}>{tag}</span>
          ))}
        </div>

        {/* Cost & travelers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: G }}>₹{trip.totalCost.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>₹{trip.dailyCost.toLocaleString()}/day/person</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C }}>👥 {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>🏨 {trip.stays.join(' + ')}</div>
          </div>
        </div>

        {/* Highlights */}
        <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {trip.highlights.slice(0, 2).map((h, i) => (
            <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
              <span style={{ color: G, flexShrink: 0, marginTop: 1 }}>★</span>{h}
            </div>
          ))}
        </div>

        {/* Hotel & saved date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>🏨</span>{trip.hotelName}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{savedDate}</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onReplan}
            style={{ flex: 1, padding: '9px', background: `${C}14`, border: `1px solid ${C}33`, color: C, borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Outfit',sans-serif", transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            onMouseEnter={e => e.currentTarget.style.background = `${C}24`}
            onMouseLeave={e => e.currentTarget.style.background = `${C}14`}
          >
            ✏️ Re-Plan
          </button>
          <button onClick={onDelete}
            style={{ padding: '9px 14px', background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.22)', color: 'rgba(255,100,100,0.75)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit',sans-serif", transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,59,48,0.08)'}
          >🗑️</button>
        </div>
      </div>
    </div>
  )
}

// ─── LIST ROW ─────────────────────────────────────────────────────────────────
function TripListRow({ trip, onDelete, onReplan, budgetLabel, budgetColor }: {
  trip: SavedTrip
  onDelete: () => void
  onReplan: () => void
  budgetLabel: (b: string) => string
  budgetColor: (b: string) => string
}) {
  const [hovered, setHovered] = useState(false)
  const savedDate = new Date(trip.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${hovered ? C + '33' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all .25s' }}
    >
      {/* Image */}
      <div style={{ width: 80, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <Image src={trip.img} alt={trip.destination} fill style={{ objectFit: 'cover' }} unoptimized />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.5),transparent)' }} />
        <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: 16 }}>{trip.flag}</div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700 }}>{trip.destination}</span>
          <span style={{ fontSize: 10, padding: '2px 8px', background: `${budgetColor(trip.budget)}18`, border: `1px solid ${budgetColor(trip.budget)}44`, borderRadius: 100, color: budgetColor(trip.budget), fontWeight: 600 }}>{budgetLabel(trip.budget)}</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{trip.state} · {trip.days} days · 👥 {trip.travelers} · 🏨 {trip.hotelName}</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {trip.tags.slice(0, 4).map((tag, i) => (
            <span key={i} style={{ fontSize: 9.5, padding: '2px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, color: 'rgba(255,255,255,0.4)' }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Cost */}
      <div style={{ textAlign: 'center', minWidth: 110 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, color: G }}>₹{trip.totalCost.toLocaleString()}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>₹{trip.dailyCost.toLocaleString()}/day</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{savedDate}</div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={onReplan}
          style={{ padding: '8px 18px', background: `${C}14`, border: `1px solid ${C}33`, color: C, borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Outfit',sans-serif", transition: 'all .2s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => e.currentTarget.style.background = `${C}24`}
          onMouseLeave={e => e.currentTarget.style.background = `${C}14`}
        >✏️ Re-Plan</button>
        <button onClick={onDelete}
          style={{ padding: '8px 14px', background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.22)', color: 'rgba(255,100,100,0.75)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit',sans-serif", transition: 'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,59,48,0.08)'}
        >🗑️</button>
      </div>
    </div>
  )
}