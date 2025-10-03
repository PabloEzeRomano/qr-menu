import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

import { adminAuth,adminDB } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

export async function POST(req: NextRequest) {
  try {
    // Always require authentication now (root or admin)
    const adminUser = await requireAdmin(req)
    const adminUserRecord = await adminAuth.getUser(adminUser.uid)
    // const restaurant = await adminDB.collection('restaurants').where('adminEmail', '==', adminUserRecord.email).limit(1).get()
    // if (restaurant.empty) {
    //   return NextResponse.json({ error: 'Restaurant not found' }, { status: 400 })
    // }

    const { email, restaurantName } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await adminDB.collection('users').where('email', '==', email).limit(1).get()
    if (!existingUser.empty) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Check if invitation already exists and is not expired
    const existingInvitation = await adminDB
      .collection('adminInvitations')
      .where('email', '==', email)
      .where('used', '==', false)
      .where('expiresAt', '>', new Date())
      .limit(1)
      .get()

    if (!existingInvitation.empty) {
      return NextResponse.json({ error: 'Invitation already sent' }, { status: 400 })
    }

    // Generate secure token
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store invitation in database
    await adminDB.collection('adminInvitations').add({
      email,
      token,
      createdAt: new Date(),
      expiresAt,
      used: false,
      createdBy: adminUser.uid,
      createdByName: adminUserRecord.displayName || adminUserRecord.email,
    })

    // Send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/admin/invite/${token}`

    try {
      const resend = getResend()
      await resend.emails.send({
        from: 'Pablo de QR Menu <hola@send.gemm-apps.com>',
        to: [email],
        subject: 'Invitación para administrar QR Menu',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Invitación para administrar ${restaurantName || 'QR Menu'}</h2>
            <p>Hola,</p>
            <p>Fuiste invitado por <strong>${adminUserRecord.displayName || adminUserRecord.email}</strong> para administrar el panel de ${restaurantName || 'QR Menu'}.</p>
            <p>Para aceptar la invitación, hacé click en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Aceptar Invitación
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">Este enlace expirará en 24 horas.</p>
            <p style="color: #666; font-size: 14px;">Si no solicitaste esta invitación, podés ignorar este email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">Este es un email automático, por favor no respondas.</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Delete the invitation if email fails
      await adminDB.collection('adminInvitations').where('token', '==', token).get().then((snapshot: any) => {
        snapshot.docs.forEach((doc: any) => doc.ref.delete())
      })
      return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Invitation sent successfully',
      expiresAt: expiresAt.toISOString()
    })

  } catch (error) {
    console.error('Invitation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
