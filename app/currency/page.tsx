'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Sidebar from '@/components/Sidebar'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const GR = '#51cf66'
const BG = '#000814'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

interface CurrencyInfo {
  code: string
  name: string
  emoji: string
  symbol: string
  flag: string
  country: string
  rate: number
  denominations: string[]
  history: string
  facts: string[]
  tags: string[]
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'INR', name: 'Indian Rupee', emoji: '🇮🇳', symbol: '₹', flag: '🇮🇳', country: 'India', rate: 1, history: 'The Indian Rupee has been the official currency of India since 1540. The symbol ₹ was introduced in 2010. India abolished the Paise system in 2011. The currency features the Mahatma Gandhi series of banknotes since 1996.', facts: ['Fourth most traded currency in Asia', 'Symbol introduced in 2010', 'Mahatma Gandhi on all notes', 'Plastic notes introduced for ₹10'], tags: ['Popular', 'Stable', 'Rupee'], denominations: ['₹10', '₹20', '₹50', '₹100', '₹200', '₹500', '₹2000'] },
  { code: 'USD', name: 'US Dollar', emoji: '🇺🇸', symbol: '$', flag: '🇺🇸', country: 'United States', rate: 0.012, history: 'The US Dollar was established in 1792 under the Coinage Act. It became the world reserve currency after WWII at Bretton Woods. The greenback is the most widely used currency for international trade.', facts: ['World reserve currency', 'Bretton Woods 1944', 'Federal Reserve since 1913', 'Green colored notes'], tags: ['World Reserve', 'Stable', 'Widely Accepted'], denominations: ['$1', '$2', '$5', '$10', '$20', '$50', '$100'] },
  { code: 'EUR', name: 'Euro', emoji: '🇪🇺', symbol: '€', flag: '🇪🇺', country: 'Eurozone', rate: 0.011, history: 'The Euro was launched in 1999 as a virtual currency and physical notes in 2002. It replaced 19 European countries national currencies. The ECB manages monetary policy for the Eurozone.', facts: ['Second most traded currency', '19 countries use it', 'Notes designed by Robert Kalina', 'Max denomination is €500'], tags: ['Eurozone', 'Stable', 'Popular'], denominations: ['€5', '€10', '€20', '€50', '€100', '€200', '€500'] },
  { code: 'GBP', name: 'British Pound', emoji: '🇬🇧', symbol: '£', flag: '🇬🇧', country: 'United Kingdom', rate: 0.0094, history: 'The Pound Sterling is the oldest currency still in use. It was introduced after the Norman Conquest in 1066. The symbol £ comes from the Latin word Libra.', facts: ['Oldest currency in the world', 'Called Sterling', 'Queen Elizabeth on all notes', 'Decimalized in 1971'], tags: ['Historic', 'Stable', 'Strong'], denominations: ['£5', '£10', '£20', '£50', '£100'] },
  { code: 'JPY', name: 'Japanese Yen', emoji: '🇯🇵', symbol: '¥', flag: '🇯🇵', country: 'Japan', rate: 1.78, history: 'The Yen was introduced in 1871 during the Meiji Restoration. It replaced the complex feudal currency system. The Bank of Japan was established in 1882.', facts: ['Zero inflation currency', '1000 yen worth about $7', 'Featured on all notes', 'Coin system since 1955'], tags: ['Stable', 'Asian Trade', 'Safe Haven'], denominations: ['¥1000', '¥2000', '¥5000', '¥10000'] },
  { code: 'THB', name: 'Thai Baht', emoji: '🇹🇭', symbol: '฿', flag: '🇹🇭', country: 'Thailand', rate: 0.42, history: 'The Baht was introduced in 1928, replacing the Tical. Thailand never colonized, keeping its currency unique. King Bhumibol appears on some Thai currency.', facts: ['Strong tourism currency', 'Gold content standard (1893-1902)', 'King Bhumibol on notes', 'One of most stable Asian currencies'], tags: ['Tourism', 'Popular', 'Stable'], denominations: ['฿20', '฿50', '฿100', '฿500', '฿1000'] },
  { code: 'AED', name: 'UAE Dirham', emoji: '🇦🇪', symbol: 'د.إ', flag: '🇦🇪', country: 'UAE', rate: 0.044, history: 'The Dirham was introduced in 1973 when the UAE was formed. It is pegged to the US Dollar at 3.67 AED = 1 USD. The currency features various UAE landmarks.', facts: ['Pegged to USD', '100 Fils = 1 Dirham', 'No income tax in UAE', 'Popular for expats'], tags: ['Pegged', 'Stable', 'Expat'], denominations: ['د.إ5', 'د.إ10', 'د.إ20', 'د.إ50', 'د.إ100', 'د.إ200', 'د.إ500', 'د.إ1000'] },
  { code: 'SGD', name: 'Singapore Dollar', emoji: '🇸🇬', symbol: 'S$', flag: '🇸🇬', country: 'Singapore', rate: 0.016, history: 'The Singapore Dollar was introduced in 1967 after independence. The Monetary Authority of Singapore manages the currency. It is known for its polymer notes introduced in 1999.', facts: ['Polymer notes since 1999', 'Known as Sing dollar', 'No capital gains tax', 'Strong financial hub'], tags: ['Stable', 'Polymer', 'Financial Hub'], denominations: ['S$2', 'S$5', 'S$10', 'S$20', 'S$50', 'S$100', 'S$1000'] },
  { code: 'MYR', name: 'Malaysian Ringgit', emoji: '🇲🇾', symbol: 'RM', flag: '🇲🇾', country: 'Malaysia', rate: 0.056, history: 'The Ringgit was introduced in 1967 after Malaysia formed. The name means jagged in Malay, referring to the serrated edges of Spanish dollars used historically.', facts: ['Known as Ringgit', 'Islam on many notes', 'Tourism favorite', '100 Sen = 1 Ringgit'], tags: ['Tourism', 'Southeast Asia', 'Popular'], denominations: ['RM1', 'RM5', 'RM10', 'RM20', 'RM50', 'RM100'] },
  { code: 'AUD', name: 'Australian Dollar', emoji: '🇦🇺', symbol: 'A$', flag: '🇦🇺', country: 'Australia', rate: 0.018, history: 'The Australian Dollar replaced the Pound in 1966. Australia was among first to polymer banknotes. The currency features famous Australians and native wildlife.', facts: ['Polymer notes since 1988', 'No decimal point system', 'Features native wildlife', 'Tender interest rates high'], tags: ['Polymer', 'Wildlife', 'Popular'], denominations: ['A$5', 'A$10', 'A$20', 'A$50', 'A$100'] },
  { code: 'CAD', name: 'Canadian Dollar', emoji: '🇨🇦', symbol: 'C$', flag: '🇨🇦', country: 'Canada', rate: 0.016, history: 'The Canadian Dollar was introduced in 1858. Known as the Loonie due to the common loon on the $1 coin. Canada was first to introduce polymer banknotes in 1996.', facts: ['Loonie and Toonie coins', 'Polymer notes since 1996', 'Close to USD parity', 'Bilingual notes'], tags: ['Stable', 'Polymer', 'North America'], denominations: ['C$5', 'C$10', 'C$20', 'C$50', 'C$100'] },
  { code: 'IDR', name: 'Indonesian Rupiah', emoji: '🇮🇩', symbol: 'Rp', flag: '🇮🇩', country: 'Indonesia', rate: 188, history: 'The Rupiah was introduced in 1945 after independence from Netherlands. Indonesia suffered severe inflation in 1960s, requiring currency revaluations.', facts: ['Highest value note: Rp100,000', 'Many zeros due to inflation', 'Garuda on notes', 'Tourism paradise currency'], tags: ['High Volume', 'Tourism', 'Emerging'], denominations: ['Rp1,000', 'Rp2,000', 'Rp5,000', 'Rp10,000', 'Rp20,000', 'Rp50,000', 'Rp100,000'] },
  { code: 'VND', name: 'Vietnamese Dong', emoji: '🇻🇳', symbol: '₫', flag: '🇻🇳', country: 'Vietnam', rate: 297, history: 'The Dong was reintroduced in 1978 after reunification. Vietnam underwent currency reform in 1985. The country is moving toward economic stability.', facts: ['Highest: ₫500,000', 'Many revaluations history', 'Ho Chi Minh on notes', 'Growing economy'], tags: ['High Volume', 'Emerging', 'Culture'], denominations: ['₫1,000', '₫2,000', '₫5,000', '₫10,000', '₫20,000', '₫50,000', '₫100,000', '₫500,000'] },
  { code: 'LKR', name: 'Sri Lankan Rupee', emoji: '🇱🇰', symbol: 'Rs', flag: '🇱🇰', country: 'Sri Lanka', rate: 4.01, history: 'The Sri Lankan Rupee was introduced in 1872 during British colonial rule. The currency features Buddhist symbols and Sri Lankan wildlife.', facts: ['Buddhist heritage', '10th oldest currency', 'Tea on some notes', 'Wildlife featured'], tags: ['Historic', 'Culture', 'Tea'], denominations: ['Rs10', 'Rs20', 'Rs50', 'Rs100', 'Rs500', 'Rs1000', 'Rs5000'] },
]

