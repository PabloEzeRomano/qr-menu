import { NextRequest, NextResponse } from 'next/server'

import { adminAuth,adminDB } from '@/lib/server/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    // Find the invitation
    const invitationQuery = await adminDB
      .collection('adminInvitations')
      .where('token', '==', token)
      .where('used', '==', false)
      .limit(1)
      .get()

    if (invitationQuery.empty) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 })
    }

    const invitationDoc = invitationQuery.docs[0]
    const invitation = invitationDoc.data()

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt.toDate()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 })
    }

    // Create user account
    const userRecord = await adminAuth.createUser({
      email: invitation.email,
      password: password,
      emailVerified: true, // Auto-verify since they're invited by an admin
    })

    // Create admin document
    await adminDB.collection('admins').doc(userRecord.uid).set({
      email: invitation.email,
      role: 'admin',
      createdAt: new Date(),
      invitedBy: invitation.createdBy,
      invitedByName: invitation.createdByName,
    })

    // Mark invitation as used
    await invitationDoc.ref.update({
      used: true,
      usedAt: new Date(),
      usedBy: userRecord.uid,
    })

    // Generate custom token for immediate login
    const customToken = await adminAuth.createCustomToken(userRecord.uid, { role: 'admin' })

    return NextResponse.json({
      message: 'Account created successfully',
      customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
      }
    })

  } catch (error: any) {
    console.error('Accept invitation error:', error)

    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 })
    }

    if (error.code === 'auth/weak-password') {
      return NextResponse.json({ error: 'Password is too weak' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
