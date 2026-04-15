import Link from 'next/link'

export default function NotFound() {
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
      <div style={{ fontSize: '80px', marginBottom: '16px' }}>🗺️</div>
      <h1 style={{ margin: 0, fontSize: '48px', fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>
        404
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', margin: '16px 0', fontSize: '16px' }}>
        Destination not found. This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          padding: '14px 32px',
          background: '#63d2ff',
          color: '#020810',
          borderRadius: '12px',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: 600,
        }}>
        Back to Home
      </Link>
    </div>
  )
}
