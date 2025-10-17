#!/usr/bin/env node

/**
 * Create Admin User Script
 *
 * This script creates the first admin user in Firebase
 *
 * Usage:
 *   node scripts/create-admin.js
 *   or
 *   yarn create:admin
 */

import dotenv from 'dotenv'
import path from 'path'
import readline from 'readline'
// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

console.log(process.env)

// Validate required environment variables
const requiredEnvVars = ['FIREBASE_SERVICE_ACCOUNT']

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach((varName) => console.error(`   - ${varName}`))
  console.error(
    '\nPlease check your .env.local file and ensure the Firebase service account is configured.',
  )
  process.exit(1)
}

// Initialize Firebase Admin
console.log('🔥 Initializing Firebase Admin...')

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function askQuestion(question: string) {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      resolve(answer)
    })
  })
}

async function createAdminUser() {
  try {
    console.log('\n👤 Creating Admin User')
    console.log('====================')

    const email = await askQuestion('Enter admin email: ') as string
    const password = await askQuestion('Enter admin password: ') as string
    const displayName = await askQuestion('Enter display name (optional): ') as string

    if (!email || !password) {
      console.error('❌ Email and password are required')
      process.exit(1)
    }

    console.log('\n🔄 Creating user account...')

    // Import Firebase Admin SDK after environment variables are loaded
    const { adminAuth, adminDB } = await import('../lib/server/firebaseAdmin')

    // Create user account using Firebase Admin SDK
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      displayName: displayName || null,
    })

    console.log('✅ User account created successfully')
    console.log(`   - UID: ${userRecord.uid}`)
    console.log(`   - Email: ${userRecord.email}`)

    // Create user document with admin role
    console.log('\n🔄 Setting admin role...')

    const userData = {
      role: 'admin',
      email: userRecord.email as string,
      displayName: displayName || userRecord.displayName || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await adminDB.collection('users').doc(userRecord.uid).set(userData)

    console.log('✅ Admin role assigned successfully')
    console.log('\n🎉 Admin user created successfully!')
    console.log('You can now log in to the admin dashboard at /admin')
  } catch (error) {
    console.error(
      '❌ Error creating admin user:',
      error instanceof Error ? error.message : String(error),
    )
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Run the script
if (typeof require !== 'undefined' && require.main === module) {
  createAdminUser()
}

export { createAdminUser }
