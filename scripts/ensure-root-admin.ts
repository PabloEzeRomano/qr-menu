import dotenv from 'dotenv'
import path from 'path'

// Load .env.local first (Next.js convention), then .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function ensureRootAdmin() {
  // Check if Firebase service account is configured
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('⚠️  FIREBASE_SERVICE_ACCOUNT not configured. Skipping root admin check.')
    console.log('   Set ROOT_ADMIN_EMAIL and ROOT_ADMIN_PASSWORD env vars for auto-creation.')
    return
  }

  const { adminAuth, adminDB } = await import('../lib/server/firebaseAdmin')

  const rootEmail = process.env.ROOT_ADMIN_EMAIL || 'admin@yourdomain.com'
  const rootPassword = process.env.ROOT_ADMIN_PASSWORD || 'AdminPassword123!'

  try {
    console.log('🔍 Checking for root admin...')

    // Check if any root admin exists
    const rootSnapshot = await adminDB.collection('root').limit(1).get()

    if (!rootSnapshot.empty) {
      const rootAdmin = rootSnapshot.docs[0].data()
      console.log('✅ Root admin already exists:', rootAdmin.email)
      console.log('🚀 Deployment ready!')
      return
    }

    console.log('⚠️  No root admin found. Creating one...')

    // Check if user already exists in Firebase Auth
    let userRecord
    try {
      userRecord = await adminAuth.getUserByEmail(rootEmail)
      console.log('📧 User exists in Firebase Auth, adding to root collection...')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log('👤 Creating new user in Firebase Auth...')
        userRecord = await adminAuth.createUser({
          email: rootEmail,
          password: rootPassword,
          emailVerified: true,
        })
        console.log('✅ User created in Firebase Auth')
      } else {
        throw error
      }
    }

    // Create root document
    await adminDB.collection('root').doc(userRecord.uid).set({
      email: rootEmail,
      createdAt: new Date(),
      isRoot: true,
      bypassOnboarding: true,
      autoCreated: true,
    })

    console.log('🎉 ROOT ADMIN CREATED SUCCESSFULLY!')
    console.log(`📧 Email: ${rootEmail}`)
    console.log(`🔑 UID: ${userRecord.uid}`)
    console.log(`👑 Role: ROOT`)
    console.log('\n🚀 Deployment ready!')
    console.log('   • Root admin can login at /auth')
    console.log('   • Access admin panel at /admin')
    console.log('   • Invite other admins')

  } catch (error) {
    console.error('❌ Error ensuring root admin:', error)
    process.exit(1)
  }
}

ensureRootAdmin()
