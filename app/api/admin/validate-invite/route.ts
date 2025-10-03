import { NextRequest, NextResponse } from 'next/server'

import { adminDB } from '@/lib/server/firebaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Find the invitation
    const invitationQuery = await adminDB
      .collection('adminInvitations')
      .where('token', '==', token)
      .where('used', '==', false)
      .limit(1)
      .get()

    if (invitationQuery.empty) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 })
    }

    const invitation = invitationQuery.docs[0].data()

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt.toDate()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await adminDB.collection('users').where('email', '==', invitation.email).limit(1).get()
    if (!existingUser.empty) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
      expiresAt: invitation.expiresAt.toDate().toISOString()
    })

  } catch (error) {
    console.error('Validate invitation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
