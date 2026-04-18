// Environment variables needed for Roamind app
// These are validated at startup

export function validateEnv() {
  // Critical vars - app will fail without these
  const criticalVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ]
  
  // Optional vars - app works but features limited
  const optionalVars = [
    'ANTHROPIC_API_KEY',
    'OPENROUTER_API_KEY',
    'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
    'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
    'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
    'NEXT_PUBLIC_APP_URL',
  ]
  
  const missingCritical: string[] = []
  const missingOptional: string[] = []
  
  criticalVars.forEach((key) => {
    if (!process.env[key]) missingCritical.push(key)
  })
  optionalVars.forEach((key) => {
    if (!process.env[key]) missingOptional.push(key)
  })
  
  if (missingCritical.length > 0) {
    throw new Error('⚠️ Missing critical environment variables: ' + missingCritical.join(', '))
  }
  if (missingOptional.length > 0) {
    console.warn('⚠️ Missing optional environment variables: ' + missingOptional.join(', ') + ' (some features may be limited)')
  }
}
