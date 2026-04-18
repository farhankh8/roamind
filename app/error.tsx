'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      margin: 0,
      fontFamily: "'Outfit', sans-serif",
      background: '#020810',
      color: '#fff',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛬</div>
      <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>
        Unexpected Error
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', margin: '16px 0', textAlign: 'center', maxWidth: '400px' }}>
        Something unexpected happened. Your data is safe.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '14px 32px',
          background: '#63d2ff',
          color: '#020810',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
        }}>
        Try Again
      </button>
    </div>
  )
}