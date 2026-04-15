'use client'
import React from 'react'

interface Props { 
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State { 
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Roamind Error:', error, info.componentStack)
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '16px',
          padding: '2rem',
          fontFamily: "'Outfit', sans-serif",
          background: '#020810',
          color: '#fff',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '8px' }}>✈️</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            Something went wrong
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
            Don&apos;t worry, your travel data is safe. Try refreshing the page.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 28px',
                background: '#63d2ff',
                color: '#020810',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
              }}>
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '12px 28px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: "'Outfit', sans-serif",
              }}>
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              fontSize: '12px',
              maxWidth: '600px',
              overflow: 'auto',
              textAlign: 'left',
              color: '#ff6b6b',
            }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
