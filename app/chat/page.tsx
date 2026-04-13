'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const C = '#63d2ff'
const G = '#ffb74d'
const R = '#ff6b6b'
const BG = '#000814'
const BG2 = '#05090f'
const BG3 = '#0a1628'
const GR = '#51cf66'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  { label: 'Visa for', dataKey: 'wishlistCountry' },
  { label: 'Pack for', dataKey: 'lastTrip' },
  { label: 'Hidden gems in', dataKey: 'mostVisited' },
  { label: 'Compare', dataKey: 'compareCountries' },
  { label: 'Best time to visit', dataKey: 'wishlistCountry' },
]

export default function AIChat() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [toast, setToast] = useState<{message: string, type: string} | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) })
      return () => unsubscribe()
    } catch { setLoading(false) }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('roamind_chat')
    if (stored) setMessages(JSON.parse(stored))
    
    const settings = localStorage.getItem('roamind_settings')
    if (settings) {
      const s = JSON.parse(settings)
      if (s.apiKeys?.anthropic) setApiKey(s.apiKeys.anthropic)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('roamind_chat', JSON.stringify(messages.slice(-50)))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleLogout = () => signOut(auth).then(() => router.push('/landing'))
  const nav = (path: string) => { setActivePath(path); router.push(path) }
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  const getUserContext = () => {
    const data = localStorage.getItem('roamind_passport_v2')
    if (!data) return ''
    const parsed = JSON.parse(data)
    const countries = Object.keys(parsed.countries || {})
    const wishlist = parsed.settings?.wishlist || []
    return `User has visited: ${countries.join(', ') || 'none'}. Wishlist: ${wishlist.join(', ') || 'none'}.`
  }

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return
    
    const userMsg: Message = { id: `msg-${Date.now()}`, role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `You are an expert travel assistant with deep knowledge of visa requirements, local customs, safety, budgeting, food, transport, hidden gems, and trip planning. ${getUserContext()}`,
          messages: [
            ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input }
          ]
        })
      })

      const result = await response.json()
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: result.content?.[0]?.text || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      setToast({message: 'Failed to get response. Check API key in Settings.', type: 'error'})
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([])
      setToast({message: 'Chat cleared', type: 'info'})
    }
  }

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/^### (.*?)$/gm, '<h4>$1</h4>')
      .replace(/^## (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^# (.*?)$/gm, '<h2>$1</h2>')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: BG, color: '#fff', fontFamily: "'Outfit',sans-serif", overflow: 'hidden' }}>
      <div style={{ width: sidebarOpen ? 256 : 64, minWidth: sidebarOpen ? 256 : 64, background: '#05090f', borderRight: '1px solid rgba(99,210,255,0.07)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', overflow: 'hidden', flexShrink: 0, zIndex: 50 }}>
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(99,210,255,0.07)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,rgba(99,210,255,0.2),rgba(255,183,77,0.15))', border: '1px solid rgba(99,210,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🌍</div>
          {sidebarOpen && <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, background: 'linear-gradient(130deg,#fff 30%,#63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', whiteSpace: 'nowrap' }}>Roamind</span>}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 8 }}>
              {sidebarOpen && <div style={{ fontSize: 9.5, letterSpacing: 2.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', padding: '8px 8px 6px', fontWeight: 600 }}>{section.title}</div>}
              {section.items.map(item => (
                <button key={item.path} onClick={() => nav(item.path)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '9px 10px' : '9px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center', background: activePath === item.path ? 'rgba(99,210,255,0.1)' : 'transparent', border: activePath === item.path ? '1px solid rgba(99,210,255,0.18)' : '1px solid transparent', borderRadius: 9, cursor: 'pointer', marginBottom: 2, transition: 'all 0.18s' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && <span style={{ fontSize: 12.5, fontWeight: activePath === item.path ? 600 : 400, color: activePath === item.path ? C : 'rgba(255,255,255,0.52)', whiteSpace: 'nowrap' }}>{item.label}</span>}
                  {sidebarOpen && activePath === item.path && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C }} />}
                </button>
              ))}
              {si < navSections.length - 1 && <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 0' }} />}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px', borderTop: '1px solid rgba(99,210,255,0.07)', flexShrink: 0 }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814', flexShrink: 0 }}>{avatar}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{firstName}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '8px 0', background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,60,60,0.12)', borderRadius: 9, cursor: 'pointer', color: 'rgba(255,100,100,0.75)', fontSize: 12, transition: 'all 0.2s' }}>
            <span style={{ fontSize: 14 }}>🚪</span>{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 62, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,210,255,0.07)', background: 'rgba(0,5,14,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', fontSize: 15, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>💬 AI Travel Chat</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Your personal travel assistant</div>
            </div>
          </div>
          <button onClick={clearChat} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: R, fontSize: 13 }}>🗑️ Clear</span>
          </button>
        </div>

        {!apiKey ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>API Key Required</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Please add your Anthropic API key in Settings to use the AI chat.</p>
              <button onClick={() => nav('/settings')} style={{ padding: '12px 24px', background: C, border: 'none', borderRadius: 10, color: BG, fontWeight: 600, cursor: 'pointer' }}>Go to Settings</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Start your travel conversation</div>
                  <p>Ask about visas, destinations, packing, or any travel topic!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '70%', padding: '14px 18px', borderRadius: 18, background: msg.role === 'user' ? C : BG2, color: msg.role === 'user' ? BG : '#fff', border: msg.role === 'user' ? 'none' : '1px solid rgba(99,210,255,0.1)' }}>
                        <div style={{ fontSize: 14, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6 }}>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{ padding: '14px 18px', borderRadius: 18, background: BG2, border: '1px solid rgba(99,210,255,0.1)' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <span style={{ width: 8, height: 8, background: C, borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                          <span style={{ width: 8, height: 8, background: C, borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                          <span style={{ width: 8, height: 8, background: C, borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(99,210,255,0.07)', background: BG2 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about your next trip..."
                  style={{ flex: 1, padding: '14px 18px', background: BG3, border: '1px solid rgba(99,210,255,0.2)', borderRadius: 25, color: '#fff', fontSize: 14 }}
                />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping} style={{ width: 48, height: 48, background: C, border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: input.trim() ? 1 : 0.5 }}>
                  <span style={{ fontSize: 20 }}>➤</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: toast.type === 'error' ? R : GR, color: toast.type === 'error' ? '#fff' : BG, padding: '12px 20px', borderRadius: 10, fontWeight: 500, zIndex: 2000 }}>
          {toast.message}
        </div>
      )}
      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
    </div>
  )
}