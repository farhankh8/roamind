'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const features = [
  { icon: '🤖', title: 'AI Itinerary Generator', desc: 'Generate personalized day-by-day travel plans for 100+ destinations with smart budget planning.', link: '/itinerary' },
  { icon: '✈️', title: 'Flight Search', desc: 'Compare flights from all major airlines. Get best prices and direct booking links instantly.', link: '/flights' },
  { icon: '🏨', title: 'Hotels & Hostels', desc: 'Find 50+ hotels and hostels for every budget. Filter by price, rating, and amenities.', link: '/hotels' },
  { icon: '🍽️', title: 'Restaurant Discovery', desc: 'Discover top restaurants with AI-powered recommendations based on cuisine, budget and vibe.', link: '/restaurants' },
  { icon: '🛂', title: 'Visa Intelligence', desc: 'Get complete visa requirements, official embassy links, documents and processing times.', link: '/visa' },
  { icon: '💱', title: 'Currency Exchange', desc: 'Live exchange rates with top 15 trusted exchange spots in every city you visit.', link: '/currency' },
  { icon: '🌤️', title: 'Weather + AQI', desc: 'Real-time weather forecasts and air quality index with travel suitability scores.', link: '/weather' },
  { icon: '🏅', title: 'Travel Passport', desc: 'Earn badges, upload photos and track every country you visit on an interactive map.', link: '/passport' },
  { icon: '💬', title: 'AI Chat Assistant', desc: 'Ask anything about your trip. Get instant, context-aware travel advice 24/7.', link: '/chat' },
]

