const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
  'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
  'OPENROUTER_API_KEY',
  'ANTHROPIC_API_KEY',
]

export function validateEnv() {
  const missing: string[] = []
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key)
    }
  })
  if (missing.length > 0) {
    console.warn(
      '⚠️ Missing environment variables:',
      missing.join(', ')
    )
  }
}
