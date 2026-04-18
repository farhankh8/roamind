'use client'
const C = '#63d2ff', BG = '#020810'
export default function Loading() {
  return (
    <div style={{ background: BG, minHeight: '100vh', padding: 24 }}>
      <div style={{ height: 60, background: 'rgba(99,210,255,0.1)', borderRadius: 12, marginBottom: 24, animation: 'pulse 1.5s infinite' }} />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ height: 280, background: 'rgba(99,210,255,0.05)', borderRadius: 16, animation: 'pulse 1.5s infinite', animationDelay: `${i*0.1}s` }} />
        ))}
      </div>
      <style>{`@keyframes pulse {0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}