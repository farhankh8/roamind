'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const navSections = [
  { title: 'Plan & Discover', items: [{ icon: '🏠', label: 'Dashboard', path: '/dashboard' }, { icon: '🤖', label: 'AI Itinerary', path: '/itinerary' }] },
  { title: 'Book & Travel', items: [{ icon: '✈️', label: 'Flights', path: '/flights' }, { icon: '🏨', label: 'Hotels', path: '/hotels' }, { icon: '🍽️', label: 'Restaurants', path: '/restaurants' }, { icon: '🚌', label: 'Transport', path: '/transport' }] },
  { title: 'Intelligence', items: [{ icon: '🛂', label: 'Visa Guide', path: '/visa' }, { icon: '💱', label: 'Currency', path: '/currency' }, { icon: '🌤️', label: 'Weather+AQI', path: '/weather' }, { icon: '🆘', label: 'Emergency', path: '/emergency' }] },
  { title: 'Discover People', items: [{ icon: '👨‍💼', label: 'Local Guides', path: '/guides' }, { icon: '🤝', label: 'Couch Surfing', path: '/couchsurfing' }] },
  { title: 'My Travel', items: [{ icon: '🏅', label: 'Travel Passport', path: '/passport' }, { icon: '❤️', label: 'Saved Trips', path: '/saved' }, { icon: '📦', label: 'Packing List', path: '/packing' }, { icon: '💰', label: 'Budget Tracker', path: '/budget' }, { icon: '💬', label: 'AI Chat', path: '/chat' }, { icon: '🧠', label: 'Travel IQ', path: '/traveliq' }, { icon: '⚙️', label: 'Settings', path: '/settings' }] },
]

interface SidebarProps {
  sidebarOpen: boolean
  activePath: string
  user: { email: string | null; displayName: string | null } | null
  onLogout: () => void
}

export default function Sidebar({ sidebarOpen, activePath, user, onLogout }: SidebarProps) {
  const router = useRouter()
  const [clickedPath, setClickedPath] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = (path: string) => {
    setClickedPath(path)
    setMobileOpen(false)
    setTimeout(() => router.push(path), 150)
  }

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler'
  const avatar = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'T').toUpperCase()

  return (
    <>
      <button 
        className="block md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <span aria-hidden="true">☰</span>
      </button>

      {mobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:flex ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:block'}`}
        style={{ width: sidebarOpen ? 256 : 64, minWidth: sidebarOpen ? 256 : 64, background: '#05090f', borderRight: '1px solid rgba(99,210,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}
      >
      <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(99,210,255,0.07)', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,rgba(99,210,255,0.2),rgba(255,183,77,0.15))', border: '1px solid rgba(99,210,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🌍</div>
        {sidebarOpen && <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, background: 'linear-gradient(130deg,#fff 30%,#63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Roamind</span>}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        {navSections.map((section, si) => (
          <div key={si} style={{ marginBottom: 8 }}>
            {sidebarOpen && <div style={{ fontSize: 9.5, letterSpacing: 2.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', padding: '8px 8px 6px', fontWeight: 600 }}>{section.title}</div>}
            {section.items.map(item => (
              <button 
                key={item.path} 
                onClick={() => nav(item.path)}
                onMouseEnter={(e) => {
                  if (activePath !== item.path) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePath !== item.path) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }
                }}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  padding: sidebarOpen ? '9px 10px' : '9px 0', 
                  justifyContent: sidebarOpen ? 'flex-start' : 'center', 
                  background: activePath === item.path ? 'rgba(99,210,255,0.1)' : 'transparent', 
                  border: activePath === item.path ? '1px solid rgba(99,210,255,0.18)' : '1px solid transparent', 
                  borderRadius: 9, 
                  cursor: 'pointer', 
                  marginBottom: 2, 
                  color: '#fff',
                  transition: 'all 0.2s ease',
                  transform: clickedPath === item.path ? 'scale(0.95)' : 'scale(1)',
                  boxShadow: activePath === item.path ? '0 0 12px rgba(99,210,255,0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: 16, transform: clickedPath === item.path ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.15s ease' }}>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: 12.5, fontWeight: activePath === item.path ? 600 : 400, color: activePath === item.path ? '#63d2ff' : 'rgba(255,255,255,0.52)' }}>{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding: '10px', borderTop: '1px solid rgba(99,210,255,0.07)', flexShrink: 0 }}>
        {sidebarOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#63d2ff,#ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000814' }}>{avatar}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{firstName}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{user?.email}</div>
            </div>
          </div>
        )}
        <button 
          onClick={onLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,60,60,0.12)'
            e.currentTarget.style.transform = 'translateX(4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,60,60,0.06)'
            e.currentTarget.style.transform = 'translateX(0)'
          }}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 9, 
            justifyContent: sidebarOpen ? 'flex-start' : 'center', 
            padding: sidebarOpen ? '8px 10px' : '8px 0', 
            background: 'rgba(255,60,60,0.06)', 
            border: '1px solid rgba(255,60,60,0.12)', 
            borderRadius: 9, 
            cursor: 'pointer', 
            color: 'rgba(255,100,100,0.75)', 
            fontSize: 12,
            transition: 'all 0.2s ease',
          }}
        >
          <span>🚪</span>{sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
    </>
  )
}
