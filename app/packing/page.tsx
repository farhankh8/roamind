'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

interface SavedTrip {
  id: string
  date: string
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

interface PackingItem {
  id: string
  name: string
  quantity: number
  weight?: number
  packed?: boolean
  essential?: boolean
  packedBy?: string
}

interface Category {
  id: string
  emoji: string
  label: string
  items: PackingItem[]
  collapsed?: boolean
}

const C = '#63d2ff'
const G = '#ffb74d'
const BG = '#020810'
const BG2 = '#05090f'
const BG3 = '#0a1628'
const GR = '#4cff91'
const R = '#ff6b6b'
const PURPLE = '#a855f7'

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'clothing', emoji: '👕', label: 'Clothing', items: [], collapsed: false },
  { id: 'toiletries', emoji: '🧴', label: 'Toiletries', items: [], collapsed: false },
  { id: 'electronics', emoji: '🔌', label: 'Electronics', items: [], collapsed: false },
  { id: 'documents', emoji: '📄', label: 'Documents', items: [], collapsed: false },
  { id: 'health', emoji: '💊', label: 'Health & Medicine', items: [], collapsed: false },
  { id: 'entertainment', emoji: '🎮', label: 'Entertainment', items: [], collapsed: false },
  { id: 'misc', emoji: '🎒', label: 'Miscellaneous', items: [], collapsed: false },
]

const PRESET_TEMPLATES = [
  { id: 'beach', emoji: '🏖️', label: 'Beach Trip', purpose: 'Relaxing beach getaway' },
  { id: 'business', emoji: '💼', label: 'Business', purpose: 'Business travel essentials' },
  { id: 'hiking', emoji: '🥾', label: 'Hiking', purpose: 'Outdoor hiking adventure' },
  { id: 'city', emoji: '🏙️', label: 'City Break', purpose: 'Urban exploration' },
  { id: 'winter', emoji: '❄️', label: 'Winter', purpose: 'Cold weather travel' },
  { id: 'camping', emoji: '⛺', label: 'Camping', purpose: 'Outdoor camping essentials' },
]

const TRIP_PURPOSES = [
  { id: 'beach', emoji: '🏖️', label: 'Beach Trip' },
  { id: 'business', emoji: '💼', label: 'Business' },
  { id: 'hiking', emoji: '🥾', label: 'Hiking' },
  { id: 'city', emoji: '🏙️', label: 'City Break' },
  { id: 'winter', emoji: '❄️', label: 'Winter' },
  { id: 'camping', emoji: '⛺', label: 'Camping' },
]

