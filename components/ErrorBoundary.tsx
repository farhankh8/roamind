'use client'
import React from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Roamind Error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', gap: '16px', padding: '2rem',
          fontFamily: 'sans-serif'
        }}>
          <div style={{ fontSize: '48px' }}>✈️</div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#666', margin: 0, textAlign: 'center' }}>
            Don&apos;t worry, your travel data is safe. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 24px', background: '#6366f1',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px'
            }}>
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
