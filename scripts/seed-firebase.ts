#!/usr/bin/env tsx

/**
 * Firebase Database Seeder (TypeScript)
 *
 * This script seeds the Firebase Firestore database with menu data from data.json
 *
 * Usage:
 *   yarn seed:firebase:ts
 *   or
 *   npx tsx scripts/seed-firebase.ts
 *
 * Make sure to set your Firebase environment variables before running:
 *   export NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
 *   export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_domain"
 *   export NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
 *   export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
 *   export NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

// Types
interface Category {
  key: string
  label: string
  icon: string
}

interface Filter {
  key: string
  label: string
}

interface DailyMenu {
  title: string
  hours: string
  price: number
  items: string[]
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  tags: string[]
  diet: string[]
  img: string
}

interface MenuData {
  categories: Category[]
  filters: Filter[]
  dailyMenu: DailyMenu
  items: MenuItem[]
}

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
  console.log(process.env)
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
const db = getFirestore(app)

// Load menu data
const dataPath = path.join(__dirname, '..', 'app', 'demo-menu', 'data.json')
let menuData: MenuData

try {
  const dataFile = fs.readFileSync(dataPath, 'utf8')
  menuData = JSON.parse(dataFile)
  console.log('📄 Menu data loaded successfully')
} catch (error) {
  console.error('❌ Error loading menu data:', (error as Error).message)
  process.exit(1)
}

// Seed function
async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seeding...')

  try {
    // Create a batch for atomic writes
    const batch = writeBatch(db)

    // Seed categories
    console.log('📂 Seeding categories...')
    const categoriesRef = collection(db, 'categories')
    menuData.categories.forEach((category) => {
      const categoryDoc = doc(categoriesRef, category.key)
      batch.set(categoryDoc, {
        key: category.key,
        label: category.label,
        icon: category.icon,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    // Seed filters
    console.log('🏷️  Seeding filters...')
    const filtersRef = collection(db, 'filters')
    menuData.filters.forEach((filter) => {
      const filterDoc = doc(filtersRef, filter.key)
      batch.set(filterDoc, {
        key: filter.key,
        label: filter.label,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    // Seed daily menu
    console.log('📅 Seeding daily menu...')
    const dailyMenuRef = doc(db, 'dailyMenu', 'current')
    batch.set(dailyMenuRef, {
      ...menuData.dailyMenu,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Seed menu items
    console.log('🍽️  Seeding menu items...')
    const itemsRef = collection(db, 'items')
    menuData.items.forEach((item) => {
      const itemDoc = doc(itemsRef, item.id)
      batch.set(itemDoc, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    // Commit the batch
    console.log('💾 Committing data to Firestore...')
    await batch.commit()

    console.log('✅ Database seeded successfully!')
    console.log(`   - ${menuData.categories.length} categories`)
    console.log(`   - ${menuData.filters.length} filters`)
    console.log(`   - 1 daily menu`)
    console.log(`   - ${menuData.items.length} menu items`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeder
async function main() {
  try {
    await seedDatabase()
    console.log('🎉 Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main()
}

export { seedDatabase }
