'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const slides = [
  { img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80', name: 'Paris', country: 'France', flag: '🇫🇷' },
  { img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80', name: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', name: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80', name: 'Bali', country: 'Indonesia', flag: '🇮🇩' },
  { img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80', name: 'Santorini', country: 'Greece', flag: '🇬🇷' },
  { img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80', name: 'Rome', country: 'Italy', flag: '🇮🇹' },
  { img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80', name: 'New York', country: 'USA', flag: '🇺🇸' },
  { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', name: 'Swiss Alps', country: 'Switzerland', flag: '🇨🇭' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string,string>>({})

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    slides.forEach(s => { const img = new Image(); img.src = s.img })
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const errors: Record<string,string> = {}
      result.error.issues.forEach(e => {
        if (e.path[0]) errors[e.path[0] as string] = e.message
      })
      setFormErrors(errors)
      setLoading(false)
      return
    }
    setFormErrors({})
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      const msg = firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/wrong-password'
        ? 'Incorrect email or password. Please try again.'
        : firebaseError.code === 'auth/user-not-found'
        ? 'No account found with this email. Please sign up.'
        : firebaseError.code === 'auth/invalid-email'
        ? 'Please enter a valid email address.'
        : firebaseError.code === 'auth/too-many-requests'
        ? 'Too many failed attempts. Please try again later.'
        : 'Login failed. Please try again.'
      setError(msg)
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Google sign-in failed: ${message}`)
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
      setError('')
    } catch {
      setError('Failed to send reset email. Please check your email address.')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', fontFamily: "'Outfit', sans-serif", overflow: 'hidden' }}>

      {/* LEFT — Slideshow */}
      <div style={{ position: 'relative', flex: 1 }} className="show-desktop">
        {slides.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: mounted && i === currentSlide ? 1 : 0, transition: 'opacity 1.5s ease' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,8,20,0.3) 0%, rgba(0,8,20,0.1) 50%, rgba(0,8,20,0.7) 100%)' }} />
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: 40, left: 40, zIndex: 10 }}>
          <span style={{ fontSize: 44, display: 'block', marginBottom: 10 }}>{slides[currentSlide]?.flag}</span>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{slides[currentSlide]?.name}</div>
          <div style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{slides[currentSlide]?.country}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? 24 : 6, height: 6, borderRadius: 3, background: i === currentSlide ? '#63d2ff' : 'rgba(255,255,255,0.3)', transition: 'all 0.4s', cursor: 'pointer' }} />
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 32, left: 40, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,210,255,0.15), rgba(255,183,77,0.15))', border: '1px solid rgba(99,210,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌍</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, background: 'linear-gradient(130deg, #fff 30%, #63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roamind</span>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: 40, right: 60, transform: 'translateY(-50%)', zIndex: 10 }}>
          <div style={{ fontSize: 40, color: 'rgba(255,255,255,0.12)', fontFamily: "'Playfair Display', serif", lineHeight: 1, marginBottom: 12 }}>&ldquo;</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontStyle: 'italic' }}>Travel is the only thing you buy that makes you richer.</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 10, letterSpacing: 1 }}>— Anonymous</p>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div style={{ width: '100%', maxWidth: 480, background: '#000814', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(24px,5vw,52px)', overflowY: 'auto', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }} className="mobile-only">
          {slides.map((s, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: mounted && i === currentSlide ? 0.15 : 0, transition: 'opacity 1.5s ease' }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => router.push('/landing')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit', sans-serif", marginBottom: 36, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >← Back</button>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Welcome Back</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Sign in to continue your journey</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} style={{ width: '100%', padding: '13px', marginBottom: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>📧</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  style={{ width: '100%', padding: '13px 16px 13px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,210,255,0.18)', borderRadius: 12, color: '#fff', fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,210,255,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,210,255,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(99,210,255,0.18)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              {formErrors.email && (
                <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>{formErrors.email}</p>
              )}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔒</span>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  style={{ width: '100%', padding: '13px 44px 13px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,210,255,0.18)', borderRadius: 12, color: '#fff', fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,210,255,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,210,255,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(99,210,255,0.18)'; e.target.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.4 }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              {formErrors.password && (
                <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>{formErrors.password}</p>
              )}
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a onClick={handleForgotPassword} style={{ fontSize: 13, color: '#63d2ff', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}>
                {resetSent ? '✓ Reset email sent!' : 'Forgot password?'}
              </a>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', borderRadius: 10, color: '#ff7070', fontSize: 13, marginBottom: 16 }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,183,77,0.4)' : 'linear-gradient(135deg, #ffb74d, #ff8f00)', border: 'none', color: '#000814', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: 0.5, transition: 'all 0.3s', marginBottom: 20 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,183,77,0.4)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >{loading ? 'Signing In...' : 'Sign In →'}</button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            Don&apos;t have an account?{' '}
            <a onClick={() => router.push('/auth/signup')} style={{ color: '#63d2ff', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>Sign Up Free</a>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        .show-desktop { display: flex !important; }
        .mobile-only { display: none !important; }
        @media (max-width: 768px) {
          .show-desktop { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </div>
  )
}
