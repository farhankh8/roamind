'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import emailjs from '@emailjs/browser'
import { z } from 'zod'

const EMAILJS_SERVICE = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const EMAILJS_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
const EMAILJS_PUBLIC = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const slides = [
  { img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', name: 'Maldives', country: 'Maldives' },
  { img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80', name: 'Taj Mahal', country: 'India' },
  { img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80', name: 'Barcelona', country: 'Spain' },
  { img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80', name: 'Cape Town', country: 'South Africa' },
  { img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=80', name: 'Kyoto', country: 'Japan' },
  { img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80', name: 'Kerala', country: 'India' },
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successName, setSuccessName] = useState('')
  const [successEmail, setSuccessEmail] = useState('')
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

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    noSpace: !/\s/.test(password) && password.length > 0,
  }
  const allChecks = Object.values(checks).every(Boolean)

  const sendWelcomeEmail = async (userName: string, userEmail: string) => {
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          to_name: userName,
          to_email: userEmail,
          from_name: 'Roamind',
          subject: 'Welcome to Roamind! Your AI Travel Brain is Ready 🌍',
          message: `Welcome to Roamind! Your account is ready. Start planning your dream trips today!`,
        },
        EMAILJS_PUBLIC
      )
    } catch (err) {
      console.log('Email error:', err)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      await sendWelcomeEmail(user.displayName || 'Traveler', user.email || '')
      setSuccessName(user.displayName || 'Traveler')
      setSuccessEmail(user.email || '')
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed'
      setError(message)
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = signupSchema.safeParse({ name, email, password })
    if (!result.success) {
      const errors: Record<string,string> = {}
      result.error.issues.forEach(err => {
        if (err.path[0]) errors[err.path[0] as string] = err.message
      })
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields')
      return
    }
    if (!allChecks) {
      setError('Please meet all password requirements')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      await sendWelcomeEmail(name, email)
      setSuccessName(name)
      setSuccessEmail(email)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string }
      const msg = firebaseError.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Please log in.'
        : firebaseError.code === 'auth/invalid-email'
        ? 'Please enter a valid email address.'
        : firebaseError.message || 'Signup failed. Please try again.'
      setError(msg)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, #0a1628 0%, #000814 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif", textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 72, marginBottom: 24, animation: 'bounceIn 0.6s ease' }}>🎉</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, marginBottom: 16, background: 'linear-gradient(130deg, #fff 20%, #63d2ff 60%, #ffb74d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Welcome to Roamind!</h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginBottom: 8, maxWidth: 400 }}>Hey {successName}! Your account is ready.</p>
        <p style={{ fontSize: 14, color: 'rgba(99,210,255,0.6)', marginBottom: 40 }}>A welcome email has been sent to {successEmail}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
          <div style={{ width: 20, height: 20, border: '2px solid rgba(99,210,255,0.4)', borderTopColor: '#63d2ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Taking you to your dashboard...
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Outfit:wght@400;500&display=swap');
          @keyframes bounceIn { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
          @keyframes spin { to{transform:rotate(360deg)} }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', fontFamily: "'Outfit', sans-serif", overflow: 'hidden' }}>

      {/* LEFT — Slideshow */}
      <div style={{ position: 'relative', flex: 1 }} className="show-desktop">
        {slides.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: mounted && i === currentSlide ? 1 : 0, transition: 'opacity 1.5s ease' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,8,20,0.3) 0%, rgba(0,8,20,0.1) 50%, rgba(0,8,20,0.75) 100%)' }} />
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: 40, left: 40, zIndex: 10 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{slides[currentSlide]?.name}</div>
          <div style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>{slides[currentSlide]?.country}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? 24 : 6, height: 6, borderRadius: 3, background: i === currentSlide ? '#ffb74d' : 'rgba(255,255,255,0.3)', transition: 'all 0.4s', cursor: 'pointer' }} />
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 32, left: 40, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🌍</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, background: 'linear-gradient(130deg, #fff 30%, #63d2ff 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roamind</span>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: 40, right: 60, transform: 'translateY(-50%)', zIndex: 10 }}>
          <div style={{ fontSize: 40, color: 'rgba(255,255,255,0.15)', fontFamily: "'Playfair Display', serif", lineHeight: 1, marginBottom: 12 }}>&ldquo;</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, fontStyle: 'italic' }}>The world is a book, and those who do not travel read only one page.</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 12, letterSpacing: 1 }}>— Saint Augustine</p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div style={{ width: '100%', maxWidth: 500, background: '#000814', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(20px,4vw,48px)', overflowY: 'auto', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }} className="mobile-only">
          {slides.map((s, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: mounted && i === currentSlide ? 0.12 : 0, transition: 'opacity 1.5s ease' }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => router.push('/landing')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit', sans-serif", marginBottom: 28, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >← Back</button>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Join Roamind 🌍</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Create your free account and start exploring</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignup} disabled={loading} style={{ width: '100%', padding: '12px', marginBottom: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={handleSignup}>
            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.35 }}>👤</span>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                  style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,210,255,0.18)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,210,255,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,210,255,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(99,210,255,0.18)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              {formErrors.name && (
                <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>{formErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.35 }}>📧</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,210,255,0.18)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,210,255,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,210,255,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(99,210,255,0.18)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              {formErrors.email && (
                <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.35 }}>🔒</span>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password"
                  style={{ width: '100%', padding: '12px 44px 12px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,210,255,0.18)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,210,255,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,210,255,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(99,210,255,0.18)'; e.target.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, opacity: 0.4 }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              {formErrors.password && (
                <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>{formErrors.password}</p>
              )}
            </div>

            {/* Password checks */}
            {password.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginBottom: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                {([
                  [checks.length, '8+ characters'],
                  [checks.upper, 'Uppercase letter'],
                  [checks.lower, 'Lowercase letter'],
                  [checks.number, 'Number (0-9)'],
                  [checks.special, 'Special character'],
                  [checks.noSpace, 'No spaces'],
                ] as [boolean, string][]).map(([ok, label], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: ok ? '#63d2ff' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}>
                    <span>{ok ? '✓' : '○'}</span>{label}
                  </div>
                ))}
              </div>
            )}

            {/* Confirm */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 7 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.35 }}>🔐</span>
                <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password"
                  style={{ width: '100%', padding: '12px 44px 12px 40px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${confirm && confirm === password ? 'rgba(99,210,255,0.5)' : confirm ? 'rgba(255,80,80,0.4)' : 'rgba(99,210,255,0.18)'}`, borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'all 0.3s' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(99,210,255,0.06)' }}
                  onBlur={e => { e.target.style.boxShadow = 'none' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, opacity: 0.4 }}>{showConfirm ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '11px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', borderRadius: 10, color: '#ff7070', fontSize: 13, marginBottom: 14 }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(255,183,77,0.4)' : 'linear-gradient(135deg, #ffb74d, #ff8f00)', border: 'none', color: '#000814', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: 0.5, transition: 'all 0.3s', marginBottom: 14 }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,183,77,0.4)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >{loading ? 'Creating Account...' : 'Create Account →'}</button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
              By signing up you agree to our <a href="#" style={{ color: '#63d2ff', textDecoration: 'none' }}>Terms</a> & <a href="#" style={{ color: '#63d2ff', textDecoration: 'none' }}>Privacy Policy</a>
            </p>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <a onClick={() => router.push('/auth/login')} style={{ color: '#63d2ff', cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}>Log in</a>
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