interface ExchangeSpot {
  id: number
  name: string
  type: 'bank' | 'forex' | 'atm' | 'app'
  rating: number
  address: string
  city: string
  mapsUrl: string
  lat: number
  lng: number
  rate: string
  fee: string
  badge: 'good' | 'warn' | 'bad'
  description: string
  openHours: string
  distance?: number
}

const UNIVERSAL_SPOTS: Omit<ExchangeSpot, 'distance'>[] = [
  { id: 1, name: 'Currency Exchange Center', type: 'forex', rating: 4.2, address: '123 Main Street', city: 'Downtown', mapsUrl: 'https://maps.google.com/?q=place', lat: 0, lng: 0, rate: 'Market Rate', fee: '0%', badge: 'good', description: 'Professional currency exchange with competitive rates', openHours: '9AM - 6PM' },
  { id: 2, name: 'Airport Exchange Bureau', type: 'forex', rating: 3.5, address: 'Terminal 1 Arrivals', city: 'Airport', mapsUrl: 'https://maps.google.com/?q=airport', lat: 0, lng: 0, rate: 'Standard Rate', fee: '2%', badge: 'warn', description: 'Convenient location but higher fees', openHours: '24/7' },
  { id: 3, name: 'National Bank ATM', type: 'atm', rating: 4.0, address: '456 Financial District', city: 'Business Center', mapsUrl: 'https://maps.google.com/?q=bank', lat: 0, lng: 0, rate: 'Live Rate', fee: '1%', badge: 'good', description: 'ATM with live exchange rates and daily limits', openHours: '24/7' },
  { id: 4, name: 'International Money Transfer App', type: 'app', rating: 4.5, address: 'Online Only', city: 'Digital', mapsUrl: 'https://maps.google.com/?q=online', lat: 0, lng: 0, rate: 'Best Rate', fee: '0.5%', badge: 'good', description: 'Transfer money globally with lowest fees', openHours: '24/7 Online' },
  { id: 5, name: 'Travelex Forex', type: 'forex', rating: 3.8, address: '789 Tourist Area', city: 'City Center', mapsUrl: 'https://maps.google.com/?q=travelex', lat: 0, lng: 0, rate: 'Tourist Rate', fee: '1.5%', badge: 'warn', description: 'Well known brand with reliable service', openHours: '10AM - 8PM' },
]

