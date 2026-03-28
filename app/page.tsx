'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const destinations = [
  { name: 'Paris', flag: '🇫🇷', sub: 'Eiffel Tower · Louvre · Seine River', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80' },
  { name: 'Tokyo', flag: '🇯🇵', sub: 'Shibuya · Mount Fuji · Shinjuku', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80' },
  { name: 'Dubai', flag: '🇦🇪', sub: 'Burj Khalifa · Palm Jumeirah · Desert', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80' },
  { name: 'Bali', flag: '🇮🇩', sub: 'Ubud · Kuta Beach · Tanah Lot', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80' },
  { name: 'Santorini', flag: '🇬🇷', sub: 'Oia · Fira · Caldera Views', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80' },
  { name: 'Maldives', flag: '🇲🇻', sub: 'Overwater Villas · Coral Reefs · Malé', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80' },
  { name: 'Swiss Alps', flag: '🇨🇭', sub: 'Interlaken · Zermatt · Lake Geneva', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  { name: 'Rome', flag: '🇮🇹', sub: 'Colosseum · Vatican · Trevi Fountain', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80' },
  { name: 'New York', flag: '🇺🇸', sub: 'Times Square · Central Park · Brooklyn', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80' },
  { name: 'Taj Mahal', flag: '🇮🇳', sub: 'Agra · Jaipur · Delhi — Incredible India', img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80' },
  { name: 'Bangkok', flag: '🇹🇭', sub: 'Grand Palace · Floating Market · Wat Pho', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1920&q=80' },
  { name: 'Kyoto', flag: '🇯🇵', sub: 'Arashiyama · Fushimi Inari · Geisha District', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80' },
  { name: 'Cape Town', flag: '🇿🇦', sub: 'Table Mountain · Boulders Beach · Cape Point', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80' },
  { name: 'Barcelona', flag: '🇪🇸', sub: 'Sagrada Família · Park Güell · La Rambla', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80' },
  { name: 'Kerala', flag: '🇮🇳', sub: 'Backwaters · Munnar · Kovalam Beach', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80' },
]

const STARS = [
  { id:0, size:1.5, top:10, left:20, dur:3.2, delay:0.5, op:0.3 },
  { id:1, size:1.0, top:25, left:75, dur:4.1, delay:1.2, op:0.2 },
  { id:2, size:2.0, top:40, left:10, dur:2.8, delay:0.8, op:0.4 },
  { id:3, size:1.2, top:55, left:90, dur:5.0, delay:2.1, op:0.3 },
  { id:4, size:0.8, top:70, left:35, dur:3.6, delay:0.3, op:0.2 },
  { id:5, size:1.8, top:15, left:60, dur:4.5, delay:1.8, op:0.35 },
  { id:6, size:1.1, top:80, left:50, dur:2.5, delay:3.0, op:0.25 },
  { id:7, size:1.4, top:5,  left:85, dur:6.0, delay:0.1, op:0.3 },
  { id:8, size:0.9, top:90, left:15, dur:3.9, delay:2.5, op:0.2 },
  { id:9, size:2.2, top:35, left:45, dur:4.8, delay:1.5, op:0.15 },
  { id:10,size:1.6, top:60, left:70, dur:3.3, delay:0.7, op:0.4 },
  { id:11,size:1.0, top:20, left:30, dur:5.5, delay:2.8, op:0.25 },
  { id:12,size:1.3, top:75, left:80, dur:2.9, delay:1.1, op:0.3 },
  { id:13,size:0.7, top:45, left:5,  dur:4.2, delay:3.5, op:0.2 },
  { id:14,size:1.9, top:95, left:55, dur:3.7, delay:0.9, op:0.35 },
  { id:15,size:1.1, top:30, left:95, dur:5.2, delay:2.3, op:0.15 },
  { id:16,size:1.5, top:50, left:25, dur:3.1, delay:1.6, op:0.3 },
  { id:17,size:0.8, top:85, left:65, dur:4.6, delay:0.4, op:0.25 },
  { id:18,size:2.0, top:12, left:40, dur:2.7, delay:3.2, op:0.4 },
  { id:19,size:1.2, top:65, left:88, dur:5.8, delay:1.9, op:0.2 },
  { id:20,size:1.7, top:22, left:52, dur:3.4, delay:0.6, op:0.3 },
  { id:21,size:1.0, top:48, left:72, dur:4.9, delay:2.7, op:0.25 },
  { id:22,size:1.4, top:78, left:18, dur:3.0, delay:1.3, op:0.35 },
  { id:23,size:0.9, top:8,  left:63, dur:6.5, delay:0.2, op:0.2 },
  { id:24,size:2.1, top:92, left:38, dur:2.6, delay:3.8, op:0.3 },
  { id:25,size:1.3, top:33, left:82, dur:4.3, delay:1.0, op:0.15 },
  { id:26,size:1.6, top:58, left:42, dur:3.8, delay:2.4, op:0.4 },
  { id:27,size:1.1, top:18, left:8,  dur:5.1, delay:0.8, op:0.25 },
  { id:28,size:1.8, top:72, left:60, dur:2.9, delay:3.1, op:0.3 },
  { id:29,size:0.7, top:42, left:28, dur:4.7, delay:1.7, op:0.2 },
]

export default function SplashPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [logoOut, setLogoOut] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showTopLogo, setShowTopLogo] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const [textVisible, setTextVisible] = useState(true)

  // Always use index to get dest — never undefined
  const dest = destinations[currentIdx] ?? destinations[0]

  useEffect(() => {
    setMounted(true)

    destinations.forEach(d => {
      const img = new Image()
      img.src = d.img
    })

    const t1 = setTimeout(() => setLogoOut(true), 3200)

    const t2 = setTimeout(() => {
      setShowInfo(true)
      setShowTopLogo(true)

      let idx = 1
      const interval = setInterval(() => {
        if (idx >= destinations.length) {
          clearInterval(interval)
          setTimeout(() => setShowBtn(true), 800)
          return
        }
        setTextVisible(false)
        const capturedIdx = idx
        setTimeout(() => {
          setCurrentIdx(capturedIdx)
          setTextVisible(true)
        }, 320)
        idx++
      }, 600)

      return () => clearInterval(interval)
    }, 3500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const STYLES = `
    @keyframes zoomSlow { from { transform: scale(1.06); } to { transform: scale(1.00); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fillBar { to { width: 100%; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulseBlue { 0%,100% { box-shadow: 0 0 0 0 rgba(99,210,255,0.3); } 50% { box-shadow: 0 0 0 12px rgba(99,210,255,0); } }
    @keyframes twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 0.02; } }
  `

  if (!mounted) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000814', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <style>{STYLES}</style>
        <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 28 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(99,210,255,0.2)', animation: 'spin 5s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '1.5px solid rgba(255,183,77,0.25)', animation: 'spin 3s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', animation: 'spin 8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 28, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #1e4a7a, #05111f)', border: '1px solid rgba(99,210,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🌍</div>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 900, background: 'linear-gradient(130deg, #fff 25%, #63d2ff 60%, #ffb74d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-2px' }}>Roamind</div>
        <div style={{ marginTop: 8, fontSize: 11, letterSpacing: 7, textTransform: 'uppercase', color: 'rgba(99,210,255,0.6)' }}>AI · Travel · Everywhere</div>
        <div style={{ marginTop: 52, width: 180, height: 1.5, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #63d2ff, #ffb74d)', animation: 'fillBar 2.6s ease 0.9s forwards', width: 0 }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000814', overflow: 'hidden' }}>
      <style>{STYLES}</style>

      {/* Stars */}
      {STARS.map(s => (
        <div key={s.id} style={{
          position: 'fixed',
          width: `${s.size}px`, height: `${s.size}px`,
          top: `${s.top}%`, left: `${s.left}%`,
          borderRadius: '50%', background: '#fff',
          pointerEvents: 'none', zIndex: 1, opacity: s.op,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}

      {/* Slides */}
      {destinations.map((d, i) => (
        <div key={i} style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url('${d.img}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === currentIdx && showInfo ? 1 : 0,
          transition: 'opacity 1.4s ease',
          animation: 'zoomSlow 10s ease-in-out infinite alternate',
          zIndex: 2,
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.80) 100%)' }} />
        </div>
      ))}

      {/* Logo Screen */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #060d1f 0%, #000814 70%)',
        opacity: logoOut ? 0 : 1, pointerEvents: logoOut ? 'none' : 'all',
        transition: 'opacity 1s ease',
      }}>
        <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 28 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(99,210,255,0.2)', animation: 'spin 5s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '1.5px solid rgba(255,183,77,0.25)', animation: 'spin 3s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', animation: 'spin 8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 28, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #1e4a7a, #05111f)', border: '1px solid rgba(99,210,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🌍</div>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(52px,10vw,72px)', fontWeight: 900, background: 'linear-gradient(130deg, #fff 25%, #63d2ff 60%, #ffb74d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-2px', animation: 'fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.3s both' }}>Roamind</div>
        <div style={{ marginTop: 8, fontSize: 11, letterSpacing: 7, textTransform: 'uppercase', color: 'rgba(99,210,255,0.6)', animation: 'fadeUp 0.9s ease 0.6s both' }}>AI · Travel · Everywhere</div>
        <div style={{ marginTop: 52, width: 180, height: 1.5, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', animation: 'fadeUp 0.5s ease 0.9s both' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #63d2ff, #ffb74d)', animation: 'fillBar 2.6s ease 0.9s forwards', width: 0 }} />
        </div>
      </div>

      {/* Top Logo */}
      <div style={{ position: 'fixed', top: 28, left: 36, zIndex: 300, display: 'flex', alignItems: 'center', gap: 12, opacity: showTopLogo ? 1 : 0, transition: 'opacity 1s ease' }}>
        <span style={{ fontSize: 24 }}>🌍</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, background: 'linear-gradient(130deg, #fff 30%, #63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roamind</span>
      </div>

      {/* Bottom Info */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300, padding: '0 clamp(24px,5vw,60px) clamp(32px,5vh,52px)', opacity: showInfo ? 1 : 0, transition: 'opacity 0.8s ease', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>

        {/* Left — Destination */}
        <div>
          <span style={{ fontSize: 44, display: 'block', marginBottom: 10, opacity: textVisible ? 1 : 0, transform: textVisible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
            {dest.flag}
          </span>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px,6vw,58px)', fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: '0 4px 32px rgba(0,0,0,0.6)', opacity: textVisible ? 1 : 0, transform: textVisible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
            {dest.name}
          </div>
          <div style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 10, opacity: textVisible ? 1 : 0, transform: textVisible ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
            {dest.sub}
          </div>
        </div>

        {/* Right — Dots + Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 20 }}>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {destinations.map((_, i) => (
              <div key={i} style={{ height: 5, width: i === currentIdx ? 20 : 5, borderRadius: i === currentIdx ? 3 : 99, background: i === currentIdx ? '#63d2ff' : 'rgba(255,255,255,0.25)', transition: 'all 0.4s ease' }} />
            ))}
          </div>
          <button
            onClick={() => router.push('/landing')}
            style={{ padding: '14px 36px', background: 'rgba(99,210,255,0.1)', border: '1px solid rgba(99,210,255,0.35)', color: '#63d2ff', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, opacity: showBtn ? 1 : 0, pointerEvents: showBtn ? 'all' : 'none', transition: 'opacity 0.5s ease, background 0.3s, transform 0.3s, box-shadow 0.3s', backdropFilter: 'blur(8px)', animation: showBtn ? 'pulseBlue 2.5s ease infinite' : 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,210,255,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Explore Now →
          </button>
        </div>
      </div>
    </div>
  )
}
