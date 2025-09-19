// Environment validation - run at startup
const requiredClientEnvs = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_MP_PUBLIC_KEY',
  'NEXT_PUBLIC_BASE_URL',
]

const requiredServerEnvs = [
  'MP_ACCESS_TOKEN',
  'FIREBASE_SERVICE_ACCOUNT',
  'MP_BACK_URL_BASE',
  'MP_WEBHOOK_URL',
  'MP_WEBHOOK_TOKEN',
  'BLOB_READ_WRITE_TOKEN',
]

export function validateClientEnv() {
  const missing = requiredClientEnvs.filter((env) => !process.env[env])
  if (missing.length > 0) {
    console.error('❌ Missing required client environment variables:', missing)
    throw new Error(`Missing client environment variables: ${missing.join(', ')}`)
  }
  console.log('✅ Client environment variables validated')
}

export function validateServerEnv() {
  const missing = requiredServerEnvs.filter((env) => !process.env[env])
  if (missing.length > 0) {
    console.error('❌ Missing required server environment variables:', missing)
    throw new Error(`Missing server environment variables: ${missing.join(', ')}`)
  }
  console.log('✅ Server environment variables validated')
}

// Auto-validate on import
if (typeof window === 'undefined') {
  // Server-side
  validateServerEnv()
} else {
  // Client-side
  validateClientEnv()
}
