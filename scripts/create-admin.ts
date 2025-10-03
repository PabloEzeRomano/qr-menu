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
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword,getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import readline from 'readline'

// Load environment variables
dotenv.config()

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach((varName) => console.error(`   - ${varName}`))
  console.error(
    '\nPlease check your .env.local file and ensure all Firebase configuration variables are set.',
  )
  process.exit(1)
}

// Initialize Firebase
console.log('🔥 Initializing Firebase...')
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

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

    const email = await askQuestion('Enter admin email: ')
    const password = await askQuestion('Enter admin password: ')
    const displayName = await askQuestion('Enter display name (optional): ')

    if (!email || !password) {
      console.error('❌ Email and password are required')
      process.exit(1)
    }

    console.log('\n🔄 Creating user account...')

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email as string,
      password as string,
    )
    const user = userCredential.user

    console.log('✅ User account created successfully')
    console.log(`   - UID: ${user.uid}`)
    console.log(`   - Email: ${user.email}`)

    // Create user document with admin role
    console.log('\n🔄 Setting admin role...')

    const userData = {
      role: 'admin',
      email: user.email as string,
      displayName: displayName || user.displayName || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'users', user.uid), userData)

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