const SUGGESTIONS: Record<string, { category: string; item: string; essential: boolean }[]> = {
  'Relaxing beach getaway': [
    { category: 'clothing', item: 'Swimsuit', essential: true },
    { category: 'clothing', item: 'Sunglasses', essential: true },
    { category: 'clothing', item: 'Flip flops', essential: true },
    { category: 'clothing', item: 'Beach towel', essential: true },
    { category: 'toiletries', item: 'Sunscreen SPF 50+', essential: true },
    { category: 'toiletries', item: 'Aloe vera gel', essential: false },
    { category: 'health', item: 'After-sun lotion', essential: false },
  ],
  'Business travel essentials': [
    { category: 'clothing', item: 'Formal shirts', essential: true },
    { category: 'clothing', item: 'Dress pants', essential: true },
    { category: 'clothing', item: 'Formal shoes', essential: true },
    { category: 'clothing', item: 'Belt', essential: true },
    { category: 'electronics', item: 'Laptop', essential: true },
    { category: 'electronics', item: 'Laptop charger', essential: true },
    { category: 'electronics', item: 'Business cards', essential: true },
    { category: 'documents', item: 'Passport/ID', essential: true },
    { category: 'documents', item: 'Travel itinerary', essential: true },
  ],
  'Outdoor hiking adventure': [
    { category: 'clothing', item: 'Hiking boots', essential: true },
    { category: 'clothing', item: 'Moisture-wicking socks', essential: true },
    { category: 'clothing', item: 'Quick-dry pants', essential: true },
    { category: 'clothing', item: 'Fleece jacket', essential: true },
    { category: 'entertainment', item: 'Water bottle', essential: true },
    { category: 'entertainment', item: 'Trail snacks', essential: true },
    { category: 'health', item: 'First aid kit', essential: true },
    { category: 'health', item: 'Insect repellent', essential: true },
  ],
  'Urban exploration': [
    { category: 'clothing', item: 'Comfortable walking shoes', essential: true },
    { category: 'clothing', item: 'Casual outfits', essential: true },
    { category: 'electronics', item: 'Portable charger', essential: true },
    { category: 'electronics', item: 'Camera', essential: false },
    { category: 'entertainment', item: 'City map/guidebook', essential: false },
    { category: 'documents', item: 'Transit pass', essential: true },
  ],
  'Cold weather travel': [
    { category: 'clothing', item: 'Winter jacket', essential: true },
    { category: 'clothing', item: 'Thermal underwear', essential: true },
    { category: 'clothing', item: 'Gloves', essential: true },
    { category: 'clothing', item: 'Beanie/Winter hat', essential: true },
    { category: 'clothing', item: 'Scarf', essential: true },
    { category: 'health', item: 'Lip balm', essential: true },
    { category: 'health', item: 'Hand warmers', essential: false },
  ],
  'Outdoor camping essentials': [
    { category: 'clothing', item: 'Hiking boots', essential: true },
    { category: 'entertainment', item: 'Sleeping bag', essential: true },
    { category: 'entertainment', item: 'Tent', essential: true },
    { category: 'entertainment', item: 'Flashlight/Headlamp', essential: true },
    { category: 'health', item: 'First aid kit', essential: true },
    { category: 'entertainment', item: 'Multi-tool', essential: true },
    { category: 'entertainment', item: 'Fire starter', essential: true },
  ],
}

const COMMONLY_FORGOTTEN = [
  { item: 'Phone charger', icon: '🔌' },
  { item: 'Toothbrush', icon: '🪥' },
  { item: 'Underwear', icon: '🩲' },
  { item: 'Passport', icon: '🛂' },
  { item: 'Socks', icon: '🧦' },
  { item: 'Medications', icon: '💊' },
  { item: 'Headphones', icon: '🎧' },
  { item: 'Toothpaste', icon: '🧴' },
]

const PACKERS = ['Solo', 'Couple', 'Family', 'Friends', 'Group']

