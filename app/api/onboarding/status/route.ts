import { adminDB } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    await requireAdmin(req)

    const doc = await adminDB.doc(`meta/onboarding`).get()
    const completed = doc.exists ? doc.data()?.completed || false : false

    return NextResponse.json({ completed })
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return NextResponse.json({ error: 'Failed to check onboarding status' }, { status: 500 })
  }
}
