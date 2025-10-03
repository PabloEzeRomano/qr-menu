import { NextRequest, NextResponse } from 'next/server'

import { adminDB } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await requireAdmin(req)

    // Fetch invitations (you might want to add pagination later)
    const invitationsSnapshot = await adminDB
      .collection('adminInvitations')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const invitations = invitationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      expiresAt: doc.data().expiresAt.toDate(),
    }))

    return NextResponse.json({ invitations })

  } catch (error) {
    console.error('Fetch invitations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