export default function PackingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/packing')
  
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [selectedTripId, setSelectedTripId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [purpose, setPurpose] = useState('')
  const [suggestions, setSuggestions] = useState<{category: string; item: string; essential: boolean}[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('📁')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [airlineLimit, setAirlineLimit] = useState(23)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [dragItem, setDragItem] = useState<{catIdx: number; itemIdx: number} | null>(null)

  const _confettiRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const EMOJI_OPTIONS = ['📁', '📄', '👕', '👖', '👟', '🧥', '🧢', '🕶️', '💍', '👜', '🎒', '🧳', '📱', '🔌', '💻', '📷', '🎧', '🧴', '🪥', '💊', '🩺', '💳', '💵', '🍎', '🍫', '🧸', '🏋️', '🎾', '🏊', '🧘', '📚', '🎮', '🎸', '🎁']

  const [confettiData] = useState(() =>
    [...Array(50)].map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      rotate: Math.random() * 360,
      round: Math.random() > 0.5,
    }))
  )

  const _initializeEmptyCategories = () => {
    setCategories(DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      items: [],
      collapsed: false
    })))
  }

  useEffect(() => {
    let mounted = true
    const unsub = onAuthStateChanged(auth, u => { 
      if (mounted) { setUser(u); setLoading(false) } 
    })
    return () => { mounted = false; unsub() }
  }, [])

  useEffect(() => {
    try {
      const savedTrips = localStorage.getItem('roamind_saved_trips')
      if (savedTrips) {
        const parsed = JSON.parse(savedTrips)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTrips(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (selectedTripId) {
      try {
        const key = `packing_${selectedTripId}`
        const saved = localStorage.getItem(key)
        if (saved) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCategories(JSON.parse(saved))
        } else {
          setCategories(DEFAULT_CATEGORIES.map(cat => ({
            ...cat,
            items: [],
            collapsed: false
          })))
        }
      } catch {
        setCategories(DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          items: [],
          collapsed: false
        })))
      }
    }
  }, [selectedTripId])

  useEffect(() => {
    if (categories.length > 0 && selectedTripId) {
      const key = `packing_${selectedTripId}`
      localStorage.setItem(key, JSON.stringify(categories))
    }
  }, [categories, selectedTripId])

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(t)
    }
  }, [showConfetti])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))
  const nav = (_path: string) => {}
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()
  void firstName; void avatar;

  const handlePurposeChange = (newPurpose: string) => {
    setPurpose(newPurpose)
    if (newPurpose && SUGGESTIONS[newPurpose]) {
      const currentItems = categories.flatMap(c => c.items.map(i => i.name.toLowerCase()))
      const filtered = SUGGESTIONS[newPurpose].filter(s => !currentItems.includes(s.item.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const addAllSuggestions = () => {
    const newCategories = categories.map(cat => {
      const catSuggestions = suggestions.filter(s => s.category === cat.id)
      const newItems = catSuggestions.map(s => ({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        name: s.item,
        packed: false,
        quantity: 1,
        essential: s.essential,
        weight: 0,
        packedBy: ''
      }))
      return { ...cat, items: [...cat.items, ...newItems] }
    })
    setCategories(newCategories)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const addSuggestion = (suggestion: {category: string; item: string; essential: boolean}) => {
    const newCategories = categories.map(cat => {
      if (cat.id === suggestion.category) {
        return {
          ...cat,
          items: [...cat.items, {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: suggestion.item,
            packed: false,
            quantity: 1,
            essential: suggestion.essential,
            weight: 0,
            packedBy: ''
          }]
        }
      }
      return cat
    })
    setCategories(newCategories)
    setSuggestions(suggestions.filter(s => s.item !== suggestion.item))
    if (suggestions.filter(s => s.item !== suggestion.item).length === 0) {
      setShowSuggestions(false)
    }
  }

  const addItem = (catIdx: number, name: string) => {
    if (!name.trim()) return
    const newCategories = [...categories]
    newCategories[catIdx].items.push({
      id: Date.now().toString(),
      name: name.trim(),
      packed: false,
      quantity: 1,
      essential: false,
      weight: 0,
      packedBy: ''
    })
    setCategories(newCategories)
  }

  const deleteItem = (catIdx: number, itemIdx: number) => {
    const newCategories = [...categories]
    newCategories[catIdx].items.splice(itemIdx, 1)
    setCategories(newCategories)
  }

  const toggleItemPacked = (catIdx: number, itemIdx: number) => {
    const newCategories = [...categories]
    newCategories[catIdx].items[itemIdx].packed = !newCategories[catIdx].items[itemIdx].packed
    setCategories(newCategories)
    checkCompletion()
  }

  const updateItemQuantity = (catIdx: number, itemIdx: number, quantity: number) => {
    const newCategories = [...categories]
    newCategories[catIdx].items[itemIdx].quantity = Math.max(1, Math.min(99, quantity))
    setCategories(newCategories)
  }

  const toggleItemEssential = (catIdx: number, itemIdx: number) => {
    const newCategories = [...categories]
    newCategories[catIdx].items[itemIdx].essential = !newCategories[catIdx].items[itemIdx].essential
    setCategories(newCategories)
  }

  const updateItemWeight = (catIdx: number, itemIdx: number, weight: number) => {
    const newCategories = [...categories]
    newCategories[catIdx].items[itemIdx].weight = Math.max(0, weight)
    setCategories(newCategories)
  }

  const updateItemPackedBy = (catIdx: number, itemIdx: number, packedBy: string) => {
    const newCategories = [...categories]
    newCategories[catIdx].items[itemIdx].packedBy = packedBy
    setCategories(newCategories)
  }

  const toggleCategory = (catIdx: number) => {
    const newCategories = [...categories]
    newCategories[catIdx].collapsed = !newCategories[catIdx].collapsed
    setCategories(newCategories)
  }

  const markAllPacked = (catIdx: number) => {
    const newCategories = [...categories]
    newCategories[catIdx].items.forEach(item => { item.packed = true })
    setCategories(newCategories)
    checkCompletion()
  }

  const checkCompletion = () => {
    const total = categories.reduce((sum, cat) => sum + cat.items.length, 0)
    const packed = categories.reduce((sum, cat) => sum + cat.items.filter(i => i.packed).length, 0)
    if (total > 0 && packed === total) {
      setShowConfetti(true)
    }
  }

  const addCategory = () => {
    if (!newCategoryName.trim()) return
    const newCategory: Category = {
      id: 'custom_' + Date.now(),
      emoji: newCategoryEmoji,
      label: newCategoryName.trim(),
      items: [],
      collapsed: false
    }
    setCategories([...categories, newCategory])
    setNewCategoryName('')
    setNewCategoryEmoji('📁')
    setShowAddCategory(false)
  }

  const loadTemplate = (templateId: string) => {
    const template = PRESET_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      handlePurposeChange(template.purpose)
    }
  }

  const duplicateList = () => {
    if (trips.length < 2) return
    const _currentList = categories
    const otherTrips = trips.filter(t => t.id !== selectedTripId)
    if (otherTrips.length === 0) return
    
    const sourceTripId = otherTrips[0].id
    try {
      const key = `packing_${sourceTripId}`
      const saved = localStorage.getItem(key)
      if (saved) {
        const sourceList = JSON.parse(saved)
        setCategories(sourceList)
      }
    } catch {}
  }

  const getTotalWeight = () => {
    return categories.reduce((sum, cat) => 
      sum + cat.items.reduce((s, item) => s + (item.weight || 0) * item.quantity, 0), 0
    ) / 1000
  }

  const getCategoryWeight = (cat: Category) => {
    return cat.items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0) / 1000
  }

  const filteredCategories = searchQuery 
    ? categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter(cat => cat.items.length > 0)
    : categories

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const packedItems = categories.reduce((sum, cat) => sum + cat.items.filter(i => i.packed).length, 0)
  const progress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0

  const getProgressColor = () => {
    if (progress < 33) return R
    if (progress < 66) return G
    return GR
  }

  const essentialItems = categories.flatMap(cat => 
    cat.items.filter(item => item.essential).map(item => ({ ...item, category: cat.label }))
  )

  const exportAsText = () => {
    const trip = trips.find(t => t.id === selectedTripId)
    let text = `📦 PACKING LIST - ${trip?.destination || 'Trip'}\n`
    text += `Date: ${trip?.date || 'N/A'}\n`
    text += `${'='.repeat(30)}\n\n`
    
    categories.forEach(cat => {
      text += `${cat.emoji} ${cat.label}\n`
      cat.items.forEach(item => {
        const check = item.packed ? '☑' : '☐'
        text += `  ${check} ${item.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''}${item.essential ? ' ⭐' : ''}\n`
      })
      text += '\n'
    })
    
    text += `${'='.repeat(30)}\n`
    text += `Packed: ${packedItems}/${totalItems} (${progress}%)\n`
    text += `Weight: ${getTotalWeight().toFixed(2)} kg\n`
    
    navigator.clipboard.writeText(text)
  }

  const exportAsCSV = () => {
    let csv = 'Category,Item,Quantity,Essential,Weight (g),Packed,Packed By\n'
    categories.forEach(cat => {
      cat.items.forEach(item => {
        csv += `${cat.label},"${item.name}",${item.quantity},${item.essential},${item.weight || 0},${item.packed},"${item.packedBy || ''}"\n`
      })
    })
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `packing_list_${selectedTripId}.csv`
    a.click()
  }

  const handleDragStart = (catIdx: number, itemIdx: number) => {
    setDragItem({ catIdx, itemIdx })
  }

  const handleDragOver = (e: React.DragEvent, catIdx: number, itemIdx: number) => {
    e.preventDefault()
    if (!dragItem) return
    if (dragItem.catIdx === catIdx && dragItem.itemIdx === itemIdx) return
    
    const newCategories = [...categories]
    const item = newCategories[dragItem.catIdx].items[dragItem.itemIdx]
    newCategories[dragItem.catIdx].items.splice(dragItem.itemIdx, 1)
    newCategories[catIdx].items.splice(itemIdx, 0, item)
    setCategories(newCategories)
    setDragItem({ catIdx, itemIdx })
  }

  const handleDragEnd = () => {
    setDragItem(null)
  }

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  const _progressAngle = (progress / 100) * 360
  const radius = 45
  const circumference = 2 * Math.PI * radius

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes confetti { 
          0% { transform: translateY(0) rotate(0deg); opacity: 1; } 
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; } 
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .confetti-piece { position: absolute; width: 10px; height: 10px; top: 100%; animation: confetti 3s ease-out forwards; }
      `}</style>

      {/* CONFETTI */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
          {confettiData.map((c, i) => (
            <div key={i} className="confetti-piece" style={{
              left: `${c.left}%`,
              background: [C, G, GR, PURPLE, '#ff6b6b'][i % 5],
              animationDelay: `${c.delay}s`,
              transform: `rotate(${c.rotate}deg)`,
              borderRadius: c.round ? '50%' : '0',
            }} />
          ))}
        </div>
      )}

      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TOP BAR */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: '#fff' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>📦 Packing List</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Never forget essentials again</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={exportAsText} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>📋 Copy</button>
            <button onClick={exportAsCSV} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>📥 CSV</button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* TRIP SELECTOR & CONTROLS */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={selectedTripId} onChange={e => setSelectedTripId(e.target.value)} style={{ padding: '10px 14px', background: BG3, border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, color: '#fff', fontSize: 13, minWidth: 180 }}>
              <option value="">Select a trip...</option>
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.destination} - {t.date}</option>
              ))}
            </select>

            <select value={purpose} onChange={e => handlePurposeChange(e.target.value)} style={{ padding: '10px 14px', background: BG3, border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, color: '#fff', fontSize: 13, minWidth: 150 }}>
              <option value="">Trip Purpose</option>
              {TRIP_PURPOSES.map(p => (
                <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>
              ))}
            </select>

            <button onClick={duplicateList} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12, cursor: 'pointer' }}>📋 Duplicate List</button>
            
            <button onClick={() => setShowAddCategory(true)} style={{ padding: '10px 14px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.25)', borderRadius: 10, color: C, fontSize: 12, cursor: 'pointer' }}>+ Category</button>
          </div>

          {/* PROGRESS RING + WEIGHT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            {/* CIRCULAR PROGRESS */}
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle cx="40" cy="40" r={radius} fill="none" stroke={getProgressColor()} strokeWidth="8" 
                  strokeDasharray={circumference} strokeDashoffset={circumference - (progress / 100) * circumference}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: getProgressColor() }}>{progress}%</span>
              </div>
            </div>

            {/* PROGRESS TEXT */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {packedItems} of {totalItems} items packed
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', maxWidth: 300 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: getProgressColor(), borderRadius: 4, transition: 'width 0.5s ease, background 0.3s ease' }} />
              </div>
              {progress === 100 && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: GR + '20', border: `1px solid ${GR}`, borderRadius: 8, color: GR, fontSize: 13, fontWeight: 600 }}>
                  🎉 You&apos;re ready to go!
                </div>
              )}
            </div>

            {/* WEIGHT */}
            <div style={{ padding: '12px 16px', background: getTotalWeight() > airlineLimit ? R + '15' : G + '15', border: `1px solid ${getTotalWeight() > airlineLimit ? R : G}`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Estimated Bag Weight</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: getTotalWeight() > airlineLimit ? R : G }}>
                {getTotalWeight().toFixed(1)} kg
              </div>
              {getTotalWeight() > airlineLimit && (
                <div style={{ fontSize: 10, color: R }}>⚠️ Over {airlineLimit}kg limit</div>
              )}
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                Airline limit: 
                <input type="number" value={airlineLimit} onChange={e => setAirlineLimit(Number(e.target.value))} 
                  style={{ width: 40, background: 'transparent', border: 'none', color: 'inherit', fontSize: 10, textAlign: 'right', borderBottom: '1px solid rgba(255,255,255,0.2)', marginLeft: 4 }} />kg
              </div>
            </div>
          </div>

          {/* ESSENTIALS SUMMARY */}
          {essentialItems.length > 0 && (
            <div style={{ marginBottom: 20, padding: 16, background: 'linear-gradient(135deg,rgba(255,183,77,0.1),rgba(255,107,107,0.08))', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: G }}>⭐ Essential Items ({essentialItems.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {essentialItems.map((item, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: item.packed ? GR + '20' : BG3, border: `1px solid ${item.packed ? GR : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ textDecoration: item.packed ? 'line-through' : 'none', opacity: item.packed ? 0.5 : 1 }}>{item.name}</span>
                    {item.packed && <span>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMMONLY FORGOTTEN */}
          <div style={{ marginBottom: 20, padding: 12, background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: C, marginBottom: 8, fontWeight: 600 }}>💡 Commonly Forgotten</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COMMONLY_FORGOTTEN.map((item, i) => (
                <div key={i} style={{ padding: '6px 12px', background: BG3, borderRadius: 20, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{item.icon}</span> {item.item}
                </div>
              ))}
            </div>
          </div>

          {/* SMART SUGGESTIONS */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{ marginBottom: 20, padding: 16, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 14, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>✨ Smart Suggestions</div>
                <button onClick={addAllSuggestions} style={{ padding: '6px 12px', background: PURPLE, border: 'none', borderRadius: 8, color: '#fff', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                  + Add All Suggested
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{s.item}</span>
                    <button onClick={() => addSuggestion(s)} style={{ background: 'none', border: 'none', color: GR, cursor: 'pointer', padding: '0 4px' }}>+</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRESET TEMPLATES */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(255,255,255,0.5)' }}>Quick Templates</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PRESET_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => loadTemplate(t.id)} style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH */}
          <div style={{ marginBottom: 16 }}>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 Search items across all categories..." 
              style={{ width: '100%', padding: '12px 16px', background: BG3, border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, color: '#fff', fontSize: 13 }} />
          </div>

          {/* ADD CATEGORY MODAL */}
          {showAddCategory && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ background: BG2, padding: 24, borderRadius: 16, width: 320, border: '1px solid rgba(99,210,255,0.2)' }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Add Custom Category</div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Emoji</div>
                  <div style={{ position: 'relative' }} ref={emojiPickerRef}>
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ padding: '10px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 20, cursor: 'pointer' }}>
                      {newCategoryEmoji}
                    </button>
                    {showEmojiPicker && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, zIndex: 50, maxHeight: 200, overflow: 'auto' }}>
                        {EMOJI_OPTIONS.map(emoji => (
                          <button key={emoji} onClick={() => { setNewCategoryEmoji(emoji); setShowEmojiPicker(false) }} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>{emoji}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Category Name</div>
                  <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Enter category name" 
                    style={{ width: '100%', padding: '12px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowAddCategory(false)} style={{ flex: 1, padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={addCategory} style={{ flex: 1, padding: 12, background: C, border: 'none', borderRadius: 8, color: BG, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {filteredCategories.map((cat, catIdx) => (
            <div key={cat.id} style={{ marginBottom: 16, background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
              {/* CATEGORY HEADER */}
              <button onClick={() => toggleCategory(catIdx)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{cat.label}</span>
                  <span style={{ padding: '2px 8px', background: 'rgba(99,210,255,0.15)', borderRadius: 10, fontSize: 11, color: C }}>{cat.items.length}</span>
                  {getCategoryWeight(cat) > 0 && (
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>({getCategoryWeight(cat).toFixed(1)} kg)</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {cat.items.length > 0 && (
                    <button onClick={(e) => { e.stopPropagation(); markAllPacked(catIdx) }} style={{ padding: '4px 10px', background: 'rgba(76,255,145,0.1)', border: '1px solid rgba(76,255,145,0.2)', borderRadius: 6, color: GR, fontSize: 10, cursor: 'pointer' }}>
                      Mark All Packed
                    </button>
                  )}
                  <span style={{ fontSize: 12, transform: cat.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </div>
              </button>

              {/* CATEGORY ITEMS */}
              {!cat.collapsed && (
                <div style={{ padding: '0 16px 16px' }}>
                  {/* ADD ITEM INPUT */}
                  <AddItemInput onAdd={(name) => addItem(catIdx, name)} />

                  {/* ITEMS LIST */}
                  {cat.items.map((item, itemIdx) => (
                    <div key={item.id} draggable onDragStart={() => handleDragStart(catIdx, itemIdx)}
                      onDragOver={(e) => handleDragOver(e, catIdx, itemIdx)} onDragEnd={handleDragEnd}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', 
                        background: dragItem?.catIdx === catIdx && dragItem?.itemIdx === itemIdx ? 'rgba(99,210,255,0.1)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, marginBottom: 8,
                        cursor: 'grab', transition: 'background 0.2s'
                      }}>
                      {/* CHECKBOX */}
                      <button onClick={() => toggleItemPacked(catIdx, itemIdx)} style={{ 
                        width: 22, height: 22, borderRadius: 6, border: item.packed ? `2px solid ${GR}` : '2px solid rgba(255,255,255,0.2)',
                        background: item.packed ? GR : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0
                      }}>
                        {item.packed && <span style={{ color: BG, fontSize: 12 }}>✓</span>}
                      </button>

                      {/* ITEM NAME */}
                      <span style={{ 
                        flex: 1, fontSize: 13, textDecoration: item.packed ? 'line-through' : 'none', 
                        opacity: item.packed ? 0.5 : 1, color: item.essential ? G : '#fff'
                      }}>
                        {item.name}
                      </span>

                      {/* ESSENTIAL STAR */}
                      <button onClick={() => toggleItemEssential(catIdx, itemIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
                        {item.essential ? '⭐' : '☆'}
                      </button>

                      {/* QUANTITY */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button onClick={() => updateItemQuantity(catIdx, itemIdx, item.quantity - 1)} style={{ width: 24, height: 24, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12 }}>-</button>
                        <input type="number" value={item.quantity} onChange={e => updateItemQuantity(catIdx, itemIdx, parseInt(e.target.value) || 1)}
                          style={{ width: 36, padding: '4px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 12, textAlign: 'center' }} />
                        <button onClick={() => updateItemQuantity(catIdx, itemIdx, item.quantity + 1)} style={{ width: 24, height: 24, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12 }}>+</button>
                      </div>

                      {/* WEIGHT */}
                      <input type="number" value={item.weight || 0} onChange={e => updateItemWeight(catIdx, itemIdx, parseInt(e.target.value) || 0)}
                        placeholder="g" title="Weight (grams)" style={{ width: 50, padding: '4px 6px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 11 }} />

                      {/* PACKED BY */}
                      <select value={item.packedBy || ''} onChange={e => updateItemPackedBy(catIdx, itemIdx, e.target.value)}
                        style={{ padding: '4px 8px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 11 }}>
                        <option value="">Packer</option>
                        {PACKERS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>

                      {/* DELETE */}
                      <button onClick={() => deleteItem(catIdx, itemIdx)} style={{ width: 28, height: 28, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 6, color: R, cursor: 'pointer', fontSize: 14 }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {selectedTripId && categories.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>No items yet</div>
              <div style={{ fontSize: 13 }}>Select a trip purpose to get smart suggestions</div>
            </div>
          )}

          {!selectedTripId && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>Select a trip to start packing</div>
              <div style={{ fontSize: 13 }}>Choose your trip from the dropdown above</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AddItemInput({ onAdd }: { onAdd: (name: string) => void }) {
  const [value, setValue] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value)
      setValue('')
      setShowInput(false)
    }
  }

  if (!showInput) {
    return (
      <button onClick={() => setShowInput(true)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', marginBottom: 12 }}>
        + Add item
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <input type="text" value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKeyDown} onBlur={() => { if (!value) setShowInput(false) }}
        placeholder="Enter item name" autoFocus
        style={{ flex: 1, padding: '10px 12px', background: BG3, border: '1px solid rgba(99,210,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 13 }} />
      <button onClick={() => { if (value.trim()) { onAdd(value); setValue('') } }} style={{ padding: '10px 16px', background: C, border: 'none', borderRadius: 8, color: BG, fontWeight: 600, cursor: 'pointer' }}>Add</button>
    </div>
  )
}
