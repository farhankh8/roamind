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

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

const TABS = ['Profile', 'API & Integrations', 'Appearance', 'Notifications', 'Data', 'About']
const THEMES = [
  { id: 'dark', name: 'Dark Luxury', colors: ['#000814', '#0a1628'] },
  { id: 'midnight', name: 'Midnight Black', colors: ['#000000', '#1a1a2e'] },
  { id: 'parchment', name: 'Parchment Light', colors: ['#f5f0e6', '#e8dcc8'] },
  { id: 'forest', name: 'Forest Green', colors: ['#0d1f0d', '#1a3a1a'] },
  { id: 'royal', name: 'Royal Burgundy', colors: ['#2d0a0a', '#4a1a1a'] },
]
const ACCENTS = [
  { id: 'gold', color: '#ffb74d', name: 'Gold' },
  { id: 'silver', color: '#c0c0c0', name: 'Silver' },
  { id: 'rose', color: '#e8b4b8', name: 'Rose Gold' },
  { id: 'emerald', color: '#50c878', name: 'Emerald' },
]
const AVATARS = ['✈️', '🌍', '🏖️', '🏔️', '🎭', '🍜', '🚗', '⛵', '🎪', '🗽', '🎨', '🌸']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AED', 'AUD', 'CAD', 'SGD', 'THB', 'MYR', 'IDR', 'VND', 'CNY', 'KRW', 'CHF', 'SEK', 'NOK', 'NZD', 'MXN', 'BRL', 'RUB', 'HKD', 'PHP', 'PLN', 'TRY', 'ZAR']
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Hindi']
const TRAVEL_STYLES = ['Budget', 'Luxury', 'Adventure', 'Solo', 'Family', 'Business', 'Backpacker', 'Foodie', 'Cultural', 'Nature']
const CARD_STYLES = ['sharp', 'rounded', 'pill']
const BG_PATTERNS = ['none', 'grid', 'dots', 'noise', 'constellation']
const CHANGELOG = [
  { version: 'v1.2.0', date: '2026-04-13', changes: ['Added Packing List improvements', 'Added Budget Tracker analytics', 'New travel style tags', 'Receipt photo uploads'] },
  { version: 'v1.1.0', date: '2026-03-01', changes: ['Added AI Chat feature', 'Improved itinerary planner', 'New dashboard widgets', 'Bug fixes'] },
  { version: 'v1.0.0', date: '2026-01-15', changes: ['Initial release', 'Core app features', 'Firebase auth', 'localStorage persistence'] },
]
const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + B', action: 'Toggle Sidebar' },
  { key: 'Ctrl + K', action: 'Search' },
  { key: 'Ctrl + N', action: 'New Trip' },
  { key: 'Ctrl + S', action: 'Save Changes' },
  { key: 'Ctrl + D', action: 'Go to Dashboard' },
  { key: 'Ctrl + P', action: 'Go to Packing' },
  { key: 'Ctrl + B', action: 'Go to Budget' },
  { key: 'Esc', action: 'Close Modal' },
  { key: 'Enter', action: 'Submit Form' },
  { key: 'Tab', action: 'Next Field' },
]

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/settings')
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState<{message: string, type: string} | null>(null)
  const [tabTransition, setTabTransition] = useState<'left' | 'right'>('left')
  const [settingsSearch, setSettingsSearch] = useState('')
  const [apiStatus, setApiStatus] = useState<'none' | 'unverified' | 'connected'>('none')
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [manualSave, setManualSave] = useState(false)
  const [storageBreakdown, setStorageBreakdown] = useState<Record<string, number>>({})
  const [showChangelog, setShowChangelog] = useState(0)
  const [previewFontSize, setPreviewFontSize] = useState(14)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  
  const [settings, setSettings] = useState({
    displayName: '',
    nationality: '',
    homeCity: '',
    bio: '',
    avatar: '✈️',
    avatarUpload: '',
    coverPhoto: '',
    coverColor: 'navy',
    dateFormat: 'DD/MM/YYYY',
    homeCurrency: 'USD',
    language: 'English',
    apiKeys: { anthropic: '', google: '', unsplash: '', webhook: '' },
    aiModel: 'claude-sonnet-4-20250514',
    theme: 'dark',
    accentColor: '#ffb74d',
    customAccent: '#ffb74d',
    fontSize: 'medium',
    previewFontSize: 14,
    compactMode: false,
    animations: true,
    backgroundTexture: true,
    sidebarStyle: 'auto',
    cardStyle: 'rounded',
    bgPattern: 'grid',
    budgetAlert: 80,
    categoryAlerts: {} as Record<string, number>,
    packingReminderDays: 3,
    badgeNotifications: true,
    quizReminder: false,
    rating: 0,
    travelStyles: [] as string[],
    socialLinks: { instagram: '', twitter: '', tripadvisor: '' },
    autoBackup: false,
  })

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) })
      return () => unsubscribe()
    } catch { setLoading(false) }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('roamind_settings')
    if (stored) {
      setSettings({ ...settings, ...JSON.parse(stored) })
    }
    calculateStorage()
    loadStorageBreakdown()
  }, [])

  useEffect(() => {
    if (!manualSave) {
      localStorage.setItem('roamind_settings', JSON.stringify(settings))
      document.documentElement.style.setProperty('--accent', settings.accentColor)
      setUnsavedChanges(false)
      setLastSaved(new Date())
    }
  }, [settings, manualSave])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  useEffect(() => {
    const saved = localStorage.getItem('roamind_settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSettings(prev => ({ ...prev, aiModel: parsed.aiModel || 'claude-sonnet-4-20250514' }))
    }
  }, [])

  const calculateStorage = () => {
    if (typeof window === 'undefined') return 0
    let total = 0
    for (let key in window.localStorage) {
      if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
        total += window.localStorage.getItem(key)?.length || 0
      }
    }
    return total
  }

  const loadStorageBreakdown = () => {
    if (typeof window === 'undefined') return
    const breakdown: Record<string, number> = {}
    const ls = window.localStorage
    for (let key in ls) {
      if (Object.prototype.hasOwnProperty.call(ls, key) && key.startsWith('roamind_')) {
        breakdown[key] = Math.round(((ls.getItem(key)?.length || 0) * 2) / 1024)
      }
    }
    setStorageBreakdown(breakdown)
  }

  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))
  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  const saveSettings = () => {
    localStorage.setItem('roamind_settings', JSON.stringify(settings))
    setUnsavedChanges(false)
    setManualSave(false)
    setLastSaved(new Date())
    setToast({message: 'Settings saved!', type: 'success'})
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setUnsavedChanges(true)
    if (manualSave) {
      localStorage.setItem('roamind_settings', JSON.stringify({ ...settings, [key]: value }))
    }
  }

  const testApiConnection = async () => {
    setApiStatus('unverified')
    if (!settings.apiKeys.anthropic) {
      setToast({message: 'Please enter an API key first', type: 'error'})
      return
    }
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.apiKeys.anthropic,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 10, messages: [{ role: 'user', content: 'Hi' }] })
      })
      if (response.ok) {
        setApiStatus('connected')
        setToast({message: '✅ Connected successfully!', type: 'success'})
      } else {
        setApiStatus('unverified')
        setToast({message: '❌ Connection failed', type: 'error'})
      }
    } catch {
      setApiStatus('unverified')
      setToast({message: '❌ Connection failed', type: 'error'})
    }
  }

  const getApiStatusBadge = () => {
    if (apiStatus === 'none') return <span style={{padding:'4px 8px',background:R+'20',borderRadius:4,fontSize:10,color:R}}>🔴 Not Set</span>
    if (apiStatus === 'unverified') return <span style={{padding:'4px 8px',background:G+'20',borderRadius:4,fontSize:10,color:G}}>🟡 Unverified</span>
    return <span style={{padding:'4px 8px',background:GR+'20',borderRadius:4,fontSize:10,color:GR}}>🟢 Connected</span>
  }

  const exportData = () => {
    const data: Record<string, string> = {}
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('roamind_')) {
        data[key] = localStorage.getItem(key) || ''
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roamind-passport-backup.json'
    a.click()
    setToast({message: 'Data exported!', type: 'success'})
  }

  const selectiveExport = (keys: string[]) => {
    const data: Record<string, string> = {}
    keys.forEach(key => {
      const val = localStorage.getItem(key)
      if (val) data[key] = val
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roamind-selected-backup.json'
    a.click()
    setToast({message: 'Selected data exported!', type: 'success'})
  }

  const selectiveReset = (key: string) => {
    localStorage.removeItem(key)
    loadStorageBreakdown()
    setToast({message: `${key} reset`, type: 'info'})
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>, merge: boolean) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (merge) {
          Object.entries(data).forEach(([key, value]) => {
            const existing = localStorage.getItem(key)
            if (existing) {
              const newData = JSON.parse(value as string)
              const merged = { ...JSON.parse(existing), ...newData }
              localStorage.setItem(key, JSON.stringify(merged))
            } else {
              localStorage.setItem(key, value as string)
            }
          })
        } else {
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value as string)
          })
        }
        setToast({message: 'Data imported!', type: 'success'})
        loadStorageBreakdown()
      } catch {
        setToast({message: 'Invalid file format', type: 'error'})
      }
    }
    reader.readAsText(file)
  }

  const resetAll = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('roamind_'))
    keys.forEach(k => localStorage.removeItem(k))
    setToast({message: 'All data cleared', type: 'success'})
    window.location.reload()
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 80
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, size, size)
        const cropped = canvas.toDataURL('image/jpeg', 0.8)
        handleSettingChange('avatarUpload', cropped)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      handleSettingChange('coverPhoto', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const applyTheme = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId)
    if (theme) {
      document.documentElement.style.setProperty('--bg-primary', theme.colors[0])
      document.documentElement.style.setProperty('--bg-secondary', theme.colors[1])
      handleSettingChange('theme', themeId)
    }
  }

  const getMaskedApiKey = () => {
    const key = settings.apiKeys.anthropic
    if (!key) return ''
    if (key.length <= 4) return key
    return 'sk-ant-...' + key.slice(-4)
  }

  const getLastSavedText = () => {
    if (!lastSaved) return ''
    const diff = Math.floor((Date.now() - lastSaved.getTime()) / 1000)
    if (diff < 60) return 'Saved just now'
    if (diff < 3600) return `Saved ${Math.floor(diff/60)} minutes ago`
    return `Saved ${Math.floor(diff/3600)} hours ago`
  }

  const storageUsed = calculateStorage()
  const storageColor = storageUsed > 4000 ? R : storageUsed > 2000 ? G : C

  if (loading) return <div style={{position:'fixed',inset:0,background:BG,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:44,height:44,border:'2px solid rgba(99,210,255,0.15)',borderTopColor:C,borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>

  return (
    <div style={{display:'flex',height:'100vh',background:BG,color:'#fff',fontFamily:"'Outfit',sans-serif",overflow:'hidden'}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeIn 0.3s ease; }
        .animate-slide { animation: slideIn 0.3s ease; }
        kbd { background: #0a1628; border: 1px solid rgba(99,210,255,0.3); border-radius: 4px; padding: 2px 6px; font-size: 11px; font-family: monospace; }
      `}</style>

      <Sidebar sidebarOpen={sidebarOpen} activePath={activePath} user={user} onLogout={handleLogout} />

      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{height:62,padding:'0 22px',display:'flex',alignItems:'center',borderBottom:'1px solid rgba(99,210,255,0.07)',background:'rgba(0,5,14,0.9)',backdropFilter:'blur(20px)',flexShrink:0}}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{width:34,height:34,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,cursor:'pointer',fontSize:15,color:'rgba(255,255,255,0.45)',display:'flex',alignItems:'center',justifyContent:'center',marginRight:12}}>☰</button>
          <div>
            <div style={{fontSize:14,fontWeight:600}}>⚙️ Settings</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Customize your experience</div>
          </div>
        </div>

        {/* UNSAVED CHANGES BANNER */}
        {unsavedChanges && (
          <div style={{padding:'8px 22px',background:'rgba(255,183,77,0.15)',borderBottom:'1px solid '+G,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{color:G,fontSize:12}}>⚠️ Unsaved changes</span>
            <div style={{display:'flex',gap:8}}>
              <button onClick={() => { setManualSave(false); setUnsavedChanges(false) }} style={{padding:'4px 12px',background:'transparent',border:'1px solid rgba(255,255,255,0.2)',borderRadius:6,color:'#fff',fontSize:11,cursor:'pointer'}}>Discard</button>
              <button onClick={saveSettings} style={{padding:'4px 12px',background:G,border:'none',borderRadius:6,color:BG,fontSize:11,fontWeight:600,cursor:'pointer'}}>Save</button>
            </div>
          </div>
        )}

        <div style={{flex:1,display:'flex',overflow:'hidden'}}>
          <div style={{width:200,borderRight:'1px solid rgba(99,210,255,0.07)',padding:'16px 12px',flexShrink:0}}>
            <input type="text" placeholder="🔍 Search settings..." value={settingsSearch} onChange={(e) => setSettingsSearch(e.target.value)} style={{width:'100%',padding:'8px 12px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:12,marginBottom:12}} />
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => { setTabTransition(i > activeTab ? 'left' : 'right'); setActiveTab(i) }} style={{width:'100%',padding:'10px 12px',background:activeTab === i ? C + '20' : 'transparent',border:activeTab === i ? '1px solid' + C : '1px solid transparent',borderRadius:8,cursor:'pointer',textAlign:'left',color:activeTab === i ? C : 'rgba(255,255,255,0.6)',fontSize:13,fontWeight:activeTab === i ? 600 : 400,marginBottom:4}}>
                {tab}
              </button>
            ))}
          </div>

          <div key={activeTab} style={{flex:1,overflow:'auto',padding:'24px',animation:'fadeIn 0.3s ease'}}>
            {/* PROFILE TAB */}
            {activeTab === 0 && (
              <div style={{maxWidth:500}}>
                <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>👤 Profile</h3>
                
                {/* PROFILE CARD PREVIEW */}
                <div style={{background:BG2,borderRadius:16,padding:20,marginBottom:24,border:'1px solid rgba(99,210,255,0.1)'}}>
                  {/* COVER */}
                  <div style={{height:60,background:settings.coverPhoto ? `url(${settings.coverPhoto})` : settings.coverColor === 'navy' ? 'linear-gradient(135deg, #1a2744, #0d1929)' : BG3,borderRadius:'12px 12px 0 0',marginBottom:-40,backgroundSize:'cover',backgroundPosition:'center',position:'relative'}}>
                    <button onClick={() => coverInputRef.current?.click()} style={{position:'absolute',right:8,bottom:8,padding:'4px 8px',background:'rgba(0,0,0,0.5)',border:'none',borderRadius:6,color:'#fff',fontSize:10,cursor:'pointer'}}>📷 Change</button>
                    <input type="file" ref={coverInputRef} accept="image/*" onChange={handleCoverUpload} style={{display:'none'}} />
                  </div>
                  {/* AVATAR */}
                  <div style={{display:'flex',alignItems:'flex-end',gap:16,marginBottom:16}}>
                    <div style={{width:80,height:80,borderRadius:'50%',background:settings.avatarUpload ? `url(${settings.avatarUpload})` : C,border:'4px solid '+BG2,backgroundSize:'cover',backgroundPosition:'center',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,position:'relative'}}>
                      {!settings.avatarUpload && settings.avatar}
                      <button onClick={() => fileInputRef.current?.click()} style={{position:'absolute',bottom:-4,right:-4,width:24,height:24,background:G,border:'none',borderRadius:'50%',fontSize:12,cursor:'pointer'}}>📷</button>
                      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarUpload} style={{display:'none'}} />
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:18,fontWeight:700}}>{settings.displayName || 'Your Name'}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{settings.nationality} • {settings.homeCity}</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{settings.bio || 'No bio yet'}</div>
                </div>

                {/* AVATAR SELECTOR */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Avatar</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {AVATARS.map(av => (
                      <button key={av} onClick={() => handleSettingChange('avatar', av)} style={{width:44,height:44,fontSize:22,background:settings.avatar === av ? C : BG3,border:settings.avatar === av ? `2px solid ${C}` : '1px solid rgba(255,255,255,0.1)',borderRadius:12,cursor:'pointer'}}>{av}</button>
                    ))}
                  </div>
                </div>

                {/* PROFILE FIELDS */}
                {['displayName', 'nationality', 'homeCity'].map(field => (
                  <div key={field} style={{marginBottom:16}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8,textTransform:'capitalize'}}>{field.replace(/([A-Z])/g, ' $1')}</div>
                    <input type="text" value={settings[field as keyof typeof settings] as string} onChange={(e) => handleSettingChange(field, e.target.value)} maxLength={50} style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}} />
                  </div>
                ))}

                {/* BIO WITH COUNTER */}
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>Bio</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{settings.bio.length}/140</div>
                  </div>
                  <textarea value={settings.bio} onChange={(e) => handleSettingChange('bio', e.target.value.slice(0, 140))} maxLength={140} placeholder="Tell us about yourself..." style={{width:'100%',height:80,padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14,resize:'none',fontFamily:'inherit'}} />
                </div>

                {/* TRAVEL STYLE TAGS */}
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Travel Style</div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {TRAVEL_STYLES.map(style => (
                      <button key={style} onClick={() => handleSettingChange('travelStyles', settings.travelStyles.includes(style) ? settings.travelStyles.filter(s => s !== style) : [...settings.travelStyles, style])} 
                        style={{padding:'6px 12px',background:settings.travelStyles.includes(style) ? C : BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,color:'#fff',fontSize:12,cursor:'pointer'}}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SOCIAL LINKS */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Social Links</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:16}}>📸</span>
                      <input type="text" placeholder="Instagram" value={settings.socialLinks.instagram} onChange={(e) => handleSettingChange('socialLinks', {...settings.socialLinks, instagram: e.target.value})} style={{flex:1,padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:12}} />
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:16}}>🐦</span>
                      <input type="text" placeholder="Twitter/X" value={settings.socialLinks.twitter} onChange={(e) => handleSettingChange('socialLinks', {...settings.socialLinks, twitter: e.target.value})} style={{flex:1,padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:12}} />
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:16}}>🗺️</span>
                      <input type="text" placeholder="TripAdvisor" value={settings.socialLinks.tripadvisor} onChange={(e) => handleSettingChange('socialLinks', {...settings.socialLinks, tripadvisor: e.target.value})} style={{flex:1,padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:12}} />
                    </div>
                  </div>
                </div>

                {/* COVER COLOR */}
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Cover Color</div>
                  <div style={{display:'flex',gap:8}}>
                    {['navy', 'blue', 'purple', 'green', 'orange'].map(color => (
                      <button key={color} onClick={() => handleSettingChange('coverColor', color)} style={{width:40,height:40,borderRadius:8,background:color === 'navy' ? '#1a2744' : color === 'blue' ? '#1e3a5f' : color === 'purple' ? '#3d1a4a' : color === 'green' ? '#1a3d2a' : '#4a2a1a',border:settings.coverColor === color ? `2px solid ${C}` : '2px solid transparent',cursor:'pointer'}} />
                    ))}
                  </div>
                </div>

                {/* LAST SAVED */}
                {lastSaved && <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{getLastSavedText()}</div>}
              </div>
            )}

            {/* API TAB */}
            {activeTab === 1 && (
              <div style={{maxWidth:500}}>
                <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>🔑 API & Integrations</h3>
                
                <div style={{marginBottom:20}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>Anthropic API Key</div>
                    {getApiStatusBadge()}
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <input type="password" value={settings.apiKeys.anthropic} onChange={(e) => handleSettingChange('apiKeys', {...settings.apiKeys, anthropic: e.target.value})} placeholder="sk-ant-..." style={{flex:1,padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}} />
                  </div>
                  {settings.apiKeys.anthropic && <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginTop:4}}>Preview: {getMaskedApiKey()}</div>}
                  <button onClick={testApiConnection} style={{marginTop:8,padding:'8px 16px',background:C,border:'none',borderRadius:8,color:BG,fontWeight:600,cursor:'pointer'}}>Test Connection</button>
                </div>

                {/* MODEL SELECTOR */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>AI Model</div>
                  <select value={settings.aiModel} onChange={(e) => handleSettingChange('aiModel', e.target.value)} style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}}>
                    <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (Recommended)</option>
                    <option value="claude-haiku-4-5-20251001">Claude Haiku (Faster, Cheaper)</option>
                  </select>
                </div>

                {/* API HELP */}
                <div style={{marginBottom:20,padding:16,background:BG3,borderRadius:12,border:'1px solid rgba(99,210,255,0.1)'}}>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Where to get API key?</div>
                  <ol style={{fontSize:11,color:'rgba(255,255,255,0.6)',paddingLeft:16,lineHeight:1.8}}>
                    <li>Go to <a href="https://console.anthropic.com" target="_blank" style={{color:C}}>anthropic.com</a></li>
                    <li>Sign up / Login to your account</li>
                    <li>Add billing info → Create API key</li>
                  </ol>
                </div>

                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Google Maps API Key (Optional)</div>
                  <input type="password" value={settings.apiKeys.google} onChange={(e) => handleSettingChange('apiKeys', {...settings.apiKeys, google: e.target.value})} placeholder="Optional" style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}} />
                </div>

                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Unsplash API Key (Optional)</div>
                  <input type="password" value={settings.apiKeys.unsplash} onChange={(e) => handleSettingChange('apiKeys', {...settings.apiKeys, unsplash: e.target.value})} placeholder="Optional" style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}} />
                </div>

                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Webhook URL (Optional)</div>
                  <input type="url" value={settings.apiKeys.webhook || ''} onChange={(e) => handleSettingChange('apiKeys', {...settings.apiKeys, webhook: e.target.value})} placeholder="https://..." style={{width:'100%',padding:'12px',background:BG3,border:'1px solid rgba(99,210,255,0.2)',borderRadius:10,color:'#fff',fontSize:14}} />
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 2 && (
              <div style={{maxWidth:500}}>
                <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>🎨 Appearance</h3>
                
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:12}}>Theme</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                    {THEMES.map(theme => (
                      <button key={theme.id} onClick={() => applyTheme(theme.id)} style={{padding:16,background:`linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,border:settings.theme === theme.id ? `2px solid ${C}` : '1px solid rgba(255,255,255,0.1)',borderRadius:12,cursor:'pointer',textAlign:'center'}}>
                        <div style={{color:'#fff',fontSize:13,fontWeight:600}}>{theme.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:12}}>Accent Color</div>
                  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                    {ACCENTS.map(accent => (
                      <button key={accent.id} onClick={() => handleSettingChange('accentColor', accent.color)} style={{width:44,height:44,background:accent.color,border:settings.accentColor === accent.color ? '3px solid #fff' : '2px solid transparent',borderRadius:'50%',cursor:'pointer'}} />
                    ))}
                    <input type="color" value={settings.customAccent} onChange={(e) => handleSettingChange('customAccent', e.target.value)} onInput={(e) => handleSettingChange('accentColor', (e.target as HTMLInputElement).value)} style={{width:44,height:44,border:'none',cursor:'pointer',background:'transparent'}} />
                  </div>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Font Size Preview</div>
                  <input type="range" min={12} max={18} value={settings.previewFontSize} onChange={(e) => handleSettingChange('previewFontSize', parseInt(e.target.value))} style={{width:'100%'}} />
                  <div style={{fontSize:settings.previewFontSize,marginTop:8,padding:12,background:BG3,borderRadius:8}}>The quick brown fox jumps over the lazy dog</div>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Sidebar Style</div>
                  <div style={{display:'flex',gap:8}}>
                    {['compact', 'expanded', 'auto'].map(style => (
                      <button key={style} onClick={() => handleSettingChange('sidebarStyle', style)} style={{flex:1,padding:10,background:settings.sidebarStyle === style ? C : BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',cursor:'pointer',textTransform:'capitalize'}}>{style}</button>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Card Style</div>
                  <div style={{display:'flex',gap:8}}>
                    {CARD_STYLES.map(style => (
                      <button key={style} onClick={() => handleSettingChange('cardStyle', style)} style={{flex:1,padding:10,background:settings.cardStyle === style ? C : BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:style === 'pill' ? 24 : style === 'rounded' ? 14 : 0,color:'#fff',cursor:'pointer',textTransform:'capitalize'}}>{style}</button>
                    ))}
                  </div>
                </div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Background Pattern</div>
                  <div style={{display:'flex',gap:8}}>
                    {BG_PATTERNS.map(pattern => (
                      <button key={pattern} onClick={() => handleSettingChange('bgPattern', pattern)} style={{flex:1,padding:10,background:settings.bgPattern === pattern ? C : BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',cursor:'pointer',textTransform:'capitalize',fontSize:12}}>{pattern}</button>
                    ))}
                  </div>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                    <input type="checkbox" checked={settings.compactMode} onChange={(e) => handleSettingChange('compactMode', e.target.checked)} style={{width:20,height:20}} />
                    <span>Compact Mode</span>
                  </label>
                  <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                    <input type="checkbox" checked={settings.animations} onChange={(e) => handleSettingChange('animations', e.target.checked)} style={{width:20,height:20}} />
                    <span>Enable Animations</span>
                  </label>
                  <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                    <input type="checkbox" checked={settings.backgroundTexture} onChange={(e) => handleSettingChange('backgroundTexture', e.target.checked)} style={{width:20,height:20}} />
                    <span>Background Texture</span>
                  </label>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 3 && (
              <div style={{maxWidth:500}}>
                <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>🔔 Notifications & Alerts</h3>
                
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Budget Alert Threshold</div>
                  <div style={{position:'relative',height:40}}>
                    <div style={{position:'absolute',top:20,left:0,right:0,height:8,background:`linear-gradient(to right, ${GR} 0%, ${GR} 50%, ${G} 50%, ${G} 80%, ${R} 80%, ${R} 100%)`,borderRadius:4}} />
                    <input type="range" min={50} max={90} step={10} value={settings.budgetAlert} onChange={(e) => handleSettingChange('budgetAlert', parseInt(e.target.value))} style={{width:'100%',position:'relative',zIndex:1}} />
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,0.5)'}}>
                    <span>50%</span>
                    <span style={{color:settings.budgetAlert >= 80 ? R : settings.budgetAlert >= 60 ? G : GR}}>{settings.budgetAlert}%</span>
                    <span>90%</span>
                  </div>
                </div>

                <div style={{marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Packing Reminder (days before trip)</div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <input type="number" min={1} max={14} value={settings.packingReminderDays} onChange={(e) => handleSettingChange('packingReminderDays', parseInt(e.target.value) || 3)} style={{width:60,padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14}} />
                    <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>days before</span>
                  </div>
                </div>

                {/* NOTIFICATION PREVIEW */}
                <div style={{marginBottom:20,padding:16,background:BG3,borderRadius:12}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Preview</div>
                  <div style={{padding:'12px 20px',background:settings.budgetAlert >= 80 ? R : C,color:settings.budgetAlert >= 80 ? '#fff' : BG,borderRadius:10,fontWeight:500}}>
                    ⚠️ Budget alert: You've used {settings.budgetAlert}% of your budget
                  </div>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                    <input type="checkbox" checked={settings.badgeNotifications} onChange={(e) => handleSettingChange('badgeNotifications', e.target.checked)} style={{width:20,height:20}} />
                    <span>Badge Unlock Notifications</span>
                  </label>
                  <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                    <input type="checkbox" checked={settings.quizReminder} onChange={(e) => handleSettingChange('quizReminder', e.target.checked)} style={{width:20,height:20}} />
                    <span>Daily Quiz Reminder</span>
                  </label>
                </div>
              </div>
            )}

            {/* DATA TAB */}
            {activeTab === 4 && (
              <div style={{maxWidth:500}}>
                <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>💾 Data Management</h3>
                
                <div style={{marginBottom:20,padding:16,background:BG2,borderRadius:12}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Storage Used</div>
                  <div style={{height:8,background:BG3,borderRadius:4,marginBottom:8}}>
                    <div style={{width:`${Math.min((storageUsed / 5120) * 100, 100)}%`,height:'100%',background:storageColor,borderRadius:4,transition:'width 1s ease'}} />
                  </div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',marginBottom:12}}>{storageUsed} KB / 5,000 KB</div>
                  
                  {/* STORAGE BREAKDOWN */}
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.5)'}}>Breakdown:</div>
                  {Object.entries(storageBreakdown).slice(0,5).map(([key, kb]) => (
                    <div key={key} style={{display:'flex',justifyContent:'space-between',fontSize:11,padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                      <span>{key.replace('roamind_', '')}</span>
                      <span>{kb} KB</span>
                    </div>
                  ))}
                </div>

                {/* SELECTIVE EXPORT */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Selective Export</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
                    {['settings', 'passport', 'budget', 'packing', 'chat', 'quiz'].map(key => (
                      <button key={key} onClick={() => selectiveExport([`roamind_${key}`])} style={{padding:8,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:11,cursor:'pointer',textTransform:'capitalize'}}>{key}</button>
                    ))}
                  </div>
                </div>

                {/* SELECTIVE RESET */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Selective Reset</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                    {['settings', 'passport', 'budget', 'packing', 'chat', 'quiz'].map(key => (
                      <button key={key} onClick={() => selectiveReset(`roamind_${key}`)} style={{padding:8,background:R+'15',border:`1px solid ${R}`,borderRadius:8,color:R,fontSize:11,cursor:'pointer',textTransform:'capitalize'}}>{key}</button>
                    ))}
                  </div>
                </div>

                {/* AUTO BACKUP */}
                <div style={{marginBottom:20}}>
                  <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                    <input type="checkbox" checked={settings.autoBackup} onChange={(e) => handleSettingChange('autoBackup', e.target.checked)} style={{width:20,height:20}} />
                    <span>Auto-backup every 7 days</span>
                  </label>
                </div>

                <div style={{display:'grid',gap:12,marginBottom:20}}>
                  <button onClick={exportData} style={{padding:14,background:C,border:'none',borderRadius:10,color:BG,fontWeight:600,cursor:'pointer'}}>📤 Export All Data</button>
                  <label style={{padding:14,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#fff',fontWeight:600,cursor:'pointer',textAlign:'center'}}>
                    📥 Import Data
                    <input type="file" accept=".json" onChange={(e) => importData(e, true)} style={{display:'none'}} />
                  </label>
                </div>

                <div style={{padding:16,background:R+'10',border:`1px solid ${R}`,borderRadius:12}}>
                  <div style={{fontSize:14,fontWeight:600,color:R,marginBottom:12}}>☢️ Nuclear Reset</div>
                  <input type="text" placeholder='Type "RESET" to confirm' onChange={(e) => {}} style={{width:'100%',padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',fontSize:14,marginBottom:8}} />
                  <button onClick={resetAll} style={{width:'100%',padding:12,background:R,border:'none',borderRadius:8,color:'#fff',fontWeight:600,cursor:'pointer'}}>Reset All Data</button>
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 5 && (
              <div style={{maxWidth:500}}>
                <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>ℹ️ About</h3>
                
                {/* WHAT'S NEW */}
                <div style={{marginBottom:20,padding:16,background:`linear-gradient(135deg, ${PURPLE}20, ${C}10)`,border:`1px solid ${PURPLE}`,borderRadius:14}}>
                  <div style={{fontSize:12,color:PURPLE,fontWeight:600,marginBottom:4}}>✨ What's New</div>
                  <div style={{fontSize:14,fontWeight:600}}>Packing List 2.0</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.6)'}}>Smart suggestions, drag-drop, weight tracking & more</div>
                </div>

                <div style={{background:BG2,padding:20,borderRadius:14,marginBottom:20,textAlign:'center'}}>
                  <div style={{fontSize:40,marginBottom:12}}>🌍</div>
                  <div style={{fontSize:20,fontWeight:700,marginBottom:4}}>Roamind</div>
                  <div style={{color:'rgba(255,255,255,0.5)'}}>Version 1.0.0</div>
                  <div style={{color:'rgba(255,255,255,0.3)',fontSize:12,marginTop:8}}>Built with Next.js, React & Firebase</div>
                </div>

                {/* CHANGELOG */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Changelog</div>
                  {CHANGELOG.map((ver, i) => (
                    <div key={ver.version} style={{marginBottom:8}}>
                      <button onClick={() => setShowChangelog(showChangelog === i ? -1 : i)} style={{width:'100%',padding:12,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#fff',cursor:'pointer',textAlign:'left',display:'flex',justifyContent:'space-between'}}>
                        <span style={{fontWeight:600}}>{ver.version}</span>
                        <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>{ver.date}</span>
                      </button>
                      {showChangelog === i && (
                        <ul style={{fontSize:12,color:'rgba(255,255,255,0.6)',paddingLeft:16,marginTop:8}}>
                          {ver.changes.map((change, j) => <li key={j}>{change}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{background:BG2,padding:20,borderRadius:14,marginBottom:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Rate This App</div>
                  <div style={{display:'flex',justifyContent:'center',gap:8}}>
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => { handleSettingChange('rating', star); setToast({message: 'Thanks!', type: 'success'}) }} style={{fontSize:28,background:'transparent',border:'none',cursor:'pointer'}}>{star <= settings.rating ? '⭐' : '☆'}</button>
                    ))}
                  </div>
                </div>

                {/* KEYBOARD SHORTCUTS */}
                <div style={{background:BG2,padding:20,borderRadius:14,marginBottom:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>⌨️ Keyboard Shortcuts</div>
                  <table style={{width:'100%',fontSize:12}}>
                    <tbody>
                      {KEYBOARD_SHORTCUTS.map(sc => (
                        <tr key={sc.key} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                          <td style={{padding:'8px 0',color:'rgba(255,255,255,0.6)'}}>{sc.action}</td>
                          <td style={{padding:'8px 0',textAlign:'right'}}><kbd>{sc.key}</kbd></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SHARE APP */}
                <div style={{marginBottom:20}}>
                  <button onClick={() => { navigator.clipboard.writeText('https://roamind.app'); setToast({message: 'Link copied!', type: 'success'}) }} style={{width:'100%',padding:14,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#fff',fontSize:13,cursor:'pointer'}}>📤 Share App</button>
                </div>

                {/* SYSTEM INFO */}
                <div style={{background:BG2,padding:16,borderRadius:14,marginBottom:20}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>System Info</div>
                  <div style={{fontSize:11,display:'grid',gap:6}}>
                    <div><span style={{color:'rgba(255,255,255,0.4)'}}>Browser:</span> {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}</div>
                    <div><span style={{color:'rgba(255,255,255,0.4)'}}>Online:</span> {navigator.onLine ? '✅ Yes' : '❌ No'}</div>
                    <div><span style={{color:'rgba(255,255,255,0.4)'}}>Storage:</span> {typeof localStorage !== 'undefined' ? '✅ Available' : '❌ Unavailable'}</div>
                  </div>
                </div>

                {/* CREDITS */}
                <div style={{background:BG2,padding:16,borderRadius:14}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>Credits</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <span style={{padding:'4px 10px',background:C+'20',borderRadius:20,fontSize:11}}>Lead Dev</span>
                    <span style={{padding:'4px 10px',background:PURPLE+'20',borderRadius:20,fontSize:11}}>Design</span>
                    <span style={{padding:'4px 10px',background:GR+'20',borderRadius:20,fontSize:11}}>AI Partner</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <div style={{position:'fixed',bottom:20,right:20,background:toast.type === 'error' ? R : toast.type === 'success' ? GR : C,color:toast.type === 'success' ? BG : '#fff',padding:'12px 20px',borderRadius:10,fontWeight:500,zIndex:2000}}>{toast.message}</div>}
    </div>
  )
}