const destinations = [
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', tag: 'Most Popular' },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', tag: 'Trending' },
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: 'Beach' },
  { name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', tag: 'Luxury' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', tag: 'Romantic' },
  { name: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', tag: 'City Life' },
  { name: 'Kerala', country: 'India', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', tag: 'Nature' },
  { name: 'Maldives', country: 'Maldives', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', tag: 'Paradise' },
  { name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', tag: 'Heritage' },
  { name: 'Barcelona', country: 'Spain', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80', tag: 'Culture' },
  { name: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', tag: 'Adventure' },
  { name: 'Cape Town', country: 'South Africa', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', tag: 'Wildlife' },
]

const reviews = [
  { name: 'Priya S.', role: 'Travel Blogger', text: 'Roamind completely changed how I plan trips. The AI itinerary is incredibly accurate and saves me hours of research!', stars: 5, avatar: 'P' },
  { name: 'Arjun M.', role: 'Solo Traveler', text: 'The visa system alone is worth it. Got all documents ready for Japan trip in minutes. Absolutely brilliant!', stars: 5, avatar: 'A' },
  { name: 'Sarah K.', role: 'Family Traveler', text: 'Planning a family trip to Europe was so easy. The budget planner kept us on track the entire trip.', stars: 5, avatar: 'S' },
  { name: 'Rahul T.', role: 'Business Traveler', text: 'Currency exchange tips saved me a lot on my last trip. The weather + AQI feature is super useful too!', stars: 5, avatar: 'R' },
]

const stats = [
  { value: '100+', label: 'Destinations' },
  { value: '50K+', label: 'Trips Planned' },
  { value: '4.9★', label: 'User Rating' },
  { value: '11', label: 'AI Features' },
]

export default function LandingPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#000814', color: '#fff', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 clamp(16px,4vw,48px)', height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(0,8,20,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(99,210,255,0.1)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #63d2ff22, #ffb74d22)', border: '1px solid rgba(99,210,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌍</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, background: 'linear-gradient(130deg, #fff 30%, #63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roamind</span>
        </div>

        {/* Center Links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hide-mobile">
          {[['Features','#features'],['Destinations','#destinations'],['How It Works','#how-it-works'],['Reviews','#reviews']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: 0.3, fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#63d2ff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >{label}</a>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => router.push('/auth/login')} style={{ padding: '9px 22px', background: 'transparent', border: '1px solid rgba(99,210,255,0.35)', color: '#63d2ff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit', sans-serif", fontWeight: 600, transition: 'all 0.25s', letterSpacing: 0.5 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(99,210,255,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
          >Log In</button>
          <button onClick={() => router.push('/auth/signup')} style={{ padding: '9px 22px', background: 'linear-gradient(135deg, #ffb74d, #ff8f00)', border: 'none', color: '#000814', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif", transition: 'all 0.25s', letterSpacing: 0.5 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,183,77,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >Sign Up Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(120px,18vh,160px) clamp(16px,4vw,48px) 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Animated BG */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(99,210,255,0.07) 0%, transparent 65%)', pointerEvents: 'none', animation: 'pulse 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,183,77,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,210,255,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', background: 'linear-gradient(135deg, rgba(99,210,255,0.1), rgba(255,183,77,0.08))', border: '1px solid rgba(99,210,255,0.25)', borderRadius: 100, marginBottom: 32, backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: 14 }}>✨</span>
          <span style={{ fontSize: 12, color: '#63d2ff', letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 600 }}>AI-Powered Travel Intelligence</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#63d2ff', animation: 'blink 1.5s ease-in-out infinite' }} />
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px,7.5vw,92px)', fontWeight: 900, lineHeight: 1.02, marginBottom: 28, maxWidth: 1000 }}>
          <span style={{ background: 'linear-gradient(130deg, #fff 15%, #63d2ff 55%, #ffb74d 95%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block' }}>Your AI Travel Brain</span>
          <span style={{ color: '#fff', display: 'block', opacity: 0.92 }}>For The Entire World</span>
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: 'clamp(16px,2vw,21px)', color: 'rgba(255,255,255,0.5)', maxWidth: 620, lineHeight: 1.75, marginBottom: 44 }}>
          Plan smarter trips with AI-generated itineraries, real-time flights, hotels, visa info, currency rates, weather and more — all in one premium platform.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
          <button onClick={() => router.push('/auth/signup')} style={{ padding: '17px 44px', background: 'linear-gradient(135deg, #ffb74d, #ff8f00)', border: 'none', color: '#000814', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: 0.8, transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,183,77,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >Start Planning Free <span style={{ fontSize: 18 }}>→</span></button>
          <button onClick={() => router.push('/auth/login')} style={{ padding: '17px 44px', background: 'rgba(99,210,255,0.07)', border: '1px solid rgba(99,210,255,0.35)', color: '#63d2ff', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: 'all 0.3s', backdropFilter: 'blur(8px)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,210,255,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >Log In</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 'clamp(20px,5vw,64px)', flexWrap: 'wrap', justifyContent: 'center', padding: '28px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 20, backdropFilter: 'blur(12px)' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', position: 'relative' }}>
              {i < stats.length - 1 && <div style={{ position: 'absolute', right: 'calc(-1 * clamp(10px,2.5vw,32px))', top: '50%', transform: 'translateY(-50%)', width: 1, height: 32, background: 'rgba(99,210,255,0.15)' }} />}
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, background: 'linear-gradient(130deg, #63d2ff, #ffb74d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: 'clamp(60px,10vh,110px) clamp(16px,4vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#63d2ff', marginBottom: 14, fontWeight: 600 }}>Simple Process</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, marginBottom: 14 }}>How Roamind Works</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 400, margin: '0 auto' }}>Three simple steps to your perfect trip</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, position: 'relative' }}>
          {[
            { num: '01', title: 'Choose Your Destination', desc: 'Pick from 100+ destinations across India and the world. Set your budget, dates and travel style.', icon: '🗺️' },
            { num: '02', title: 'AI Generates Your Plan', desc: 'Our AI creates a complete day-by-day itinerary with hotels, restaurants, attractions and local tips.', icon: '🤖' },
            { num: '03', title: 'Book & Travel Smart', desc: 'Book flights, hotels, check visa requirements, currency rates and weather — all in one place.', icon: '✈️' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '36px 32px', background: 'linear-gradient(135deg, rgba(99,210,255,0.04), rgba(255,183,77,0.02))', border: '1px solid rgba(99,210,255,0.12)', borderRadius: 20, transition: 'all 0.35s', cursor: 'default', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,210,255,0.35)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(99,210,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(99,210,255,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.04 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#63d2ff', letterSpacing: 2, marginBottom: 16, opacity: 0.6 }}>{s.num}</div>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.48)', lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,210,255,0.12), transparent)', margin: '0 clamp(16px,4vw,48px)' }} />

      {/* FEATURES */}
      <section id="features" style={{ padding: 'clamp(60px,10vh,110px) clamp(16px,4vw,48px)', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#63d2ff', marginBottom: 14, fontWeight: 600 }}>Everything You Need</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, marginBottom: 14 }}>11 Powerful AI Features</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto' }}>One platform replacing every travel app you use</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} onClick={() => router.push('/auth/signup')} style={{ padding: '26px 28px', background: activeFeature === i ? 'rgba(99,210,255,0.07)' : 'rgba(255,255,255,0.025)', border: `1px solid ${activeFeature === i ? 'rgba(99,210,255,0.3)' : 'rgba(99,210,255,0.08)'}`, borderRadius: 18, display: 'flex', gap: 18, alignItems: 'flex-start', transition: 'all 0.3s', cursor: 'pointer', transform: activeFeature === i ? 'translateY(-5px)' : 'translateY(0)', boxShadow: activeFeature === i ? '0 20px 50px rgba(99,210,255,0.08)' : 'none' }}
              onMouseEnter={() => setActiveFeature(i)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, rgba(99,210,255,0.12), rgba(255,183,77,0.08))', border: '1px solid rgba(99,210,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 7, lineHeight: 1.2 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{f.desc}</p>
                <div style={{ fontSize: 12, color: '#63d2ff', marginTop: 10, fontWeight: 600, opacity: activeFeature === i ? 1 : 0, transition: 'opacity 0.2s' }}>Explore feature →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,183,77,0.12), transparent)', margin: '0 clamp(16px,4vw,48px)' }} />

      {/* DESTINATIONS */}
      <section id="destinations" style={{ padding: 'clamp(60px,10vh,110px) clamp(16px,4vw,48px)', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#63d2ff', marginBottom: 14, fontWeight: 600 }}>Explore The World</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, marginBottom: 14 }}>Top Destinations</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>100+ destinations across India and the world</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
          {destinations.map((d, i) => (
            <div key={i} onClick={() => router.push('/auth/signup')} style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/3', transition: 'transform 0.35s, box-shadow 0.35s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <Image src={d.img} alt={d.name} fill style={{ objectFit: 'cover', transition: 'transform 0.4s' }} unoptimized />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
              <div style={{ position: 'absolute', top: 14, right: 14, padding: '4px 12px', background: 'rgba(99,210,255,0.18)', border: '1px solid rgba(99,210,255,0.35)', borderRadius: 100, fontSize: 11, color: '#63d2ff', fontWeight: 600, letterSpacing: 1, backdropFilter: 'blur(8px)' }}>{d.tag}</div>
              <div style={{ position: 'absolute', bottom: 18, left: 18 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{d.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 5 }}>{d.country}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <button onClick={() => router.push('/auth/signup')} style={{ padding: '14px 40px', background: 'rgba(99,210,255,0.07)', border: '1px solid rgba(99,210,255,0.3)', color: '#63d2ff', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,210,255,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,210,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >View All 100+ Destinations →</button>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,210,255,0.12), transparent)', margin: '0 clamp(16px,4vw,48px)' }} />

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: 'clamp(60px,10vh,110px) clamp(16px,4vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#63d2ff', marginBottom: 14, fontWeight: 600 }}>Testimonials</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900 }}>What Travelers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ padding: '32px 28px', background: 'linear-gradient(135deg, rgba(99,210,255,0.04), rgba(255,183,77,0.02))', border: '1px solid rgba(99,210,255,0.1)', borderRadius: 20, transition: 'all 0.35s' }}
              onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,210,255,0.28)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(99,210,255,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(99,210,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ color: '#ffb74d', fontSize: 15, marginBottom: 16, letterSpacing: 2 }}>{'★'.repeat(r.stars)}</div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #63d2ff, #ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#000814' }}>{r.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ margin: 'clamp(40px,6vh,80px) clamp(16px,4vw,48px)', padding: 'clamp(50px,8vw,90px)', background: 'linear-gradient(135deg, rgba(99,210,255,0.07) 0%, rgba(255,183,77,0.05) 100%)', border: '1px solid rgba(99,210,255,0.15)', borderRadius: 28, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(99,210,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#63d2ff', marginBottom: 16, fontWeight: 600 }}>Get Started Today</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,56px)', fontWeight: 900, marginBottom: 18, lineHeight: 1.1 }}>Ready to Travel Smarter?</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>Join thousands of travelers using Roamind to plan better trips with the power of AI.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/auth/signup')} style={{ padding: '18px 52px', background: 'linear-gradient(135deg, #ffb74d, #ff8f00)', border: 'none', color: '#000814', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: 0.8, transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(255,183,77,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >Get Started For Free →</button>
          <button onClick={() => router.push('/auth/login')} style={{ padding: '18px 52px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontFamily: "'Outfit', sans-serif", transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >I have an account</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: 'clamp(40px,6vh,64px) clamp(16px,4vw,48px) 32px', borderTop: '1px solid rgba(99,210,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, maxWidth: 1200, margin: '0 auto 44px' }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #63d2ff22, #ffb74d22)', border: '1px solid rgba(99,210,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌍</div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, background: 'linear-gradient(130deg, #fff 30%, #63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roamind</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.75 }}>Your AI Travel Brain. Plan, discover and execute travel globally with intelligent real-time insights.</p>
          </div>
          {[
            { title: 'Features', links: [['AI Itinerary','/itinerary'],['Flights','/flights'],['Hotels','/hotels'],['Restaurants','/restaurants'],['Visa','/visa'],['Currency','/currency']] },
            { title: 'Company', links: [['About','#'],['Blog','#'],['Careers','#'],['Press','#'],['Contact','#']] },
            { title: 'Legal', links: [['Privacy Policy','#'],['Terms of Service','#'],['Cookie Policy','#']] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>{col.title}</div>
              {col.links.map(([label, href]) => (
                <div key={label} style={{ marginBottom: 11 }}>
                  <a onClick={() => router.push(href)} style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#63d2ff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >{label}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>2025 Roamind. All rights reserved.</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Built with love for travelers everywhere 🌍</div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #000814; }
        ::-webkit-scrollbar-thumb { background: rgba(99,210,255,0.25); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,210,255,0.5); }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </div>
  )
}