const TIPS = [
  { icon: '💳', title: 'Use Travel Cards', desc: 'Wise, Revolut, and N26 offer near-perfect exchange rates with minimal fees. Great for everyday spending abroad.' },
  { icon: '🏦', title: 'Avoid Airport Exchange', desc: 'Airport bureaus have the worst rates due to captive market. Always exchange at city banks or use ATMs instead.' },
  { icon: '💰', title: 'Know Local Costs', desc: 'Research daily costs like coffee, meals, and transport to gauge if you are getting a fair rate.' },
  { icon: '🔄', title: 'Monitor Rates', desc: 'Set price alerts on apps like XE or use Google Finance. Exchange when rates are favorable.' },
  { icon: '📱', title: 'Digital Wallets', desc: 'Apple Pay and Google Pay often use excellent interbank rates. Check if your card has no foreign transaction fees.' },
  { icon: '🧾', title: 'Keep Receipts', desc: 'Save all exchange receipts for tax refunds and proof if you need to exchange currency back.' },
  { icon: '🏪', title: 'Compare Before Exchange', desc: 'Visit 3-4 places to compare rates. Even 1% difference means Rs.1000 on Rs.1 lakh exchange.' },
  { icon: '⏰', title: 'Timing Matters', desc: 'Exchange rates vary by time of day. Asian markets open different from European and US sessions.' },
  { icon: '🚫', title: 'Avoid Dynamic Currency Conversion', desc: 'Always pay in local currency when given the choice. DCC always gives worse rates.' },
  { icon: '💵', title: 'Carry Small Bills', desc: 'Have $20 or smaller denominations ready. Some places charge extra for large notes.' },
]

const MONEY_TIPS = [
  { icon: '🏆', title: 'Best Time to Exchange', tip: 'Tuesday-Thursday mornings typically have best rates. Mondays are volatile from weekend gaps.' },
  { icon: '🎯', title: 'Negotiate Rates', tip: 'For amounts over $5000 equivalent, you can often negotiate 0.2-0.5% better rates.' },
  { icon: '🌐', title: 'Online First', tip: 'Book currency online and pick up in store for bonus loyalty points and discounts.' },
  { icon: '⚖️', title: 'Spread Your Exchanges', tip: 'Exchange 50% now, 25% mid-trip, 25% near end to minimize risk from rate fluctuations.' },
  { icon: '🔒', title: 'Secure Your Money', tip: 'Use hotel safes for bulk cash. Carry only 1-2 days worth locally.' },
  { icon: '📊', title: 'Check Performance', tip: 'Look at yearly charts. Avoid exchanging at peaks; wait for dips in your favor.' },
]

const COST_OF_LIVING: { [key: string]: { daily: number; label: string; color: string } } = {
  'INR': { daily: 1500, label: 'Budget', color: '#51cf66' },
  'THB': { daily: 1500, label: 'Budget', color: '#51cf66' },
  'VND': { daily: 500000, label: 'Budget', color: '#51cf66' },
  'IDR': { daily: 200000, label: 'Budget', color: '#51cf66' },
  'MXN': { daily: 800, label: 'Mid-Range', color: '#ffb74d' },
  'ZAR': { daily: 400, label: 'Mid-Range', color: '#ffb74d' },
  'BRL': { daily: 300, label: 'Mid-Range', color: '#ffb74d' },
  'MYR': { daily: 150, label: 'Mid-Range', color: '#ffb74d' },
  'USD': { daily: 150, label: 'Expensive', color: '#ff6b6b' },
  'EUR': { daily: 120, label: 'Expensive', color: '#ff6b6b' },
  'GBP': { daily: 130, label: 'Expensive', color: '#ff6b6b' },
  'JPY': { daily: 12000, label: 'Expensive', color: '#ff6b6b' },
  'CHF': { daily: 150, label: 'Very Expensive', color: '#e91e63' },
  'AUD': { daily: 180, label: 'Expensive', color: '#ff6b6b' },
  'CAD': { daily: 150, label: 'Expensive', color: '#ff6b6b' },
  'SGD': { daily: 100, label: 'Expensive', color: '#ff6b6b' },
  'AED': { daily: 300, label: 'Mid-Range', color: '#ffb74d' },
}

const CHAT_QUICK_QUESTIONS = [
  'Is it better to exchange in India or at destination?',
  'What documents do I need to exchange currency abroad?',
  'How much cash should I carry for 7 days?',
]

interface RateAlert {
  targetRate: number
  email: string
  currencyPair: string
  createdAt: Date
}

interface ChatMessage {
  role: 'user' | 'bot'
  text: string
  time: Date
}

