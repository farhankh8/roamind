'use client'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '6px',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div style={{
      padding: '16px', borderRadius: '12px',
      border: '1px solid #eee', display: 'flex',
      flexDirection: 'column', gap: '12px'
    }}>
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" />
      <Skeleton height="16px" width="80%" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div style={{ padding: '2rem', display: 'flex', 
      flexDirection: 'column', gap: '16px' }}>
      <Skeleton height="32px" width="40%" />
      <div style={{ display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
