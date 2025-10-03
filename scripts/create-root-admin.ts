import dotenv from 'dotenv'
import path from 'path'

import { adminAuth, adminDB } from '../lib/server/firebaseAdmin'

// Load .env.local first (Next.js convention), then .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function createRootAdmin() {
  const email = process.argv[2] || process.env.ROOT_ADMIN_EMAIL
  const password = process.argv[3] || process.env.ROOT_ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Usage: npm run create-root <email> <password>')
    process.exit(1)
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
    })

    // Create root document
    await adminDB.collection('root').doc(userRecord.uid).set({
      email,
      createdAt: new Date(),
      isRoot: true,
      bypassOnboarding: true,
    })

    console.log('🎉 ROOT ADMIN CREATED SUCCESSFULLY!')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 UID: ${userRecord.uid}`)
    console.log(`👑 Role: ROOT`)
    console.log('\n🚀 You can now:')
    console.log('  • Login at /auth')
    console.log('  • Access admin panel at /admin')
    console.log('  • Bypass all onboarding flows')
    console.log('  • Invite other admins')
    console.log('  • Manage the entire app')

  } catch (error) {
    console.error('❌ Error creating root admin:', error)
    process.exit(1)
  }
}

createRootAdmin()