export default function Currency() {
  const router = useRouter()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/currency')
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('INR')
  const [toCurrency, setToCurrency] = useState('USD')
  const [liveRate, setLiveRate] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [exchangeSpots, setExchangeSpots] = useState<ExchangeSpot[]>([])
  const [spotFilter, setSpotFilter] = useState<'all' | 'bank' | 'forex' | 'atm' | 'app'>('all')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'default' | 'success'>('default')
  const [activeSection, setActiveSection] = useState<'converter' | 'spots' | 'all'>('converter')
  
  // NEW: Budget Planner
  const [showBudget, setShowBudget] = useState(false)
  const [tripDays, setTripDays] = useState('7')
  const [dailyBudget, setDailyBudget] = useState('50')
  const [foodPercent, setFoodPercent] = useState(30)
  const [transportPercent, setTransportPercent] = useState(20)
  const [accomPercent, setAccomPercent] = useState(30)
  const [shoppingPercent, setShoppingPercent] = useState(10)
  const [activitiesPercent, setActivitiesPercent] = useState(10)
  
  // NEW: Rate Alert
  const [showRateAlert, setShowRateAlert] = useState(false)
  const [rateAlertTarget, setRateAlertTarget] = useState('')
  const [rateAlertEmail, setRateAlertEmail] = useState('')
  const [activeAlert, setActiveAlert] = useState<RateAlert | null>(null)
  const [alertTriggered, setAlertTriggered] = useState(false)
  
  // NEW: AI Chat
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hello! I am your Currency Assistant. I can help with exchange rates, travel money tips, and currency-related questions.', time: new Date() }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  useEffect(() => {
    const savedAlert = localStorage.getItem('roamind_rate_alert')
    if (savedAlert) {
      const parsed = JSON.parse(savedAlert)
      if (parsed.currencyPair === `${fromCurrency}-${toCurrency}`) {
        setActiveAlert(parsed)
        setRateAlertTarget(String(parsed.targetRate))
      }
    }
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/' + fromCurrency)
        const data = await res.json()
        if (data.rates && data.rates[toCurrency]) {
          const newRate = data.rates[toCurrency]
          setLiveRate(newRate)
          setLastUpdated(new Date())
          
          if (activeAlert && !alertTriggered) {
            const isReached = fromCurrency < toCurrency 
              ? newRate >= activeAlert.targetRate 
              : newRate <= activeAlert.targetRate
            if (isReached) {
              setAlertTriggered(true)
              showToastMsg('Target rate reached! ' + fromCurrency + '/' + toCurrency + ' hit ' + newRate.toFixed(4), 'success')
              if (Notification.permission === 'granted') {
                new Notification('Rate Alert!', { body: fromCurrency + '/' + toCurrency + ' reached ' + newRate.toFixed(4) })
              }
            }
          }
        }
      } catch {
        const curr = CURRENCIES.find(c => c.code === toCurrency)
        setLiveRate(curr?.rate || null)
      }
    }
    fetchRates()
    const interval = setInterval(fetchRates, 60000)
    return () => clearInterval(interval)
  }, [toCurrency, fromCurrency, activeAlert, alertTriggered])

  useEffect(() => {
    const spots = UNIVERSAL_SPOTS.map(s => ({
      ...s,
      distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, s.lat, s.lng) : undefined
    })).sort((a, b) => (a.distance || 999) - (b.distance || 999))
    setExchangeSpots(spots)
  }, [userLocation])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10
  }

  const fromCurr = CURRENCIES.find(c => c.code === fromCurrency)
  const toCurr = CURRENCIES.find(c => c.code === toCurrency)
  const currentRate = liveRate || toCurr?.rate || 1
  const convertedAmount = (parseFloat(amount || '0') / (fromCurr?.rate || 1)) * currentRate

  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const handleLogout = async () => { const { signOut } = await import('firebase/auth'); await signOut(auth); router.push('/landing') }

  const showToastMsg = (msg: string, type: 'default' | 'success' = 'default') => {
    setToastMessage(msg)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  const openMaps = (spot: ExchangeSpot) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat || 0},${userLocation?.lng || 0}&destination=${spot.lat},${spot.lng}&travelmode=driving`
    window.open(url, '_blank')
  }

  const saveRateAlert = () => {
    if (!rateAlertTarget || !rateAlertEmail) return
    const alert: RateAlert = {
      targetRate: parseFloat(rateAlertTarget),
      email: rateAlertEmail,
      currencyPair: `${fromCurrency}-${toCurrency}`,
      createdAt: new Date()
    }
    localStorage.setItem('roamind_rate_alert', JSON.stringify(alert))
    setActiveAlert(alert)
    setAlertTriggered(false)
    setShowRateAlert(false)
    showToastMsg('Rate alert saved for ' + fromCurrency + '/' + toCurrency)
  }

  const removeRateAlert = () => {
    localStorage.removeItem('roamind_rate_alert')
    setActiveAlert(null)
    setRateAlertTarget('')
    setRateAlertEmail('')
    setAlertTriggered(false)
    showToastMsg('Rate alert removed')
  }

  const sendChatMessage = async (msg: string) => {
    if (!msg.trim() || chatLoading) return
    const userMsg = msg.trim()
    setChatMessages(p => [...p, { role: 'user', text: userMsg, time: new Date() }])
    setChatInput('')
    setChatLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'anthropic-api-key', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are Roamind Currency Assistant. Context: Converting ${fromCurrency} to ${toCurrency}. Current rate: 1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency}. Destination country: ${toCurr?.country || 'Unknown'}. Answer concisely about currency exchange, travel money tips, or budget advice. Question: ${userMsg}`
          }]
        })
      })
      const d = await res.json()
      setChatMessages(p => [...p, { role: 'bot', text: d.content?.[0]?.text || 'I need more context. Try asking about exchange rates or travel money tips!', time: new Date() }])
    } catch {
      setChatMessages(p => [...p, { role: 'bot', text: 'Connection issue! Please try again.', time: new Date() }])
    }
    setChatLoading(false)
  }

  const totalBudget = parseFloat(tripDays) * parseFloat(dailyBudget)
  const dailyInLocal = totalBudget / parseFloat(tripDays) * currentRate
  const totalInLocal = totalBudget * currentRate
  const costInfo = COST_OF_LIVING[toCurrency] || COST_OF_LIVING['INR']
  const budgetWarning = dailyInLocal < costInfo.daily

  useEffect(() => {
    if (typeof window !== 'undefined' && chartRef.current && activeSection === 'converter' && toCurr) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'
      script.async = true
      script.onload = () => {
        if (chartInstance.current) chartInstance.current.destroy()
        const ctx = chartRef.current?.getContext('2d')
        if (ctx && (window as any).Chart) {
          const baseRate = currentRate
          const labels = Array.from({ length: 30 }, (_, i) => `Day ${30 - i}`)
          const data = Array.from({ length: 30 }, (_, i) => {
            const variance = (Math.random() - 0.5) * 0.02 * baseRate
            return baseRate + variance
          })
          
          chartInstance.current = new (window as any).Chart(ctx, {
            type: 'line',
            data: {
              labels,
              datasets: [{
                data,
                borderColor: '#ffb74d',
                backgroundColor: 'rgba(255,183,77,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { display: false },
                y: { display: false }
              }
            }
          })
        }
      }
      document.body.appendChild(script)
    }
  }, [activeSection, toCurrency, currentRate])

  const chartHigh = currentRate * 1.02
  const chartLow = currentRate * 0.98
  const chartAvg = currentRate

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '2px solid rgba(99,210,255,0.15)', borderTopColor: C, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()
  const filteredSpots = spotFilter === 'all' ? exchangeSpots : exchangeSpots.filter(s => s.type === spotFilter)

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'good': return { bg: 'rgba(81,207,102,0.1)', border: 'rgba(81,207,102,0.3)', text: '#51cf66' }
      case 'warn': return { bg: 'rgba(255,183,77,0.1)', border: 'rgba(255,183,77,0.3)', text: '#ffb74d' }
      case 'bad': return { bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.3)', text: '#ff6b6b' }
      default: return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#fff' }
    }
  }

  const adjustSlider = (category: string, value: number) => {
    const total = foodPercent + transportPercent + accomPercent + shoppingPercent + activitiesPercent
    if (total === 100) return
    const diff = 100 - total
    switch (category) {
      case 'food': setFoodPercent(value); break
      case 'transport': setTransportPercent(value); break
      case 'accom': setAccomPercent(value); break
      case 'shopping': setShoppingPercent(value); break
      case 'activities': setActivitiesPercent(value); break
    }
  }

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
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>💱 Currency Exchange</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)' }}>
                {lastUpdated ? `Live rates • Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading rates...'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {liveRate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(81,207,102,0.1)', border: '1px solid rgba(81,207,102,0.25)', borderRadius: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#51cf66', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 10, color: '#51cf66' }}>LIVE</span>
              </div>
            )}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', cursor: 'pointer', flexShrink: 0 }}>{avatar}</div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* SECTION TABS */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <button onClick={() => setActiveSection('converter')} style={{ padding: '10px 24px', background: activeSection === 'converter' ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeSection === 'converter' ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeSection === 'converter' ? C : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              💱 Converter
            </button>
            <button onClick={() => setActiveSection('spots')} style={{ padding: '10px 24px', background: activeSection === 'spots' ? 'rgba(81,207,102,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeSection === 'spots' ? '#51cf66' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeSection === 'spots' ? '#51cf66' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              📍 Exchange Spots
            </button>
            <button onClick={() => setActiveSection('all')} style={{ padding: '10px 24px', background: activeSection === 'all' ? 'rgba(255,183,77,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeSection === 'all' ? G : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: activeSection === 'all' ? G : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              📊 All Rates
            </button>
          </div>

          {/* SECTION 1: CONVERTER */}
          {activeSection === 'converter' && (
            <>
              {/* MAIN CONVERTER */}
              <div style={{ background: 'linear-gradient(135deg,rgba(99,210,255,0.08) 0%,rgba(255,183,77,0.05) 100%)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, marginBottom: 20, textAlign: 'center', background: `linear-gradient(130deg, #fff, ${C})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>💱 Currency Converter</h2>
                
                {/* AMOUNT INPUT */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Amount</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 18, fontWeight: 700, outline: 'none' }} />
                </div>

                {/* FROM/TO SELECTORS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto 1fr', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                  {/* FROM */}
                  <div>
                    <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>From</label>
                    <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 14, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                      {CURRENCIES.map(c => <option key={c.code} value={c.code} style={{ background: '#05090f' }}>{c.emoji} {c.code} - {c.name}</option>)}
                    </select>
                  </div>

                  {/* BUTTONS */}
                  <div style={{ display: 'flex', gap: 8, paddingTop: 24 }}>
                    {/* RATE ALERT BUTTON */}
                    <div style={{ position: 'relative' }}>
                      <button onClick={() => setShowRateAlert(!showRateAlert)} style={{ width: 40, height: 40, background: activeAlert ? 'linear-gradient(135deg,#51cf66,#45a049)' : 'rgba(255,255,255,0.05)', border: `1px solid ${activeAlert ? '#51cf66' : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: activeAlert ? '#fff' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        🔔
                      </button>
                      {showRateAlert && (
                        <div style={{ position: 'absolute', top: 48, right: 0, width: 280, background: '#05090f', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 12, padding: 16, zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: G }}>Set Rate Alert</div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Target Rate</label>
                            <input type="number" value={rateAlertTarget} onChange={e => setRateAlertTarget(e.target.value)} placeholder={currentRate.toFixed(4)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>Email (optional)</label>
                            <input type="email" value={rateAlertEmail} onChange={e => setRateAlertEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none' }} />
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={saveRateAlert} style={{ flex: 1, padding: '8px 12px', background: G, border: 'none', borderRadius: 8, color: '#000814', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save Alert</button>
                            {activeAlert && <button onClick={removeRateAlert} style={{ padding: '8px 12px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, color: '#ff6b6b', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SWAP BUTTON */}
                    <button onClick={() => { const temp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(temp) }} style={{ width: 40, height: 40, background: `linear-gradient(135deg,${C},#3bb8e8)`, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#000814', cursor: 'pointer', transition: 'all 0.2s' }}>
                      ⇄
                    </button>
                  </div>

                  {/* TO */}
                  <div>
                    <label style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>To</label>
                    <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 14, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                      {CURRENCIES.map(c => <option key={c.code} value={c.code} style={{ background: '#05090f' }}>{c.emoji} {c.code} - {c.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* RESULT */}
                <div style={{ background: `linear-gradient(135deg,${G}15,${G}05)`, border: `1px solid ${G}30`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                    {fromCurr?.emoji} {parseFloat(amount || '0').toLocaleString()} {fromCurrency} =
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: G, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
                    {toCurr?.symbol}{convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                  </div>
                  <div style={{ fontSize: 12, color: C }}>
                    1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
                    {liveRate && <span style={{ marginLeft: 8, color: '#51cf66' }}>● Live Rate</span>}
                  </div>
                </div>

                {/* QUICK AMOUNTS */}
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {[100, 500, 1000, 5000, 10000].map(amt => (
                    <button key={amt} onClick={() => setAmount(String(amt))} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.1)'; e.currentTarget.style.borderColor = C }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* NEW: BUDGET PLANNER */}
              <div style={{ background: `linear-gradient(135deg,${G}08 0%,${G}03 100%)`, border: `1px solid ${G}30`, borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: showBudget ? 16 : 0 }} onClick={() => setShowBudget(!showBudget)}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, margin: 0 }}>📊 Trip Budget Planner</h2>
                  <span style={{ fontSize: 20, color: G }}>{showBudget ? '▲' : '▼'}</span>
                </div>

                {showBudget && (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
                      <div>
                        <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Trip Duration (days)</label>
                        <input type="number" value={tripDays} onChange={e => setTripDays(e.target.value)} min="1" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${G}30`, borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 16, fontWeight: 700, outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Daily Budget ({fromCurrency})</label>
                        <input type="number" value={dailyBudget} onChange={e => setDailyBudget(e.target.value)} min="1" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${G}30`, borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 16, fontWeight: 700, outline: 'none' }} />
                      </div>
                    </div>

                    {/* SLIDERS */}
                    <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
                      {[
                        { label: 'Food & Dining', value: foodPercent, set: setFoodPercent, color: '#ff6b6b' },
                        { label: 'Transport', value: transportPercent, set: setTransportPercent, color: '#63d2ff' },
                        { label: 'Accommodation', value: accomPercent, set: setAccomPercent, color: '#9c27b0' },
                        { label: 'Shopping', value: shoppingPercent, set: setShoppingPercent, color: '#ffb74d' },
                        { label: 'Activities', value: activitiesPercent, set: setActivitiesPercent, color: '#51cf66' },
                      ].map(cat => (
                        <div key={cat.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{cat.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.value}%</span>
                          </div>
                          <input type="range" min="0" max="100" value={cat.value} onChange={e => cat.set(Number(e.target.value))} style={{ width: '100%', accentColor: cat.color }} />
                        </div>
                      ))}
                    </div>

                    {/* SUMMARY */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${G}20`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Total Budget</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: G }}>{fromCurr?.symbol}{totalBudget.toLocaleString()}</div>
                          <div style={{ fontSize: 11, color: C }}>{fromCurrency}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>In Local Currency</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: C }}>{toCurr?.symbol}{totalInLocal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{toCurrency}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Daily Allowance</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: '#9c27b0' }}>{toCurr?.symbol}{dailyInLocal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{toCurrency}/day</div>
                        </div>
                      </div>
                    </div>

                    {/* WARNING */}
                    {budgetWarning && (
                      <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>⚠️</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#ff6b6b' }}>Budget May Be Low</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Average daily cost in {toCurr?.country} is around {toCurr?.symbol}{costInfo.daily.toLocaleString()} ({costInfo.label})</div>
                        </div>
                      </div>
                    )}

                    {/* BREAKDOWN */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                      {[
                        { label: 'Food', value: foodPercent, color: '#ff6b6b' },
                        { label: 'Transport', value: transportPercent, color: '#63d2ff' },
                        { label: 'Stay', value: accomPercent, color: '#9c27b0' },
                        { label: 'Shop', value: shoppingPercent, color: '#ffb74d' },
                        { label: 'Fun', value: activitiesPercent, color: '#51cf66' },
                      ].map(item => (
                        <div key={item.label} style={{ padding: '4px 10px', background: `${item.color}15`, border: `1px solid ${item.color}40`, borderRadius: 8 }}>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{item.label}:</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: item.color, marginLeft: 4 }}>{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CURRENCY INFO PANEL */}
              {toCurr && (
                <div style={{ background: 'linear-gradient(135deg,rgba(156,39,176,0.08) 0%,rgba(99,210,255,0.05) 100%)', border: '1px solid rgba(156,39,176,0.15)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <span style={{ fontSize: 64 }}>{toCurr.emoji}</span>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Playfair Display',serif" }}>{toCurr.name}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{toCurr.country}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                        {toCurr.tags.map((tag, i) => (
                          <span key={i} style={{ fontSize: 10, padding: '3px 10px', background: `${C}15`, border: `1px solid ${C}30`, borderRadius: 100, color: C }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DENOMINATIONS */}
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: G }}>💵 Banknote Denominations</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {toCurr.denominations.map((d, i) => (
                        <div key={i} style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{d}</div>
                      ))}
                    </div>
                  </div>

                  {/* NEW: HISTORICAL CHART */}
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: G }}>📈 30-Day Rate History</h3>
                    
                    {/* STATS */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      <div style={{ padding: '6px 12px', background: 'rgba(81,207,102,0.1)', border: '1px solid rgba(81,207,102,0.3)', borderRadius: 8 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>High </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#51cf66' }}>{chartHigh.toFixed(4)}</span>
                      </div>
                      <div style={{ padding: '6px 12px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Low </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#ff6b6b' }}>{chartLow.toFixed(4)}</span>
                      </div>
                      <div style={{ padding: '6px 12px', background: `${G}10`, border: `1px solid ${G}30`, borderRadius: 8 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Avg </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: G }}>{chartAvg.toFixed(4)}</span>
                      </div>
                    </div>

                    {/* CHART */}
                    <div style={{ height: 150, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 12 }}>
                      <canvas ref={chartRef} />
                    </div>
                  </div>

                  {/* HISTORY */}
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: C }}>📜 Currency History</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{toCurr.history}</p>
                  </div>

                  {/* FACTS */}
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#9c27b0' }}>🔍 Key Facts</h3>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {toCurr.facts.map((fact, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                          <span style={{ color: '#9c27b0', flexShrink: 0 }}>→</span>
                          {fact}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SYMBOL */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                    <span style={{ fontSize: 24 }}>{toCurr.symbol}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>Currency Symbol</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Used in prices and transactions</div>
                    </div>
                  </div>
                </div>
              )}

              {/* MONEY TIPS */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>💰 Pro Money Tips</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {MONEY_TIPS.map((tip, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.025)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,183,77,0.08)', transition: 'all 0.25s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = G }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,183,77,0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{tip.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: G }}>{tip.title}</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{tip.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SECTION 2: EXCHANGE SPOTS */}
          {activeSection === 'spots' && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📍 Best Places to Exchange Currency</h2>

              {/* FILTERS */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'All', icon: '🏪' },
                  { key: 'bank', label: 'Banks', icon: '🏦' },
                  { key: 'forex', label: 'Forex', icon: '💱' },
                  { key: 'atm', label: 'ATMs', icon: '🏧' },
                  { key: 'app', label: 'Apps', icon: '📱' },
                ].map(f => (
                  <button key={f.key} onClick={() => setSpotFilter(f.key as any)} style={{ padding: '8px 16px', background: spotFilter === f.key ? 'rgba(99,210,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${spotFilter === f.key ? C : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, color: spotFilter === f.key ? C : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>

              {/* SPOTS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredSpots.map((spot) => {
                  const badgeStyle = getBadgeColor(spot.badge)
                  return (
                    <div key={spot.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, transition: 'all 0.25s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: spot.type === 'bank' ? 'rgba(99,210,255,0.1)' : spot.type === 'forex' ? 'rgba(255,183,77,0.1)' : spot.type === 'atm' ? 'rgba(156,39,176,0.1)' : 'rgba(81,207,102,0.1)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            {spot.type === 'bank' ? '🏦' : spot.type === 'forex' ? '💱' : spot.type === 'atm' ? '🏧' : '📱'}
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{spot.name}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{spot.address}, {spot.city}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>🕐 {spot.openHours}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                          <span style={{ fontSize: 10, padding: '4px 10px', background: badgeStyle.bg, border: `1px solid ${badgeStyle.border}`, borderRadius: 100, color: badgeStyle.text, fontWeight: 600 }}>
                            {spot.badge === 'good' ? '✓ Good Rate' : spot.badge === 'warn' ? '⚠ Fair Rate' : '✗ Poor Rate'}
                          </span>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>⭐ {spot.rating}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <div>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block' }}>Rate</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: C }}>{spot.rate}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block' }}>Fee</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: GR }}>{spot.fee}</span>
                          </div>
                          {spot.distance !== undefined && (
                            <div>
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block' }}>Distance</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: G }}>{spot.distance} km</span>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openMaps(spot)} style={{ padding: '8px 16px', background: 'rgba(99,210,255,0.1)', border: `1px solid ${C}30`, borderRadius: 8, color: C, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                            📍 Directions
                          </button>
                          <button onClick={() => showToastMsg(`${spot.name} - ${spot.address}`)} style={{ padding: '8px 16px', background: 'rgba(81,207,102,0.1)', border: '1px solid rgba(81,207,102,0.3)', borderRadius: 8, color: '#51cf66', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                            📋 Copy
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '12px 0 0', lineHeight: 1.5 }}>{spot.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: ALL RATES */}
          {activeSection === 'all' && (
            <>
              {/* ALL CURRENCIES */}
              <div style={{ background: 'linear-gradient(135deg,rgba(255,183,77,0.08) 0%,rgba(99,210,255,0.05) 100%)', border: '1px solid rgba(255,183,77,0.15)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📊 All Exchange Rates vs {fromCurrency}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {CURRENCIES.filter(c => c.code !== fromCurrency).map((curr) => {
                    const rate = (curr.rate / (fromCurr?.rate || 1))
                    const converted = (parseFloat(amount || '100') / (fromCurr?.rate || 1)) * curr.rate
                    return (
                      <div key={curr.code} style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', cursor: 'pointer' }}
                        onClick={() => setToCurrency(curr.code)}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = C }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 24 }}>{curr.emoji}</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{curr.code}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{curr.name}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: C, fontFamily: "'Playfair Display',serif" }}>
                          {curr.symbol}{converted.toFixed(2)}
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                          1 {fromCurrency} = {rate.toFixed(4)} {curr.code}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* GENERAL TIPS */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>💡 Essential Currency Tips</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {TIPS.map((tip, i) => (
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
            </>
          )}
        </div>
      </div>

      {/* NEW: AI CHAT BOT */}
      <div style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 1000 }}>
        {chatOpen && (
          <div style={{ position: 'absolute', bottom: 64, right: 0, width: 420, height: 560, background: '#05090f', border: '1px solid rgba(255,183,77,0.2)', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.65)', animation: 'slideUp 0.3s ease' }}>
            <div style={{ padding: '14px 16px', background: `linear-gradient(135deg,rgba(255,183,77,0.15),rgba(255,183,77,0.05))`, borderBottom: '1px solid rgba(255,183,77,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${G},#ff9800)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💱</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: G }}>Currency Assistant</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }} />Online
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, width: 26, height: 26, cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 7, alignItems: 'flex-end' }}>
                  {m.role === 'bot' && <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg,${G},#ff9800)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, color: '#000814', fontWeight: 700 }}>AI</div>}
                  <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? `linear-gradient(135deg,${G},#ff9800)` : 'rgba(255,255,255,0.055)', border: m.role === 'bot' ? `1px solid ${G}30` : 'none', fontSize: 12.5, color: m.role === 'user' ? '#000814' : 'rgba(255,255,255,0.82)', lineHeight: 1.55 }}>{m.text}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg,${G},#ff9800)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#000814', fontWeight: 700 }}>AI</div>
                  <div style={{ padding: '9px 13px', background: 'rgba(255,255,255,0.055)', borderRadius: '14px 14px 14px 3px', border: `1px solid ${G}30`, display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: G, animation: 'bounce 1.2s ease infinite', animationDelay: `${i*0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '8px 12px 12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {CHAT_QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendChatMessage(q)} style={{ fontSize: 10, padding: '4px 10px', background: `${G}10`, border: `1px solid ${G}30`, borderRadius: 100, color: G, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>{q}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 7, background: 'rgba(255,255,255,0.04)', border: `1px solid ${G}30`, borderRadius: 11, padding: '5px 5px 5px 12px', alignItems: 'center' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMessage(chatInput)} placeholder="Ask about currency..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 12.5, fontFamily: "'Outfit',sans-serif" }} />
                <button onClick={() => sendChatMessage(chatInput)} disabled={!chatInput.trim() || chatLoading} style={{ width: 30, height: 30, borderRadius: 7, background: chatInput.trim() ? `linear-gradient(135deg,${G},#ff9800)` : 'rgba(255,255,255,0.05)', border: 'none', cursor: chatInput.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.2s', flexShrink: 0, color: chatInput.trim() ? '#000814' : 'rgba(255,255,255,0.3)' }}>→</button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width: 54, height: 54, borderRadius: '50%', background: chatOpen ? `${G}20` : `linear-gradient(135deg,${G},#ff9800)`, border: chatOpen ? `1px solid ${G}40` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: `0 6px 28px ${G}40`, transition: 'all 0.3s' }}>
          {chatOpen ? '✕' : '💬'}
        </button>
      </div>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#05090f', border: `1px solid ${toastType === 'success' ? GR : C}`, borderRadius: 12, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 1000, boxShadow: `0 8px 32px rgba(0,0,0,0.5)`, animation: 'slideUp 0.3s ease' }}>
          <span style={{ fontSize: 16, color: toastType === 'success' ? GR : C }}>{toastType === 'success' ? '✓' : '💱'}</span>
          <span style={{ fontSize: 13, color: '#fff' }}>{toastMessage}</span>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000814; }
        ::-webkit-scrollbar-thumb { background: rgba(99,210,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  )
}
