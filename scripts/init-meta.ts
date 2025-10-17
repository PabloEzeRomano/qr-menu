#!/usr/bin/env node

/**
 * Initialize Meta Document Script
 *
 * This script creates a meta document with onboarding: false if it doesn't exist
 *
 * Usage:
 *   node scripts/init-meta.ts
 *   or
 *   yarn init:meta
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables FIRST, before any other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function initMeta() {
  // Check if Firebase service account is configured
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('⚠️  FIREBASE_SERVICE_ACCOUNT not configured. Skipping meta initialization.')
    return
  }

  try {
    console.log('🔍 Checking for meta document...')

    // Import Firebase Admin SDK after environment variables are loaded
    const { adminDB } = await import('../lib/server/firebaseAdmin')

    // Check if meta document exists
    const metaRef = adminDB.collection('meta').doc('onboarding')
    const metaDoc = await metaRef.get()

    if (metaDoc.exists) {
      console.log('✅ Meta document already exists')
      const data = metaDoc.data()
      console.log('   - Onboarding status:', data?.completed ? 'completed' : 'pending')
      return
    }

    console.log('⚠️  No meta document found. Creating one...')

    // Create meta document with default values
    const metaData = {
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await metaRef.set(metaData)

    console.log('🎉 META DOCUMENT CREATED SUCCESSFULLY!')
    console.log('   - Onboarding status: pending')
    console.log('   - Document ID: onboarding')
    console.log('\n🚀 App is ready for first-time setup!')

  } catch (error) {
    console.error('❌ Error initializing meta document:', error)
    process.exit(1)
  }
}

// Run the script
if (typeof require !== 'undefined' && require.main === module) {
  initMeta()
}

export { initMeta }
