'use client'
import { useState, useEffect, useRef } from 'react'
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
  { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
  { id: 'transport', name: 'Transport', icon: '✈️' },
  { id: 'food', name: 'Food & Drink', icon: '🍽️' },
  { id: 'activities', name: 'Activities', icon: '🎫' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'health', name: 'Health', icon: '💊' },
  { id: 'connectivity', name: 'Connectivity', icon: '📶' },
  { id: 'emergency', name: 'Emergency', icon: '🆘' },
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AED', 'AUD', 'CAD', 'SGD', 'THB', 'MYR', 'IDR', 'VND', 'CNY', 'KRW', 'CHF']

const SPLITTERS = ['Me', 'Partner', 'Kids', 'Friend 1', 'Friend 2', 'Friend 3']

interface Expense {
  id: string
  amount: number
  originalCurrency: string
  convertedAmount?: number
  category: string
  description: string
  date: string
  method: 'cash' | 'card' | 'crypto'
  receipt?: string
  splitAmong?: string[]
  voiceMemo?: string
  recurring?: boolean
  isDiningOut?: boolean
}

interface TripBudget {
  tripId: string
  tripName: string
  country?: string
  totalBudget: number
  currency: string
  categoryBudgets: Record<string, number>
  expenses: Expense[]
  exchangeRates: Record<string, { rate: number; lastUpdated: string }>
}

interface SavedTrip {
  id: string
  name: string
  country: string
  date: string
}

export default function BudgetTracker() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath] = useState('/budget')
  const [toast, setToast] = useState<{message: string, type: string} | null>(null)
  
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [selectedTrip, setSelectedTrip] = useState('')
  const [tripBudgets, setTripBudgets] = useState<Record<string, TripBudget>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFloatingBtn] = useState(true)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [tripDuration, setTripDuration] = useState(7)
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [bulkData, setBulkData] = useState('')
  const [showCompare, setShowCompare] = useState(false)
  const [compareTrips, setCompareTrips] = useState<string[]>([])
  const [recordingVoice, setRecordingVoice] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [voiceChunks, setVoiceChunks] = useState<Blob[]>([])
  
  const [newExpense, setNewExpense] = useState({
    amount: '', originalCurrency: 'USD', category: 'food', description: '', 
    date: new Date().toISOString().split('T')[0], method: 'card' as 'cash' | 'card' | 'crypto',
    receipt: '', splitAmong: [] as string[], voiceMemo: '', recurring: false, isDiningOut: false
  })
  const [budgetAmount, setBudgetAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [categoryBudgets] = useState<Record<string, number>>({})
  const [exchangeRates, setExchangeRates] = useState<Record<string, { rate: number; lastUpdated: string }>>({})
  const [animatedValues, setAnimatedValues] = useState({ total: 0, spent: 0, remaining: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading])

  useEffect(() => {
    try {
      const passportData = localStorage.getItem('roamind_passport_v2')
      if (passportData) {
        const data = JSON.parse(passportData)
        const tripList = Object.values((data.countries || {}) as Record<string, { code: string; name: string; flag: string; visits?: { date: string }[] }>).flatMap((c) => 
          c.visits?.map((v, i: number) => ({
            id: `${c.code}-${i}`,
            name: c.name,
            country: c.flag,
            date: v.date
          })) || []
        )
        setTrips(tripList)
      }
      const budgetData = localStorage.getItem('roamind_budget')
      if (budgetData) setTripBudgets(JSON.parse(budgetData))
    } catch {}
  }, [])

  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) setSelectedTrip(trips[0].id)
  }, [trips, selectedTrip])

  useEffect(() => {
    localStorage.setItem('roamind_budget', JSON.stringify(tripBudgets))
  }, [tripBudgets])

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t) }
  }, [toast])

  const handleLogout = () => {
    document.cookie = 'firebase-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
    signOut(auth).then(() => router.push('/landing'))
  }

  const currentBudget = tripBudgets[selectedTrip] || { 
    tripId: selectedTrip, tripName: trips.find(t => t.id === selectedTrip)?.name || 'Trip', 
    totalBudget: 0, currency: 'USD', categoryBudgets: {}, expenses: [], exchangeRates: {}, country: '' 
  }

  const totalSpent = currentBudget.expenses.reduce((acc, exp) => acc + (exp.convertedAmount || exp.amount), 0)
  const remaining = currentBudget.totalBudget - totalSpent
  const percentUsed = currentBudget.totalBudget > 0 ? Math.round((totalSpent / currentBudget.totalBudget) * 100) : 0

  useEffect(() => {
    if (currentBudget.totalBudget === 0 && totalSpent === 0) return
    const start = animatedValues.total
    const end = currentBudget.totalBudget
    const diff = end - start
    const steps = 20
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setAnimatedValues({
        total: Math.round(start + (diff * progress)),
        spent: Math.round(totalSpent * progress),
        remaining: Math.round(remaining * progress)
      })
      if (step >= steps) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [selectedTrip, totalSpent, remaining, animatedValues.total, currentBudget.totalBudget])

  const categorySpend = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = currentBudget.expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + (e.convertedAmount || e.amount), 0)
    return acc
  }, {} as Record<string, number>)

  const getCategoryStatus = (catId: string) => {
    const budget = currentBudget.categoryBudgets[catId] || 0
    const spent = categorySpend[catId] || 0
    if (budget === 0) return 'neutral'
    const pct = (spent / budget) * 100
    if (pct >= 90) return 'over'
    if (pct >= 70) return 'warning'
    return 'under'
  }

  const getDayNumber = () => {
    if (!currentBudget.expenses.length) return 1
    const sorted = [...currentBudget.expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const first = new Date(sorted[0].date).getTime()
    const now = new Date().getTime()
    return Math.max(1, Math.ceil((now - first) / (1000 * 60 * 60 * 24)) + 1)
  }

  const dailyRate = currentBudget.totalBudget > 0 && tripDuration > 0 ? (totalSpent / (getDayNumber() || 1)) : 0
  const projectedTotal = dailyRate * tripDuration
  const daysUntilBudgetRunsOut = dailyRate > 0 && remaining > 0 ? Math.floor(remaining / dailyRate) : 0

  const getDailySpendData = () => {
    const daily: Record<string, number> = {}
    currentBudget.expenses.forEach(exp => {
      const date = exp.date
      daily[date] = (daily[date] || 0) + (exp.convertedAmount || exp.amount)
    })
    return daily
  }

  const getWeekendVsWeekday = () => {
    let weekend = 0, weekday = 0
    currentBudget.expenses.forEach(exp => {
      const d = new Date(exp.date).getDay()
      const amt = exp.convertedAmount || exp.amount
      if (d === 0 || d === 6) weekend += amt
      else weekday += amt
    })
    return { weekend, weekday }
  }

  const getDiningBreakdown = () => {
    let dining = 0, groceries = 0
    currentBudget.expenses.filter(e => e.category === 'food').forEach(exp => {
      if (exp.isDiningOut) dining += exp.convertedAmount || exp.amount
      else groceries += exp.convertedAmount || exp.amount
    })
    return { dining, groceries }
  }

  const updateBudget = (amount: number) => {
    setTripBudgets(prev => ({
      ...prev,
      [selectedTrip]: { ...currentBudget, totalBudget: amount, currency, categoryBudgets: categoryBudgets, exchangeRates }
    }))
    setToast({message: 'Budget updated!', type: 'success'})
  }

  const updateExchangeRate = (curr: string, rate: number) => {
    setExchangeRates(prev => ({ ...prev, [curr]: { rate, lastUpdated: new Date().toISOString() } }))
  }

  const convertAmount = (amount: number, fromCurr: string) => {
    if (fromCurr === currentBudget.currency) return amount
    const rate = exchangeRates[fromCurr]?.rate || 1
    return amount * rate
  }

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      setToast({message: 'Please fill all fields', type: 'error'})
      return
    }
    const converted = convertAmount(parseFloat(newExpense.amount), newExpense.originalCurrency)
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      amount: parseFloat(newExpense.amount),
      originalCurrency: newExpense.originalCurrency,
      convertedAmount: converted,
      category: newExpense.category,
      description: newExpense.description,
      date: newExpense.date,
      method: newExpense.method,
      receipt: newExpense.receipt,
      splitAmong: newExpense.splitAmong,
      voiceMemo: newExpense.voiceMemo,
      recurring: newExpense.recurring,
      isDiningOut: newExpense.isDiningOut
    }
    setTripBudgets(prev => ({
      ...prev,
      [selectedTrip]: { ...currentBudget, expenses: [...currentBudget.expenses, expense], exchangeRates }
    }))
    setShowAddForm(false)
    setNewExpense({ amount: '', originalCurrency: 'USD', category: 'food', description: '', date: new Date().toISOString().split('T')[0], method: 'card', receipt: '', splitAmong: [], voiceMemo: '', recurring: false, isDiningOut: false })
    setToast({message: 'Expense added!', type: 'success'})
  }

  const deleteExpense = (expId: string) => {
    setTripBudgets(prev => ({
      ...prev,
      [selectedTrip]: { ...currentBudget, expenses: currentBudget.expenses.filter(e => e.id !== expId) }
    }))
    setToast({message: 'Expense deleted', type: 'info'})
  }

  const updateExpense = (expId: string, field: string, value: unknown) => {
    const updated = currentBudget.expenses.map(e => {
      if (e.id !== expId) return e
      if (field === 'amount') {
        const amt = parseFloat(String(value)) || 0
        return { ...e, amount: amt, convertedAmount: convertAmount(amt, e.originalCurrency) }
      }
      return { ...e, [field]: value }
    })
    setTripBudgets(prev => ({ ...prev, [selectedTrip]: { ...currentBudget, expenses: updated } }))
    setEditingExpense(null)
  }

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setNewExpense(prev => ({ ...prev, receipt: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setVoiceChunks([])
      recorder.ondataavailable = (e) => { if (e.data.size > 0) setVoiceChunks(prev => [...prev, e.data]) }
      recorder.onstop = () => {
        const blob = new Blob(voiceChunks, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = () => { setNewExpense(prev => ({ ...prev, voiceMemo: reader.result as string })) }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      recorder.start()
      setMediaRecorder(recorder)
      setRecordingVoice(true)
    } catch { setToast({message: 'Mic access denied', type: 'error'}) }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecordingVoice(false)
    }
  }

  const handleBulkAdd = () => {
    const lines = bulkData.trim().split('\n')
    const newExpenses: Expense[] = []
    lines.forEach((line, i) => {
      const [amount, category, description, date] = line.split(',').map(s => s.trim())
      if (amount && category && description) {
        const converted = convertAmount(parseFloat(amount), newExpense.originalCurrency)
        newExpenses.push({
          id: `exp-${Date.now()}-${i}`,
          amount: parseFloat(amount),
          originalCurrency: newExpense.originalCurrency,
          convertedAmount: converted,
          category,
          description,
          date: date || new Date().toISOString().split('T')[0],
          method: 'card'
        })
      }
    })
    setTripBudgets(prev => ({
      ...prev,
      [selectedTrip]: { ...currentBudget, expenses: [...currentBudget.expenses, ...newExpenses] }
    }))
    setShowBulkAdd(false)
    setBulkData('')
    setToast({message: `Added ${newExpenses.length} expenses!`, type: 'success'})
  }

  const exportCSV = () => {
    let csv = 'Date,Category,Description,Amount,Currency,Converted Amount,Home Currency,Method,Receipt,Split Among\n'
    currentBudget.expenses.forEach(exp => {
      csv += `${exp.date},${exp.category},${exp.description},${exp.amount},${exp.originalCurrency},${exp.convertedAmount?.toFixed(2) || ''},${currentBudget.currency},${exp.method},${exp.receipt ? 'Y' : 'N'},"${exp.splitAmong?.join('; ') || ''}"\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses_${selectedTrip}.csv`
    a.click()
    setToast({message: 'CSV exported!', type: 'success'})
  }

  const exportHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Budget Report - ${currentBudget.tripName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1a2744; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
    .card { background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; }
    .card h3 { margin: 0 0 10px; color: #666; }
    .card .amount { font-size: 24px; font-weight: bold; color: #1a2744; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #1a2744; color: white; }
  </style>
</head>
<body>
  <h1>📊 Budget Report - ${currentBudget.tripName}</h1>
  <p>Generated: ${new Date().toLocaleDateString()}</p>
  <div class="summary">
    <div class="card"><h3>Total Budget</h3><div class="amount">${currentBudget.currency} ${currentBudget.totalBudget.toLocaleString()}</div></div>
    <div class="card"><h3>Total Spent</h3><div class="amount">${currentBudget.currency} ${totalSpent.toLocaleString()}</div></div>
    <div class="card"><h3>Remaining</h3><div class="amount">${currentBudget.currency} ${remaining.toLocaleString()}</div></div>
  </div>
  <h2>Expenses</h2>
  <table>
    <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr>
    ${currentBudget.expenses.map(e => `<tr><td>${e.date}</td><td>${CATEGORIES.find(c => c.id === e.category)?.icon} ${CATEGORIES.find(c => c.id === e.category)?.name}</td><td>${e.description}</td><td>${e.amount} ${e.originalCurrency}</td></tr>`).join('')}
  </table>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget_report_${selectedTrip}.html`
    a.click()
    setToast({message: 'HTML report exported!', type: 'success'})
  }

  const getSmartAlert = () => {
    if (percentUsed > 80 && percentUsed < (getDayNumber() / tripDuration) * 100) {
      return { type: 'warning', msg: '⚠️ Overspending detected!' }
    }
    if (percentUsed > (getDayNumber() / tripDuration) * 100 - 10) {
      return { type: 'success', msg: '✅ On track!' }
    }
    if (percentUsed > 60 && getDayNumber() < tripDuration * 0.5) {
      return { type: 'info', msg: '💡 60% spent in 40% of trip' }
    }
    return null
  }

  const getTopCategory = () => {
    let max = 0, topCat = ''
    Object.entries(categorySpend).forEach(([cat, amt]) => {
      if (amt > max) { max = amt; topCat = cat }
    })
    return CATEGORIES.find(c => c.id === topCat)
  }

  const biggestExpense = currentBudget.expenses.length ? [...currentBudget.expenses].sort((a, b) => (b.convertedAmount || b.amount) - (a.convertedAmount || a.amount))[0] : null
  const smallestExpense = currentBudget.expenses.length ? [...currentBudget.expenses].sort((a, b) => (a.convertedAmount || a.amount) - (b.convertedAmount || b.amount))[0] : null

  const dailyData = getDailySpendData()
  const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  const maxSpend = Math.max(...Object.values(dailyData), 100)

  if (loading) return <div style={{position:'fixed',inset:0,background:BG,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:44,height:44,border:'2px solid rgba(99,210,255,0.15)',borderTopColor:C,borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>

  return (
    <div style={{display:'flex',height:'100vh',background:BG,color:'#fff',fontFamily:"'Outfit',sans-serif",overflow:'hidden'}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .swipe-row { transition: transform 0.2s; }
        .swipe-row:active { transform: translateX(-60px); }
        .donut { transform: rotate(-90deg); }
      `}</style>

      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      {/* MAIN */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{height:62,padding:'0 22px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(99,210,255,0.07)',background:'rgba(0,5,14,0.9)',backdropFilter:'blur(20px)',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{width:34,height:34,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,cursor:'pointer',fontSize:15,color:'#fff'}}>☰</button>
            <div><div style={{fontSize:14,fontWeight:600}}>💰 Budget Tracker</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Track your travel expenses</div></div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={exportCSV} style={{padding:'8px 12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,cursor:'pointer',color:'#fff',fontSize:12}}>📄 CSV</button>
            <button onClick={exportHTML} style={{padding:'8px 12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,cursor:'pointer',color:'#fff',fontSize:12}}>📄 HTML</button>
            <button onClick={() => setShowCompare(!showCompare)} style={{padding:'8px 12px',background:showCompare?C+'20':'rgba(255,255,255,0.05)',border:'1px solid '+C,borderRadius:8,cursor:'pointer',color:C,fontSize:12}}>⚖️ Compare</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'20px 22px'}}>
          {/* TRIP SELECTOR + DURATION */}
          <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
            <select value={selectedTrip} onChange={(e) => setSelectedTrip(e.target.value)} style={{padding:'10px 16px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14,minWidth:200}}>
              <option value="">Select Trip</option>
              {trips.map(trip => <option key={trip.id} value={trip.id}>{trip.country} {trip.name}</option>)}
            </select>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>Duration:</span>
              <input type="number" value={tripDuration} onChange={(e) => setTripDuration(parseInt(e.target.value) || 7)} style={{width:50,padding:'8px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:12}} />
              <span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>days</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="number" placeholder="Budget" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} style={{width:120,padding:'10px 12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:8,color:'#fff',fontSize:14}} />
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{padding:'10px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:8,color:'#fff',fontSize:13}}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => updateBudget(parseFloat(budgetAmount) || 0)} style={{padding:'10px 16px',background:C,border:'none',borderRadius:8,color:BG,fontWeight:600,cursor:'pointer'}}>Set</button>
            </div>
          </div>

          {/* SMART ALERT */}
          {getSmartAlert() && (
            <div style={{marginBottom:20,padding:16,background:getSmartAlert()?.type==='warning'?R+'15':getSmartAlert()?.type==='success'?GR+'15':C+'15',border:`1px solid ${getSmartAlert()?.type==='warning'?R:getSmartAlert()?.type==='success'?GR:C}`,borderRadius:12,animation:'slideIn 0.3s ease'}}>
              {getSmartAlert()?.msg}
            </div>
          )}

          {/* MAIN CARDS */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
            <div style={{background:BG2,padding:20,borderRadius:14,textAlign:'center',border:'1px solid rgba(99,210,255,0.1)'}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Total Budget</div>
              <div style={{fontSize:24,fontWeight:700,color:C}}>{currentBudget.currency} {animatedValues.total.toLocaleString()}</div>
            </div>
            <div style={{background:BG2,padding:20,borderRadius:14,textAlign:'center',border:'1px solid rgba(255,107,107,0.1)'}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Total Spent</div>
              <div style={{fontSize:24,fontWeight:700,color:R}}>{currentBudget.currency} {animatedValues.spent.toLocaleString()}</div>
            </div>
            <div style={{background:BG2,padding:20,borderRadius:14,textAlign:'center',border:`1px solid ${remaining>=0?'rgba(81,207,102,0.1)':'rgba(255,107,107,0.1)'}`}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Remaining</div>
              <div style={{fontSize:24,fontWeight:700,color:remaining>=0?GR:R}}>{currentBudget.currency} {animatedValues.remaining.toLocaleString()}</div>
            </div>
            <div style={{background:BG2,padding:20,borderRadius:14,textAlign:'center',border:'1px solid rgba(255,183,77,0.1)'}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>% Used</div>
              <div style={{fontSize:24,fontWeight:700,color:percentUsed>80?R:G}}>{percentUsed}%</div>
              <div style={{height:6,background:BG3,borderRadius:3,marginTop:8,overflow:'hidden'}}>
                <div style={{width:`${Math.min(percentUsed,100)}%`,height:'100%',background:percentUsed>80?R:G,borderRadius:3,transition:'width 0.5s'}} />
              </div>
            </div>
          </div>

          {/* SPEND VELOCITY + PROJECTIONS */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
            <div style={{background:BG2,padding:16,borderRadius:14,border:'1px solid '+PURPLE}}>
              <div style={{fontSize:12,color:PURPLE,marginBottom:4}}>Spend Velocity</div>
              <div style={{fontSize:20,fontWeight:700}}>{currentBudget.currency} {dailyRate.toFixed(0)}/day</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginTop:4}}>{daysUntilBudgetRunsOut>0?`Budget lasts ${daysUntilBudgetRunsOut} more days`:'Budget exhausted'}</div>
            </div>
            <div style={{background:BG2,padding:16,borderRadius:14,border:'1px solid '+C}}>
              <div style={{fontSize:12,color:C,marginBottom:4}}>Projected Total</div>
              <div style={{fontSize:20,fontWeight:700}}>{currentBudget.currency} {projectedTotal.toFixed(0)}</div>
              <div style={{fontSize:11,color:projectedTotal>currentBudget.totalBudget?R:GR,marginTop:4}}>{projectedTotal>currentBudget.totalBudget?'⚠️ Over budget':'✅ Within budget'}</div>
            </div>
            <div style={{background:BG2,padding:16,borderRadius:14,border:'1px solid '+G}}>
              <div style={{fontSize:12,color:G,marginBottom:4}}>Top Category</div>
              <div style={{fontSize:16,fontWeight:700}}>{getTopCategory()?.icon} {getTopCategory()?.name}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginTop:4}}>{((categorySpend[getTopCategory()?.id||'']/totalSpent)*100||0).toFixed(0)}% of total</div>
            </div>
          </div>

          {/* BIGGEST/SMALLEST EXPENSE */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
            {biggestExpense && (
              <div style={{background:BG2,padding:16,borderRadius:14,border:'1px solid '+R}}>
                <div style={{fontSize:12,color:R,marginBottom:4}}>💸 Biggest Expense</div>
                <div style={{fontSize:18,fontWeight:700}}>{biggestExpense.description}</div>
                <div style={{fontSize:14,color:R}}>{biggestExpense.amount} {biggestExpense.originalCurrency}</div>
              </div>
            )}
            {smallestExpense && (
              <div style={{background:BG2,padding:16,borderRadius:14,border:'1px solid '+GR}}>
                <div style={{fontSize:12,color:GR,marginBottom:4}}>💰 Smallest Expense</div>
                <div style={{fontSize:18,fontWeight:700}}>{smallestExpense.description}</div>
                <div style={{fontSize:14,color:GR}}>{smallestExpense.amount} {smallestExpense.originalCurrency}</div>
              </div>
            )}
          </div>

          {/* WEEKEND VS WEEKDAY + DINING BREAKDOWN */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
            <div style={{background:BG2,padding:16,borderRadius:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Weekend vs Weekday</div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                <div><span style={{fontSize:16}}>🧑‍💼</span> Weekday</div>
                <div style={{color:C}}>{currentBudget.currency} {getWeekendVsWeekday().weekday.toFixed(0)}</div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginTop:8}}>
                <div><span style={{fontSize:16}}>🧑‍🎤</span> Weekend</div>
                <div style={{color:G}}>{currentBudget.currency} {getWeekendVsWeekday().weekend.toFixed(0)}</div>
              </div>
            </div>
            <div style={{background:BG2,padding:16,borderRadius:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Food Breakdown</div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                <div><span style={{fontSize:16}}>🍽️</span> Dining Out</div>
                <div style={{color:C}}>{currentBudget.currency} {getDiningBreakdown().dining.toFixed(0)}</div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginTop:8}}>
                <div><span style={{fontSize:16}}>🛒</span> Groceries</div>
                <div style={{color:GR}}>{currentBudget.currency} {getDiningBreakdown().groceries.toFixed(0)}</div>
              </div>
            </div>
          </div>

          {/* DAILY SPEND CHART */}
          <div style={{background:BG2,padding:20,borderRadius:14,marginBottom:24}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Daily Spend</div>
            <svg width="100%" height="120" viewBox="0 0 600 120" preserveAspectRatio="none">
              {/* Budget line */}
              <line x1="0" y1="100" x2="600" y2="100" stroke={R} strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <text x="580" y="95" fill={R} fontSize="10">Budget limit</text>
              {/* Spend line */}
              {sortedDates.length > 1 && (
                <polyline fill="none" stroke={C} strokeWidth="3" points={sortedDates.map((d,i) => `${(i/(sortedDates.length-1))*580},${120-((dailyData[d]/maxSpend)*100)}`).join(' ')} />
              )}
              {/* Dots */}
              {sortedDates.map((d,i) => (
                <circle key={d} cx={(i/(sortedDates.length-1))*580} cy={120-((dailyData[d]/maxSpend)*100)} r="4" fill={C} />
              ))}
            </svg>
          </div>

          {/* CATEGORY BUDGETS */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Category Budgets</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
              {CATEGORIES.map(cat => {
                const spent = categorySpend[cat.id] || 0
                const budget = currentBudget.categoryBudgets[cat.id] || 0
                const status = getCategoryStatus(cat.id)
                return (
                  <div key={cat.id} style={{background:BG2,padding:12,borderRadius:10,border:`1px solid ${status==='over'?R:status==='warning'?G:'rgba(255,255,255,0.05)'}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span>{cat.icon}</span>
                      <span style={{fontSize:12,color:'rgba(255,255,255,0.7)'}}>{cat.name}</span>
                    </div>
                    <input type="number" placeholder="Budget" value={budget} onChange={(e) => {
                      const newBudgets = {...currentBudget.categoryBudgets, [cat.id]: parseFloat(e.target.value) || 0}
                      setTripBudgets(prev => ({...prev, [selectedTrip]: {...currentBudget, categoryBudgets: newBudgets}}))
                    }} style={{width:'100%',padding:'6px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,color:'#fff',fontSize:12,marginBottom:4}} />
                    <div style={{fontSize:14,fontWeight:600,color:status==='over'?R:status==='warning'?G:C}}>{currentBudget.currency} {spent.toLocaleString()}</div>
                    {budget > 0 && (
                      <div style={{height:4,background:BG3,borderRadius:2,marginTop:4,overflow:'hidden'}}>
                        <div style={{width:`${Math.min((spent/budget)*100,100)}%`,height:'100%',background:status==='over'?R:status==='warning'?G:C,transition:'width 0.3s'}} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* EXCHANGE RATES */}
          <div style={{marginBottom:20,padding:16,background:BG2,borderRadius:14}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>💱 Exchange Rates to {currency}</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {CURRENCIES.filter(c => c !== currency).slice(0,6).map(curr => (
                <div key={curr} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 12px',background:BG3,borderRadius:8}}>
                  <span style={{fontSize:12,width:40}}>{curr}</span>
                  <input type="number" placeholder="Rate" value={exchangeRates[curr]?.rate || ''} onChange={(e) => updateExchangeRate(curr, parseFloat(e.target.value) || 1)} style={{width:60,padding:'4px',background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,color:'#fff',fontSize:11}} />
                  {exchangeRates[curr]?.lastUpdated && <span style={{fontSize:9,color:'rgba(255,255,255,0.3)'}}>Updated</span>}
                </div>
              ))}
            </div>
          </div>

          {/* TRIP COMPARISON */}
          {showCompare && (
            <div style={{marginBottom:20,padding:16,background:BG2,borderRadius:14,border:`1px solid ${PURPLE}`}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>⚖️ Trip Comparison</div>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                {trips.slice(0,3).map(t => (
                  <button key={t.id} onClick={() => setCompareTrips(prev => prev.includes(t.id)?prev.filter(id=>id!==t.id):[...prev,t.id].slice(0,3))} 
                    style={{padding:'8px 12px',background:compareTrips.includes(t.id)?C:BG3,border:'1px solid '+C,borderRadius:8,color:'#fff',fontSize:12}}>
                    {t.name}
                  </button>
                ))}
              </div>
              {compareTrips.length > 0 && (
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                  <thead>
                    <tr style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                      <th style={{padding:8,textAlign:'left'}}>Trip</th>
                      <th style={{padding:8,textAlign:'right'}}>Budget</th>
                      <th style={{padding:8,textAlign:'right'}}>Spent</th>
                      <th style={{padding:8,textAlign:'right'}}>Daily Avg</th>
                      <th style={{padding:8,textAlign:'right'}}>Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareTrips.map(tid => {
                      const tb = tripBudgets[tid] || {totalBudget:0,expenses:[]}
                      const spent = tb.expenses.reduce((s,e) => s+(e.convertedAmount||e.amount),0)
                      const saved = tb.totalBudget - spent
                      return (
                        <tr key={tid} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                          <td style={{padding:8}}>{trips.find(t=>t.id===tid)?.name}</td>
                          <td style={{padding:8,textAlign:'right',color:C}}>{tb.totalBudget}</td>
                          <td style={{padding:8,textAlign:'right',color:R}}>{spent.toFixed(0)}</td>
                          <td style={{padding:8,textAlign:'right'}}>{(spent/7).toFixed(0)}</td>
                          <td style={{padding:8,textAlign:'right',color: saved >= 0 ? GR : R}}>{saved.toFixed(0)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* EXPENSES TABLE */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:600}}>Expenses ({currentBudget.expenses.length})</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={() => setShowBulkAdd(true)} style={{padding:'8px 12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,cursor:'pointer',color:'#fff',fontSize:12}}>📋 Bulk Add</button>
            </div>
          </div>

          <div style={{background:BG2,borderRadius:14,overflow:'hidden',border:'1px solid rgba(99,210,255,0.08)'}}>
            {currentBudget.expenses.length === 0 ? (
              <div style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>No expenses yet</div>
            ) : (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:BG3,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <th style={{padding:'12px 16px',textAlign:'left',fontSize:12,color:'rgba(255,255,255,0.5)'}}>Date</th>
                    <th style={{padding:'12px 16px',textAlign:'left',fontSize:12,color:'rgba(255,255,255,0.5)'}}>Category</th>
                    <th style={{padding:'12px 16px',textAlign:'left',fontSize:12,color:'rgba(255,255,255,0.5)'}}>Description</th>
                    <th style={{padding:'12px 16px',textAlign:'right',fontSize:12,color:'rgba(255,255,255,0.5)'}}>Amount</th>
                    <th style={{padding:'12px 16px',textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.5)'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {currentBudget.expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => {
                    const cat = CATEGORIES.find(c => c.id === exp.category)
                    const status = getCategoryStatus(exp.category)
                    return (
                      <tr key={exp.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',background:status==='over'?'rgba(255,107,107,0.1)':status==='warning'?'rgba(255,183,77,0.1)':'transparent'}}>
                        <td style={{padding:'12px 16px',fontSize:13}}>{exp.date}</td>
                        <td style={{padding:'12px 16px',fontSize:13}}>{cat?.icon} {cat?.name}</td>
                        <td style={{padding:'12px 16px',fontSize:13}}>
                          {editingExpense === exp.id ? (
                            <input type="text" defaultValue={exp.description} onBlur={(e) => updateExpense(exp.id, 'description', e.target.value)} autoFocus style={{padding:'4px',background:BG3,border:'1px solid '+C,borderRadius:4,color:'#fff',fontSize:13}} />
                          ) : (
                            <span onClick={() => setEditingExpense(exp.id)} style={{cursor:'pointer'}}>{exp.description}</span>
                          )}
                          {exp.receipt && <span style={{marginLeft:6,fontSize:10,color:C}}>📎</span>}
                          {exp.voiceMemo && <span style={{marginLeft:6,fontSize:10,color:PURPLE}}>🎤</span>}
                          {exp.splitAmong?.length && <span style={{marginLeft:6,fontSize:10,color:G}}>Split</span>}
                        </td>
                        <td style={{padding:'12px 16px',textAlign:'right',fontSize:13,fontWeight:600,color:exp.originalCurrency !== currentBudget.currency?G:R}}>
                          {editingExpense === exp.id ? (
                            <input type="number" defaultValue={exp.amount} onBlur={(e) => updateExpense(exp.id, 'amount', e.target.value)} autoFocus style={{width:60,padding:'4px',background:BG3,border:'1px solid '+C,borderRadius:4,color:'#fff',fontSize:13,textAlign:'right'}} />
                          ) : (
                            <span onClick={() => setEditingExpense(exp.id)} style={{cursor:'pointer'}}>{exp.amount} {exp.originalCurrency}</span>
                          )}
                          {exp.originalCurrency !== currentBudget.currency && exp.convertedAmount && (
                            <div style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>≈ {exp.convertedAmount.toFixed(2)} {currentBudget.currency}</div>
                          )}
                        </td>
                        <td style={{padding:'12px 16px',textAlign:'center'}}>
                          <button onClick={() => deleteExpense(exp.id)} style={{background:'transparent',border:'none',cursor:'pointer',color:R}}>🗑️</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ADD BUTTON */}
      {showFloatingBtn && (
        <button onClick={() => setShowAddForm(true)} style={{position:'fixed',bottom:24,right:24,width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,'+G+',#e6a020)',border:'none',color:BG,fontSize:28,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 20px rgba(255,183,77,0.4)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={() => setShowAddForm(false)}>
          <div style={{background:BG2,borderRadius:20,padding:28,maxWidth:480,width:'100%'}} onClick={e => e.stopPropagation()}>
            <h3 style={{color:'#fff',fontSize:18,fontWeight:700,marginBottom:20}}>💸 Add Expense</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',gap:8}}>
                <input type="number" placeholder="Amount" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense,amount:e.target.value})} style={{flex:1,padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14}} />
                <select value={newExpense.originalCurrency} onChange={(e) => setNewExpense({...newExpense,originalCurrency:e.target.value})} style={{width:80,padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14}}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense,category:e.target.value})} style={{padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14}}>
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
              </select>
              <input type="text" placeholder="Description" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense,description:e.target.value})} style={{padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14}} />
              <div style={{display:'flex',gap:8}}>
                <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({...newExpense,date:e.target.value})} style={{flex:1,padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14}} />
                <select value={newExpense.method} onChange={(e) => setNewExpense({...newExpense,method:e.target.value as 'cash' | 'card' | 'crypto'})} style={{padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14}}>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              {newExpense.category === 'food' && (
                <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                  <input type="checkbox" checked={newExpense.isDiningOut} onChange={(e) => setNewExpense({...newExpense,isDiningOut:e.target.checked})} />
                  <span style={{fontSize:13}}>Dining out (vs groceries)</span>
                </label>
              )}
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                <input type="checkbox" checked={newExpense.recurring} onChange={(e) => setNewExpense({...newExpense,recurring:e.target.checked})} />
                <span style={{fontSize:13}}>Recurring (e.g. hotel per night)</span>
              </label>
              <div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Split among (optional)</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {SPLITTERS.map(s => (
                    <button key={s} onClick={() => setNewExpense(prev => ({...prev, splitAmong: prev.splitAmong.includes(s) ? prev.splitAmong.filter(x=>x!==s) : [...prev.splitAmong, s]}))} 
                      style={{padding:'6px 10px',background:newExpense.splitAmong.includes(s)?C:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,color:'#fff',fontSize:11,cursor:'pointer'}}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <label style={{flex:1,padding:12,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,cursor:'pointer',textAlign:'center',fontSize:12}}>
                  📷 Receipt
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleReceiptUpload} style={{display:'none'}} />
                </label>
                <button onClick={recordingVoice ? stopVoiceRecording : startVoiceRecording} style={{flex:1,padding:12,background:recordingVoice?R:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,cursor:'pointer',fontSize:12,color:'#fff'}}>
                  {recordingVoice ? '⏹️ Stop' : '🎤 Voice Memo'}
                </button>
              </div>
              {newExpense.receipt && <div style={{fontSize:10,color:C}}>Receipt attached</div>}
              {newExpense.voiceMemo && <div style={{fontSize:10,color:PURPLE}}>Voice memo attached</div>}
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button onClick={() => setShowAddForm(false)} style={{flex:1,padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',cursor:'pointer'}}>Cancel</button>
                <button onClick={addExpense} style={{flex:1,padding:'12px',background:C,border:'none',borderRadius:8,color:BG,fontWeight:600,cursor:'pointer'}}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK ADD MODAL */}
      {showBulkAdd && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}} onClick={() => setShowBulkAdd(false)}>
          <div style={{background:BG2,borderRadius:20,padding:28,maxWidth:480,width:'100%'}} onClick={e => e.stopPropagation()}>
            <h3 style={{color:'#fff',fontSize:18,fontWeight:700,marginBottom:20}}>📋 Bulk Add Expenses</h3>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Paste CSV data: amount,category,description,date (one per line)</div>
            <textarea value={bulkData} onChange={(e) => setBulkData(e.target.value)} placeholder="100,food,Breakfast,2024-01-15&#10;50,transport,Metro card,2024-01-15" style={{width:'100%',height:150,padding:12,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:12,fontFamily:'monospace'}} />
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button onClick={() => setShowBulkAdd(false)} style={{flex:1,padding:'12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',cursor:'pointer'}}>Cancel</button>
              <button onClick={handleBulkAdd} style={{flex:1,padding:'12px',background:C,border:'none',borderRadius:8,color:BG,fontWeight:600,cursor:'pointer'}}>Add All</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{position:'fixed',bottom:20,right:20,background:toast.type==='error'?R:toast.type==='success'?GR:C,color:toast.type==='success'?BG:'#fff',padding:'12px 20px',borderRadius:10,fontWeight:500,zIndex:2000}}>{toast.message}</div>}
    </div>
  )
}
