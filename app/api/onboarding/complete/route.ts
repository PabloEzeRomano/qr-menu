import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await requireAdmin(req)
    const body = await req.json()

    await adminDB.doc(`meta/onboarding`).set({
      completed: body.completed || true,
      completedAt: serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 })
  }
}
