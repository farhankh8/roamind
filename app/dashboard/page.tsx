'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const BG = '#020810'
const C = '#63d2ff'
const G = '#ffb74d'
const GR = '#4cff91'
const PURPLE = '#a855f7'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

const destinations = [
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', tag: 'Trending', temp: '28°C', rating: 4.9 },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', tag: 'Popular', temp: '18°C', rating: 4.8 },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80', tag: 'Romantic', temp: '24°C', rating: 4.9 },
  { name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80', tag: 'Luxury', temp: '35°C', rating: 4.7 },
  { name: 'Kerala', country: 'India', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80', tag: 'Nature', temp: '30°C', rating: 4.8 },
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80', tag: 'Classic', temp: '15°C', rating: 4.9 },
]

const trendingTrips = [
  { title: 'Southeast Asia', route: 'Bangkok → Bali → Singapore', days: 14, budget: '₹85,000', rating: 4.9, img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&q=80', tag: 'Best Value' },
  { title: 'Europe Explorer', route: 'Paris → Rome → Barcelona', days: 12, budget: '₹1,20,000', rating: 4.8, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&q=80', tag: 'Most Popular' },
  { title: 'Himalayan Trek', route: 'Manali → Leh → Srinagar', days: 10, budget: '₹45,000', rating: 4.7, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80', tag: 'Adventure' },
]

const quickActions = [
  { icon: '🤖', label: 'AI Itinerary', path: '/itinerary', color: '#63d2ff' },
  { icon: '✈️', label: 'Flights', path: '/flights', color: '#ffb74d' },
  { icon: '🏨', label: 'Hotels', path: '/hotels', color: '#63d2ff' },
  { icon: '🛂', label: 'Visa', path: '/visa', color: '#ffb74d' },
  { icon: '💱', label: 'Currency', path: '/currency', color: '#63d2ff' },
  { icon: '🌤️', label: 'Weather', path: '/weather', color: '#ffb74d' },
  { icon: '🤝', label: 'Couch Surf', path: '/couchsurfing', color: '#63d2ff' },
  { icon: '👨‍💼', label: 'Local Guide', path: '/guides', color: '#ffb74d' },
  { icon: '🧠', label: 'Travel IQ', path: '/traveliq', color: '#63d2ff' },
  { icon: '💰', label: 'Budget', path: '/budget', color: '#ffb74d' },
]

const localGuides = [
  { name: 'Arjun K.', city: 'Bali, Indonesia', rating: 4.9, trips: 234, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', speciality: 'Beach & Culture' },
  { name: 'Yuki T.', city: 'Tokyo, Japan', rating: 5.0, trips: 189, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', speciality: 'Food & Nightlife' },
  { name: 'Marco R.', city: 'Rome, Italy', rating: 4.8, trips: 312, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', speciality: 'History & Art' },
]

const travelIQFacts = [
  { fact: 'Japan has more vending machines than people in some cities', country: 'Japan 🇯🇵' },
  { fact: 'India has the largest number of vegetarian restaurants in the world', country: 'India 🇮🇳' },
  { fact: 'Norway has a town called Hell — and yes, it does freeze over', country: 'Norway 🇳🇴' },
  { fact: 'Thailand is home to the world\'s smallest mammal — the bumblebee bat', country: 'Thailand 🇹🇭' },
  { fact: 'Iceland has no mosquitoes — despite being close to the Arctic', country: 'Iceland 🇮🇸' },
]

const moods = [
  { emoji: '🏖️', label: 'Beach Escape', tags: ['beach', 'ocean'] },
  { emoji: '🏔️', label: 'Mountain Trek', tags: ['mountain', 'trek'] },
  { emoji: '🌆', label: 'City Hop', tags: ['city', 'urban'] },
  { emoji: '🍜', label: 'Food Journey', tags: ['food', 'culinary'] },
  { emoji: '🧘', label: 'Wellness', tags: ['spa', 'yoga'] },
  { emoji: '🎭', label: 'Cultural', tags: ['culture', 'heritage'] },
  { emoji: '🌿', label: 'Nature', tags: ['nature', 'wildlife'] },
  { emoji: '💑', label: 'Romantic', tags: ['romantic', 'honeymoon'] },
]

const worldCities = [
  { city: 'Mumbai', flag: '🇮🇳', tz: 5.5 },
  { city: 'Dubai', flag: '🇦🇪', tz: 4 },
  { city: 'Singapore', flag: '🇸🇬', tz: 8 },
  { city: 'London', flag: '🇬🇧', tz: 0 },
  { city: 'New York', flag: '🇺🇸', tz: -5 },
  { city: 'Tokyo', flag: '🇯🇵', tz: 9 },
]

const flightDeals = [
  { route: 'DEL→GOA', price: 2840 }, { route: 'MUM→DXB', price: 8500 }, { route: 'BLR→SIN', price: 12000 },
  { route: 'DEL→NYC', price: 45000 }, { route: 'HYD→BKK', price: 7500 }, { route: 'CCU→BOM', price: 2200 },
  { route: 'DEL→THR', price: 12000 }, { route: 'BOM→LHR', price: 38000 }, { route: 'MAA→DXB', price: 9000 },
  { route: 'PNQ→SIN', price: 9500 }, { route: 'DEL→DUB', price: 14000 }, { route: 'JAI→GOA', price: 4500 },
  { route: 'BOM→AUH', price: 11000 }, { route: 'DEL→LHR', price: 42000 }, { route: 'BLR→JFK', price: 48000 },
]

const weatherData = [
  { dest: 'Manali', temp: 18, cond: 'clear', emoji: '☀️' }, { dest: 'Goa', temp: 30, cond: 'sunny', emoji: '🌅' },
  { dest: 'Kerala', temp: 28, cond: 'cloudy', emoji: '⛅' }, { dest: 'Rajasthan', temp: 35, cond: 'hot', emoji: '🔥' },
  { dest: 'Sikkim', temp: 15, cond: 'clear', emoji: '🌤️' }, { dest: 'Leh', temp: 12, cond: 'cold', emoji: '❄️' },
  { dest: 'Darjeeling', temp: 16, cond: 'misty', emoji: '🌫️' }, { dest: 'Andaman', temp: 29, cond: 'sunny', emoji: '🏝️' },
]

const festivalAlerts = [
  { name: 'Diwali', city: 'Jaipur', daysAway: 21 }, { name: 'Holi', city: 'Mathura', daysAway: 60 },
  { name: 'Onam', city: 'Kerala', daysAway: 45 }, { name: 'Durga Puja', city: 'Kolkata', daysAway: 30 },
  { name: 'Lohri', city: 'Punjab', daysAway: 14 }, { name: 'Ganesh Chaturthi', city: 'Mumbai', daysAway: 40 },
]

const travelStories = [
  "✈️ IndiGo adds new BLR→JFK non-stop route starting Dec",
  "🏔️ Kedarnath trekking season opens May 2026",
  "🌊 Maldives water villas: Book 90 days ahead for 30% off",
  "🎉 Thailand visa-free for Indians now till Nov 2026",
  "🍜 Kyoto food tour named world's best experience 2026",
  "🛂 UAE launches 5-year tourist visa with multiple entry",
  "⛷️ Gulmarg ranked top 3 ski destinations in Asia",
  "🦋 Ranthambore tiger count hits record 100+",
]

const packingItems = [
  { item: 'Passport', icon: '🛂', packed: false },
  { item: 'Travel Insurance', icon: '🏥', packed: false },
  { item: 'Hotel Booking', icon: '🏨', packed: false },
  { item: 'Flight Tickets', icon: '✈️', packed: false },
  { item: 'Currency', icon: '💱', packed: false },
  { item: 'Packing List', icon: '📦', packed: false },
  { item: 'Power Adapter', icon: '🔌', packed: false },
  { item: 'Medications', icon: '💊', packed: false },
]

const bucketList = [
  { dest: 'Maldives', emoji: '🏝️', done: false, priority: 'High' },
  { dest: 'Northern Lights', emoji: '🌌', done: false, priority: 'High' },
  { dest: 'Swiss Alps', emoji: '🏔️', done: false, priority: 'Medium' },
  { dest: 'Safari Kenya', emoji: '🦁', done: false, priority: 'Medium' },
  { dest: 'Great Barrier Reef', emoji: '🐠', done: false, priority: 'Low' },
]

const travelGoals = [
  { label: 'Visit 10 Countries', current: 2, total: 10, color: '#63d2ff' },
  { label: 'Try 50 Local Foods', current: 8, total: 50, color: '#ffb74d' },
  { label: 'Collect 20 Badges', current: 5, total: 20, color: '#a855f7' },
]

const visaFreeCountries = [
  { country: 'Thailand', flag: '🇹🇭', days: 30, type: 'Visa Free' },
  { country: 'Indonesia', flag: '🇮🇩', days: 30, type: 'Visa Free' },
  { country: 'Maldives', flag: '🇲🇻', days: 90, type: 'Visa Free' },
  { country: 'Sri Lanka', flag: '🇱🇰', days: 30, type: 'ETA' },
  { country: 'Nepal', flag: '🇳🇵', days: 999, type: 'No Visa Needed' },
  { country: 'Bhutan', flag: '🇧🇹', days: 999, type: 'No Visa Needed' },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string | null; displayName: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/dashboard')
  const [greeting, setGreeting] = useState('Good Morning')
  const [currentTime, setCurrentTime] = useState('')
  const [iqIdx, setIqIdx] = useState(0)
  const [subtitleText, setSubtitleText] = useState('')
  const [subtitleIdx, setSubtitleIdx] = useState(0)
  const [showAlerts, setShowAlerts] = useState(false)
  const [daysSinceTrip, setDaysSinceTrip] = useState(0)
  const [nextTrip, setNextTrip] = useState<{ destination: string; date: string } | null>(null)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  const [showTripForm, setShowTripForm] = useState(false)
  const [tripFormDest, setTripFormDest] = useState('')
  const [tripFormDate, setTripFormDate] = useState('')
  const [travelBrief, setTravelBrief] = useState<{ type: string; text: string; link: string; border: string }[]>([])
  const [activeMood, setActiveMood] = useState<string | null>(null)
  const [readinessScore, setReadinessScore] = useState(0)
  const [readinessChecklist, setReadinessChecklist] = useState({
    passport: false, visa: false, budget: false, packing: false, insurance: false, emergency: false
  })
  const [worldTimes, setWorldTimes] = useState<{ city: string; flag: string; time: string; dayDiff: number; isBusiness: boolean }[]>([])
  const [showWorldClocks, setShowWorldClocks] = useState(true)
  const [budgetData, setBudgetData] = useState<{ total: number; spent: number; transactions: { amount: number; cat: string; note: string; date: string }[] } | null>(null)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseCat, setExpenseCat] = useState('Food')
  const [expenseNote, setExpenseNote] = useState('')
  const [savedTrips, setSavedTrips] = useState<any[]>([])
  const [storyIdx, setStoryIdx] = useState(0)
  const [packingList, setPackingList] = useState(packingItems)
  const [bucketListState, setBucketListState] = useState(bucketList)
  const [showCurrencyConvert, setShowCurrencyConvert] = useState(false)
  const [currencyFrom, setCurrencyFrom] = useState('USD')
  const [currencyTo, setCurrencyTo] = useState('INR')
  const [currencyAmount, setCurrencyAmount] = useState('100')
  const [flightTab, setFlightTab] = useState(0)
  const [weatherTab, setWeatherTab] = useState(0)
  const [visaTab, setVisaTab] = useState(0)
  const [botOpen, setBotOpen] = useState(false)
  const [botMessages, setBotMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hi! I'm Roamind AI 🌍 Ask me anything — top places, visa info, best time to visit, local tips, or anything travel related!" }
  ])
  const [botInput, setBotInput] = useState('')
  const [botLoading, setBotLoading] = useState(false)
  const botEndRef = useRef<HTMLDivElement>(null)

  const currencyRates: Record<string, number> = { USD: 1, INR: 83.2, EUR: 0.92, GBP: 0.79, JPY: 149.5, THB: 35.2, SGD: 1.34, AUD: 1.53, AED: 3.67, MYR: 4.72 }

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening')
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const ti = setInterval(tick, 1000)
    const iqTimer = setInterval(() => setIqIdx(p => (p + 1) % travelIQFacts.length), 6000)
    const storyTimer = setInterval(() => setStoryIdx(p => (p + 1) % travelStories.length), 4000)
    const unsub = onAuthStateChanged(auth, u => { if (u) setUser(u); else router.push('/auth/login'); setLoading(false) })
    return () => { clearInterval(ti); clearInterval(iqTimer); clearInterval(storyTimer); unsub() }
  }, [router])

  useEffect(() => { botEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [botMessages])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('roamind_saved_trips')
      if (raw) setSavedTrips(JSON.parse(raw).slice(0, 3))
    } catch { setSavedTrips([]) }
  }, [])

  useEffect(() => {
    try {
      const lastTrip = localStorage.getItem('last_trip_date')
      if (lastTrip) {
        const diff = Math.floor((Date.now() - new Date(lastTrip).getTime()) / (1000 * 60 * 60 * 24))
        setDaysSinceTrip(diff)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const trip = localStorage.getItem('next_trip')
      if (trip) {
        const parsed = JSON.parse(trip)
        setNextTrip(parsed)
        const tick = () => {
          const diff = Math.max(0, new Date(parsed.date).getTime() - Date.now())
          setCountdown({ days: Math.floor(diff / (1000 * 60 * 60 * 24)), hours: Math.floor((diff / (1000 * 60 * 60)) % 24), mins: Math.floor((diff / (1000 * 60)) % 60), secs: Math.floor((diff / 1000) % 60) })
        }
        tick()
        const t = setInterval(tick, 1000)
        return () => clearInterval(t)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('readiness_checklist')
      if (saved) setReadinessChecklist(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    const score = (readinessChecklist.passport ? 20 : 0) + (readinessChecklist.visa ? 15 : 0) + (readinessChecklist.budget ? 15 : 0) + (readinessChecklist.packing ? 10 : 0) + (readinessChecklist.insurance ? 20 : 0) + (readinessChecklist.emergency ? 20 : 0)
    setReadinessScore(score)
    try { localStorage.setItem('readiness_checklist', JSON.stringify(readinessChecklist)) } catch {}
  }, [readinessChecklist])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const istOffset = 5.5
      const times = worldCities.map(c => {
        const local = new Date(now.getTime() + (c.tz - istOffset) * 60 * 60 * 1000)
        const hours = local.getHours().toString().padStart(2, '0')
        const mins = local.getMinutes().toString().padStart(2, '0')
        const secs = local.getSeconds().toString().padStart(2, '0')
        const dayDiff = Math.floor((local.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return { city: c.city, flag: c.flag, time: `${hours}:${mins}:${secs}`, dayDiff, isBusiness: parseInt(hours) >= 9 && parseInt(hours) <= 18 }
      })
      setWorldTimes(times)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    try {
      const data = localStorage.getItem('budget_tracker')
      if (data) setBudgetData(JSON.parse(data))
    } catch {}
  }, [])

  useEffect(() => {
    const subs = ["Where are you heading next?", "Your next adventure awaits", "Ready to explore the world?", "Discover hidden gems worldwide"]
    const type = subs[subtitleIdx]
    let i = 0
    const interval = setInterval(() => {
      if (i <= type.length) { setSubtitleText(type.slice(0, i)); i++ }
      else { clearInterval(interval); setTimeout(() => { setSubtitleIdx((subtitleIdx + 1) % subs.length) }, 3000) }
    }, 50)
    return () => clearInterval(interval)
  }, [subtitleIdx])

  useEffect(() => {
    const day = new Date().getDate()
    const deals = flightDeals.slice(day % 10, (day % 10) + 3)
    const weather = weatherData.slice(day % 8, (day % 8) + 2)
    const festivals = festivalAlerts.slice(day % 5, (day % 5) + 2)
    const brief = [
      { type: '💰', text: `Cheapest flight today: ${deals[0].route} ₹${deals[0].price.toLocaleString()}`, link: '/flights', border: C },
      { type: '🌤️', text: `Best weather now: ${weather[0].dest} ${weather[0].temp}°C ${weather[0].emoji}`, link: '/weather', border: GR },
      { type: '🎉', text: `Festival alert: ${festivals[0].name} in ${festivals[0].city} — ${festivals[0].daysAway} days away`, link: '/itinerary', border: G },
      { type: '🆕', text: `New: Ziro Valley, Arunachal Pradesh added to destinations`, link: '/itinerary', border: PURPLE },
    ]
    setTravelBrief(brief)
  }, [])

  const generateBrief = () => {
    const day = new Date().getDate()
    const deals = flightDeals.slice(day % 10, (day % 10) + 3)
    const weather = weatherData.slice(day % 8, (day % 8) + 2)
    const festivals = festivalAlerts.slice(day % 5, (day % 5) + 2)
    const brief = [
      { type: '💰', text: `Cheapest flight today: ${deals[0].route} ₹${deals[0].price.toLocaleString()}`, link: '/flights', border: C },
      { type: '🌤️', text: `Best weather now: ${weather[0].dest} ${weather[0].temp}°C ${weather[0].emoji}`, link: '/weather', border: GR },
      { type: '🎉', text: `Festival alert: ${festivals[0].name} in ${festivals[0].city} — ${festivals[0].daysAway} days away`, link: '/itinerary', border: G },
      { type: '🆕', text: `Trending: Kyoto food tour named world's best experience 2026`, link: '/itinerary', border: PURPLE },
    ]
    setTravelBrief(brief)
  }

  const saveNextTrip = () => {
    if (!tripFormDest || !tripFormDate) return
    const trip = { destination: tripFormDest, date: tripFormDate }
    localStorage.setItem('next_trip', JSON.stringify(trip))
    setNextTrip(trip)
    setShowTripForm(false); setTripFormDest(''); setTripFormDate('')
  }

  const saveExpense = () => {
    if (!expenseAmount) return
    const newExpense = { amount: parseInt(expenseAmount), cat: expenseCat, note: expenseNote, date: new Date().toISOString().split('T')[0] }
    const updated = budgetData ? { ...budgetData, spent: budgetData.spent + newExpense.amount, transactions: [newExpense, ...budgetData.transactions.slice(0, 2)] } : { total: 50000, spent: newExpense.amount, transactions: [newExpense] }
    setBudgetData(updated)
    try { localStorage.setItem('budget_tracker', JSON.stringify(updated)) } catch {}
    setShowExpenseForm(false); setExpenseAmount(''); setExpenseNote('')
  }

  const deleteSavedTrip = (id: number) => {
    const all = JSON.parse(localStorage.getItem('roamind_saved_trips') || '[]')
    const updated = all.filter((t: any) => t.id !== id)
    localStorage.setItem('roamind_saved_trips', JSON.stringify(updated))
    setSavedTrips(updated.slice(0, 3))
  }

  const togglePacking = (idx: number) => {
    const updated = [...packingList]
    updated[idx].packed = !updated[idx].packed
    setPackingList(updated)
  }

  const toggleBucket = (idx: number) => {
    const updated = [...bucketListState]
    updated[idx].done = !updated[idx].done
    setBucketListState(updated)
  }

  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))

  const convertCurrency = () => {
    const fromRate = currencyRates[currencyFrom] || 1
    const toRate = currencyRates[currencyTo] || 1
    const result = (parseFloat(currencyAmount) / fromRate) * toRate
    return isNaN(result) ? '0' : result.toFixed(2)
  }

  const sendBot = async () => {
    if (!botInput.trim() || botLoading) return
    const msg = botInput.trim()
    setBotInput('')
    setBotMessages(p => [...p, { role: 'user', text: msg }])
    setBotLoading(true)
    try {
      const res = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) })
      const d = await res.json()
      setBotMessages(p => [...p, { role: 'bot', text: d.reply || 'Ask me about travel destinations, tips, or anything!' }])
    } catch { setBotMessages(p => [...p, { role: 'bot', text: 'Connection issue! Try again 🌐' }]) }
    setBotLoading(false)
  }

  const packedCount = packingList.filter(p => p.packed).length

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TOP BAR */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: '#fff' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{greeting}, {firstName}! 👋</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowAlerts(!showAlerts)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 13, cursor: 'pointer' }}>🔔 Alerts</button>
            {showAlerts && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#05090f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, zIndex: 60, minWidth: 220 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: C }}>Notifications</div>
                <div style={{ fontSize: 11, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>💰 Price drop: DEL→DXB ₹18K</div>
                <div style={{ fontSize: 11, padding: '8px 0' }}>🛂 Visa: UAE opens Oct 15</div>
                <div style={{ fontSize: 11, padding: '8px 0' }}>🌤️ Perfect weather in Goa today!</div>
              </div>
            )}
          </div>
        </div>

        {/* WORLD CLOCK STRIP */}
        {showWorldClocks && (
          <div style={{ display: 'flex', gap: 16, padding: '8px 22px', background: 'rgba(0,5,14,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)', overflowX: 'auto', flexShrink: 0 }}>
            {worldTimes.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6, background: w.isBusiness ? 'rgba(76,255,145,0.1)' : 'transparent', flexShrink: 0 }}>
                <span style={{ fontSize: 14 }}>{w.flag}</span>
                <span style={{ fontSize: 11, color: w.isBusiness ? '#4cff91' : 'rgba(255,255,255,0.5)' }}>{w.city}</span>
                <span style={{ fontSize: 11, color: w.isBusiness ? '#4cff91' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{w.time}</span>
                {w.dayDiff !== 0 && <span style={{ fontSize: 9, color: w.dayDiff > 0 ? '#4cff91' : '#ff6b6b' }}>{w.dayDiff > 0 ? '+1d' : '-1d'}</span>}
              </div>
            ))}
            <button onClick={() => setShowWorldClocks(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>✕</button>
          </div>
        )}

        {/* SECOND TOP BAR */}
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(99,210,255,0.05)', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 10, maxWidth: 320 }}>
              <span>🧠</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{travelIQFacts[iqIdx].fact}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', padding: '5px 11px', borderRadius: 8 }}>{currentTime}</div>
            <button onClick={() => setShowWorldClocks(true)} style={{ padding: '7px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>🌐</button>
            <button onClick={() => setShowCurrencyConvert(!showCurrencyConvert)} style={{ padding: '7px 12px', background: showCurrencyConvert ? `${G}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${showCurrencyConvert ? G : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, color: showCurrencyConvert ? G : 'rgba(255,255,255,0.5)' }}>💱</button>
            <button onClick={() => nav('/itinerary')} style={{ padding: '7px 16px', background: 'linear-gradient(135deg,#ffb74d,#ff8f00)', border: 'none', color: '#000814', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>+ Plan Trip</button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer' }}>{avatar}</div>
          </div>
        </div>

        {/* CURRENCY CONVERTER POPUP */}
        {showCurrencyConvert && (
          <div style={{ position: 'absolute', top: 130, right: 22, background: '#05090f', border: '1px solid rgba(255,183,77,0.25)', borderRadius: 16, padding: 16, zIndex: 70, width: 280, boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: G }}>💱 Currency Converter</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <input value={currencyAmount} onChange={e => setCurrencyAmount(e.target.value)} placeholder="Amount" type="number" style={{ flex: 1, padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <select value={currencyFrom} onChange={e => setCurrencyFrom(e.target.value)} style={{ padding: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 11 }}>
                {Object.keys(currencyRates).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <div style={{ flex: 1, padding: '7px 10px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 8, fontSize: 14, fontWeight: 700, color: C }}>{convertCurrency()} {currencyTo}</div>
              <select value={currencyTo} onChange={e => setCurrencyTo(e.target.value)} style={{ padding: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 11 }}>
                {Object.keys(currencyRates).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => nav('/currency')} style={{ width: '100%', padding: '7px', background: `${G}18`, border: `1px solid ${G}33`, borderRadius: 8, color: G, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>View All Rates →</button>
          </div>
        )}

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* HERO + COUNTDOWN */}
          <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.09) 0%,rgba(255,183,77,0.06) 60%,rgba(168,85,247,0.04) 100%)', border: '1px solid rgba(99,210,255,0.14)', borderRadius: 20, padding: '24px 28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, background: 'radial-gradient(circle,rgba(99,210,255,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{greeting === 'Good Morning' ? '🌅' : greeting === 'Good Afternoon' ? '☀️' : '🌙'} {greeting}, {firstName}!</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', minHeight: 20 }}>{subtitleText}<span style={{ animation: 'blink 1s infinite', color: C }}>|</span></div>
                <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>🌍 {daysSinceTrip} days since your last trip</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 6 }}>{travelStories[storyIdx]}</div>
              </div>
            </div>

            {/* TRIP COUNTDOWN */}
            <div style={{ marginTop: 20, background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: 16 }}>
              {nextTrip ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>⏳ Your Next Trip</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{nextTrip.destination}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[['Days', countdown.days], ['Hrs', countdown.hours], ['Mins', countdown.mins], ['Secs', countdown.secs]].map(([l, v]) => (
                      <div key={l} style={{ textAlign: 'center', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 10, padding: '8px 12px', minWidth: 50 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: C }}>{String(v).padStart(2, '0')}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Plan your next adventure →</div>
                  <button onClick={() => nav('/itinerary')} style={{ padding: '8px 20px', background: `linear-gradient(135deg,${C},#3bb8e8)`, border: 'none', borderRadius: 10, color: '#000814', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Create Itinerary</button>
                </div>
              )}
              {!nextTrip && <button onClick={() => setShowTripForm(!showTripForm)} style={{ marginTop: 10, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer' }}>✏️ Set Trip Date</button>}
              {showTripForm && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <input value={tripFormDest} onChange={e => setTripFormDest(e.target.value)} placeholder="Destination" style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  <input type="date" value={tripFormDate} onChange={e => setTripFormDate(e.target.value)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  <button onClick={saveNextTrip} style={{ padding: '8px 16px', background: C, border: 'none', borderRadius: 8, color: '#000814', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                </div>
              )}
            </div>
          </div>

          {/* MOOD SELECTOR */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'rgba(255,255,255,0.6)' }}>✨ What kind of trip are you planning?</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {moods.map(m => (
                <button key={m.label} onClick={() => setActiveMood(activeMood === m.label ? null : m.label)} style={{ padding: '10px 16px', borderRadius: 100, border: `1px solid ${activeMood === m.label ? C : 'rgba(255,255,255,0.1)'}`, background: activeMood === m.label ? `${C}18` : 'rgba(255,255,255,0.03)', color: activeMood === m.label ? C : 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* STATS + TRAVEL BRIEF + GOALS - 3 COLUMNS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* STATS */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.7)' }}>📊 Your Travel Stats</div>
              {[
                { icon: '🗺️', label: 'Trips Planned', value: String(savedTrips.length || 0), color: '#63d2ff' },
                { icon: '🌍', label: 'Countries', value: '2', color: '#ffb74d' },
                { icon: '🏅', label: 'Badges', value: '5', color: '#a855f7' },
                { icon: '📅', label: 'Days Travelled', value: '28', color: '#4cff91' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.color}12`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* TRAVEL BRIEF */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>📰 Today's Travel Brief</div>
                <button onClick={generateBrief} style={{ background: 'transparent', border: 'none', color: C, cursor: 'pointer', fontSize: 11 }}>Refresh ↻</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {travelBrief.map((b, i) => (
                  <div key={i} onClick={() => nav(b.link)} style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${b.border}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{b.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRAVEL GOALS */}
            <div style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.07),rgba(99,210,255,0.05))', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'rgba(255,255,255,0.7)' }}>🎯 Travel Goals</div>
              {travelGoals.map((g, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{g.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: g.color }}>{g.current}/{g.total}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(g.current / g.total) * 100}%`, background: g.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
              <button onClick={() => nav('/traveliq')} style={{ width: '100%', marginTop: 8, padding: '8px', background: `${PURPLE}18`, border: `1px solid ${PURPLE}33`, borderRadius: 8, color: PURPLE, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>🏆 Set New Goals</button>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700 }}>Quick Actions</h2>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 2, textTransform: 'uppercase' }}>10 features</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 8 }}>
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => nav(a.path)} style={{ padding: '14px 6px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, transition: 'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${a.color}0c`; e.currentTarget.style.border = `1px solid ${a.color}26`; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DESTINATIONS + FLIGHT DEALS + WEATHER + VISA - 4 TABS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 18, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700 }}>Top Destinations</h2>
                <button onClick={() => nav('/itinerary')} style={{ fontSize: 11, color: '#63d2ff', background: 'none', border: 'none', cursor: 'pointer' }}>Explore →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {destinations.map((d, i) => (
                  <div key={i} onClick={() => nav('/itinerary')} style={{ position: 'relative', borderRadius: 11, overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/10', transition: 'transform 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.45)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 55%)' }} />
                    <div style={{ position: 'absolute', top: 7, right: 7, padding: '1px 7px', background: 'rgba(99,210,255,0.2)', border: '1px solid rgba(99,210,255,0.35)', borderRadius: 100, fontSize: 8.5, color: '#63d2ff', fontWeight: 600 }}>{d.tag}</div>
                    <div style={{ position: 'absolute', bottom: 7, left: 9 }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontWeight: 700 }}>{d.name}</div>
                      <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)' }}>{d.country} · {d.temp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRENDING + FLIGHT + WEATHER + VISA WIDGETS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* TRENDING TRIPS */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,183,77,0.08)', borderRadius: 16, padding: 16, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>🔥 Trending Trips</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {trendingTrips.map((t, i) => (
                    <div key={i} onClick={() => nav('/itinerary')} style={{ display: 'flex', gap: 8, padding: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.05)'; e.currentTarget.style.border = '1px solid rgba(99,210,255,0.18)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <img src={t.img} alt={t.title} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: 11, fontWeight: 600 }}>{t.title}</span>
                          <span style={{ fontSize: 10, color: '#ffb74d', fontWeight: 600 }}>{t.budget}</span>
                        </div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{t.route}</div>
                        <span style={{ fontSize: 9, padding: '1px 6px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 100, color: '#63d2ff' }}>{t.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4 TAB WIDGET: FLIGHTS / WEATHER / VISA / PACKING */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            {/* FLIGHT DEALS */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700 }}>✈️ Flight Deals</h3>
                <button onClick={() => nav('/flights')} style={{ fontSize: 10, color: C, background: 'none', border: 'none', cursor: 'pointer' }}>More →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {flightDeals.slice(0, 4).map((f, i) => (
                  <div key={i} onClick={() => nav('/flights')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = `${C}0c`}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{f.route}</span>
                    <span style={{ fontSize: 11, color: GR, fontWeight: 700 }}>₹{f.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE WEATHER */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(76,255,145,0.08)', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700 }}>🌤️ Live Weather</h3>
                <button onClick={() => nav('/weather')} style={{ fontSize: 10, color: GR, background: 'none', border: 'none', cursor: 'pointer' }}>More →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {weatherData.slice(0, 4).map((w, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>{w.emoji}</span>
                      <span style={{ fontSize: 11 }}>{w.dest}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: w.temp > 30 ? '#ff6b6b' : w.temp < 15 ? '#63d2ff' : GR }}>{w.temp}°C</span>
                  </div>
                ))}
              </div>
            </div>

            {/* VISA FREE COUNTRIES */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.08)', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700 }}>🛂 Visa Free</h3>
                <button onClick={() => nav('/visa')} style={{ fontSize: 10, color: PURPLE, background: 'none', border: 'none', cursor: 'pointer' }}>More →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {visaFreeCountries.slice(0, 4).map((v, i) => (
                  <div key={i} onClick={() => nav('/visa')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = `${PURPLE}0c`}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{v.flag}</span>
                      <span style={{ fontSize: 11 }}>{v.country}</span>
                    </div>
                    <span style={{ fontSize: 9, color: v.days > 30 ? GR : C, fontWeight: 600 }}>{v.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PACKING CHECKLIST */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,183,77,0.08)', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700 }}>📦 Packing List</h3>
                <span style={{ fontSize: 11, color: G, fontWeight: 700 }}>{packedCount}/{packingList.length}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(packedCount / packingList.length) * 100}%`, background: `linear-gradient(90deg,${G},#ff8f00)`, borderRadius: 2, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {packingList.slice(0, 4).map((p, i) => (
                  <div key={i} onClick={() => togglePacking(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: p.packed ? `${GR}0c` : 'rgba(255,255,255,0.02)', borderRadius: 7, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid ${p.packed ? GR : 'rgba(255,255,255,0.2)'}`, background: p.packed ? GR : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.packed && <span style={{ fontSize: 9, color: '#000814' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 12 }}>{p.icon}</span>
                    <span style={{ fontSize: 11, color: p.packed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)', textDecoration: p.packed ? 'line-through' : 'none' }}>{p.item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => nav('/packing')} style={{ width: '100%', marginTop: 10, padding: '6px', background: `${G}18`, border: `1px solid ${G}33`, borderRadius: 8, color: G, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Full List →</button>
            </div>
          </div>

          {/* BUCKET LIST + BUDGET + TRAVEL IQ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* BUCKET LIST */}
            <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.06),rgba(255,183,77,0.04))', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🪣 Travel Bucket List</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bucketListState.map((b, i) => (
                  <div key={i} onClick={() => toggleBucket(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: b.done ? `${GR}0c` : 'rgba(255,255,255,0.025)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', border: b.done ? `1px solid ${GR}30` : '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 18 }}>{b.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: b.done ? GR : 'rgba(255,255,255,0.8)', textDecoration: b.done ? 'line-through' : 'none' }}>{b.dest}</div>
                      <div style={{ fontSize: 9.5, color: b.priority === 'High' ? '#ff6b6b' : b.priority === 'Medium' ? G : 'rgba(255,255,255,0.35)' }}>{b.priority} Priority</div>
                    </div>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${b.done ? GR : 'rgba(255,255,255,0.2)'}`, background: b.done ? GR : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {b.done && <span style={{ fontSize: 9, color: '#000814' }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BUDGET SNAPSHOT */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,183,77,0.1)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>💰 Budget Snapshot</h3>
                <button onClick={() => setShowExpenseForm(!showExpenseForm)} style={{ padding: '4px 12px', background: `${G}18`, border: `1px solid ${G}33`, borderRadius: 8, color: G, fontSize: 11, cursor: 'pointer' }}>+ Add</button>
              </div>
              {budgetData ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: `conic-gradient(${G} ${(budgetData.spent / budgetData.total) * 100}%,rgba(255,255,255,0.1) 0%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#05090f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: G }}>{Math.round((budgetData.spent / budgetData.total) * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Spent: ₹{budgetData.spent.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Budget: ₹{budgetData.total.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: GR, marginTop: 3 }}>Remaining: ₹{(budgetData.total - budgetData.spent).toLocaleString()}</div>
                    </div>
                  </div>
                  {budgetData.transactions.slice(0, 3).map((t, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t.cat} · {t.note || 'N/A'}</span>
                      <span style={{ color: G }}>-₹{t.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>💸</div>
                  <div style={{ fontSize: 12, marginBottom: 10, color: 'rgba(255,255,255,0.4)' }}>No budget yet</div>
                  <button onClick={() => nav('/budget')} style={{ padding: '8px 16px', background: `${C}18`, border: `1px solid ${C}33`, borderRadius: 8, color: C, fontSize: 11, cursor: 'pointer' }}>Set Budget →</button>
                </div>
              )}
              {showExpenseForm && (
                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <input value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="Amount" type="number" style={{ flex: 1, minWidth: 80, padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                  <select value={expenseCat} onChange={e => setExpenseCat(e.target.value)} style={{ padding: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 11 }}>
                    <option>Food</option><option>Flights</option><option>Hotels</option><option>Activities</option><option>Misc</option>
                  </select>
                  <button onClick={saveExpense} style={{ padding: '7px 14px', background: G, border: 'none', borderRadius: 8, color: '#000814', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add</button>
                </div>
              )}
            </div>

            {/* TRAVEL IQ + READINESS */}
            <div style={{ background: 'linear-gradient(135deg,rgba(123,108,255,0.08),rgba(99,210,255,0.05))', border: '1px solid rgba(123,108,255,0.15)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>🧠</span>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700 }}>Travel IQ</h3>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Did you know?</div>
                </div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 8 }}>{travelIQFacts[iqIdx].fact}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)' }}>{travelIQFacts[iqIdx].country}</div>
              </div>
              <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 12 }}>
                {travelIQFacts.map((_, i) => (
                  <div key={i} onClick={() => setIqIdx(i)} style={{ width: i === iqIdx ? 16 : 5, height: 5, borderRadius: 3, background: i === iqIdx ? '#7b6cff' : 'rgba(255,255,255,0.15)', transition: 'all 0.4s', cursor: 'pointer' }} />
                ))}
              </div>
              <button onClick={() => nav('/traveliq')} style={{ width: '100%', padding: '8px', background: 'rgba(123,108,255,0.12)', border: '1px solid rgba(123,108,255,0.25)', borderRadius: 10, cursor: 'pointer', color: '#a89bff', fontSize: 11, fontWeight: 600 }}>Explore Travel IQ →</button>
            </div>
          </div>

          {/* TRAVEL READINESS SCORE */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 16, padding: 18, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700 }}>🏅 Travel Readiness Score</h3>
              <div style={{ fontSize: readinessScore >= 71 ? 13 : 11, fontWeight: 700, color: readinessScore >= 71 ? '#4cff91' : readinessScore >= 41 ? '#ffb74d' : '#ff6b6b' }}>
                {readinessScore <= 40 ? '🔴 Not Ready' : readinessScore <= 70 ? '🟡 Getting There' : readinessScore <= 90 ? '🟢 Almost Set' : '⭐ Travel Ready!'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: 80, height: 80 }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke={readinessScore >= 71 ? '#4cff91' : readinessScore >= 41 ? '#ffb74d' : '#ff6b6b'} strokeWidth="3" strokeDasharray={`${readinessScore} 100`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: C }}>{readinessScore}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 20px', flex: 1 }}>
                {[{ l: 'Passport valid >6 months', k: 'passport', pts: 20 }, { l: 'Visa for destination', k: 'visa', pts: 15 }, { l: 'Budget set', k: 'budget', pts: 15 }, { l: 'Packing list done', k: 'packing', pts: 10 }, { l: 'Travel insurance', k: 'insurance', pts: 20 }, { l: 'Emergency contacts', k: 'emergency', pts: 20 }].map(c => (
                  <label key={c.k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={readinessChecklist[c.k as keyof typeof readinessChecklist]} onChange={e => setReadinessChecklist(p => ({ ...p, [c.k]: e.target.checked }))} style={{ accentColor: C, width: 14, height: 14 }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{c.l}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* LOCAL GUIDES + COUCH SURFING */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 18, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700 }}>👨‍💼 Local Guides</h2>
                <button onClick={() => nav('/guides')} style={{ fontSize: 11, color: '#63d2ff', background: 'none', border: 'none', cursor: 'pointer' }}>All →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {localGuides.map((g, i) => (
                  <div key={i} onClick={() => nav('/guides')} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', padding: '8px 10px', borderRadius: 10, transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={g.img} alt={g.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(99,210,255,0.2)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{g.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{g.city} · {g.speciality}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#ffb74d', fontWeight: 600 }}>★ {g.rating}</div>
                  </div>
                ))}
              </div>
            </div>

            <div onClick={() => nav('/couchsurfing')} style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08),rgba(255,183,77,0.06))', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 18, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,210,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(99,210,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🤝</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Couch Surfing</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 14 }}>Stay with locals worldwide. Free, authentic experiences with verified hosts.</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {['🏠 2,400+ hosts', '🌍 120+ countries', '⭐ 4.8 avg rating'].map(s => (
                  <span key={s} style={{ fontSize: 10, padding: '3px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, color: 'rgba(255,255,255,0.5)' }}>{s}</span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#63d2ff', fontWeight: 600 }}>Find a Host →</div>
            </div>
          </div>

          {/* SAVED TRIPS */}
          {savedTrips.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700 }}>💾 Saved Trips</h2>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>Your recent itineraries</p>
                </div>
                <button onClick={() => nav('/saved')} style={{ fontSize: 11, color: '#63d2ff', background: 'rgba(99,210,255,0.08)', border: '1px solid rgba(99,210,255,0.2)', padding: '6px 16px', borderRadius: 100, cursor: 'pointer', fontWeight: 600 }}>View All →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                {savedTrips.map((trip: any) => (
                  <div key={trip.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,210,255,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                    onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ position: 'relative', height: 100, overflow: 'hidden' }}>
                      <img src={trip.img} alt={trip.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(2,8,16,0.9) 0%,transparent 50%)' }} />
                      <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9.5, padding: '2px 8px', background: trip.budget === 'low' ? 'rgba(76,255,145,0.18)' : trip.budget === 'mid' ? 'rgba(99,210,255,0.18)' : 'rgba(255,183,77,0.18)', borderRadius: 100, color: trip.budget === 'low' ? '#4cff91' : trip.budget === 'mid' ? '#63d2ff' : '#ffb74d', fontWeight: 700 }}>
                        {trip.budget === 'low' ? 'Budget' : trip.budget === 'mid' ? 'Comfort' : 'Luxury'}
                      </div>
                      <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 16 }}>{trip.flag}</span>
                        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700 }}>{trip.destination}</span>
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 900, color: '#ffb74d' }}>₹{trip.totalCost?.toLocaleString() || 'N/A'}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>📅 {trip.days}d · 👥 {trip.travelers}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 7 }}>
                        <button onClick={() => nav('/itinerary')} style={{ flex: 1, padding: '7px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.25)', color: '#63d2ff', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>✏️ Re-Plan</button>
                        <button onClick={() => deleteSavedTrip(trip.id)} style={{ padding: '7px 12px', background: 'rgba(255,59,48,0.07)', border: '1px solid rgba(255,59,48,0.2)', color: 'rgba(255,100,100,0.65)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
                <div onClick={() => nav('/itinerary')} style={{ background: 'rgba(255,183,77,0.04)', border: '1px dashed rgba(255,183,77,0.25)', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', minHeight: 200, transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,183,77,0.1)'; e.currentTarget.style.border = '1px dashed rgba(255,183,77,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,183,77,0.04)'; e.currentTarget.style.border = '1px dashed rgba(255,183,77,0.25)' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,183,77,0.12)', border: '1px solid rgba(255,183,77,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>+</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,183,77,0.7)', fontWeight: 600 }}>Plan a New Trip</div>
                </div>
              </div>
            </div>
          )}

          {/* ALL FEATURES GRID */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.08)', borderRadius: 18, padding: 18, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>All Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {[
                { icon: '🤖', title: 'AI Itinerary', desc: '100+ destinations', path: '/itinerary', color: '#63d2ff' },
                { icon: '✈️', title: 'Flights', desc: 'All airlines', path: '/flights', color: '#ffb74d' },
                { icon: '🏨', title: 'Hotels', desc: '50+ options', path: '/hotels', color: '#63d2ff' },
                { icon: '🍽️', title: 'Restaurants', desc: 'AI picks', path: '/restaurants', color: '#ffb74d' },
                { icon: '🛂', title: 'Visa Guide', desc: 'Embassy & docs', path: '/visa', color: '#63d2ff' },
                { icon: '💱', title: 'Currency', desc: 'Live rates', path: '/currency', color: '#ffb74d' },
                { icon: '🌤️', title: 'Weather+AQI', desc: '7-day forecast', path: '/weather', color: '#63d2ff' },
                { icon: '🏅', title: 'Passport', desc: 'Earn badges', path: '/passport', color: '#ffb74d' },
                { icon: '🤝', title: 'Couch Surf', desc: 'Stay local', path: '/couchsurfing', color: '#63d2ff' },
                { icon: '👨‍💼', title: 'Local Guides', desc: 'Expert guides', path: '/guides', color: '#ffb74d' },
                { icon: '🧠', title: 'Travel IQ', desc: 'Learn & explore', path: '/traveliq', color: '#63d2ff' },
                { icon: '💬', title: 'AI Chat', desc: '24/7 assistant', path: '/chat', color: '#ffb74d' },
              ].map((f, i) => (
                <button key={i} onClick={() => nav(f.path)} style={{ padding: '14px 12px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.22s', display: 'flex', flexDirection: 'column', gap: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${f.color}0c`; e.currentTarget.style.border = `1px solid ${f.color}25`; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${f.color}12`, border: `1px solid ${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.32)' }}>{f.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI BOT */}
      <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 1000 }}>
        {botOpen && (
          <div style={{ position: 'absolute', bottom: 68, right: 0, width: 360, height: 490, background: '#05090f', border: '1px solid rgba(99,210,255,0.2)', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.65)' }}>
            <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg,rgba(99,210,255,0.1),rgba(255,183,77,0.07))', borderBottom: '1px solid rgba(99,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌍</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Roamind AI</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Online</div>
                </div>
              </div>
              <button onClick={() => setBotOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {botMessages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 7 }}>
                  {m.role === 'bot' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌍</div>}
                  <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'linear-gradient(135deg,#ffb74d,#ff8f00)' : 'rgba(255,255,255,0.055)', fontSize: 12.5, color: m.role === 'user' ? '#000814' : 'rgba(255,255,255,0.82)' }}>{m.text}</div>
                </div>
              ))}
              {botLoading && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center' }}>🌍</div>
                  <div style={{ padding: '9px 13px', background: 'rgba(255,255,255,0.055)', borderRadius: '14px 14px 14px 3px', display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#63d2ff' }} />)}
                  </div>
                </div>
              )}
              <div ref={botEndRef} />
            </div>
            <div style={{ padding: '8px 12px 12px' }}>
              <div style={{ display: 'flex', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 11, padding: '5px 5px 5px 12px', alignItems: 'center' }}>
                <input value={botInput} onChange={e => setBotInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendBot()} placeholder="Ask about travel..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 12.5 }} />
                <button onClick={sendBot} disabled={botLoading || !botInput.trim()} style={{ width: 30, height: 30, borderRadius: 7, background: botInput.trim() ? 'linear-gradient(135deg,#63d2ff,#3bb8e8)' : 'rgba(255,255,255,0.05)', border: 'none', cursor: botInput.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setBotOpen(!botOpen)} style={{ width: 54, height: 54, borderRadius: '50%', background: botOpen ? 'rgba(99,210,255,0.12)' : 'linear-gradient(135deg,#63d2ff,#3bb8e8)', border: botOpen ? '1px solid rgba(99,210,255,0.3)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 6px 28px rgba(99,210,255,0.28)' }}>
          {botOpen ? '✕' : '🌍'}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
