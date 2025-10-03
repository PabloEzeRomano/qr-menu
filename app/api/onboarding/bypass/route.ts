import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/server/verifyAdmin'

export async function GET(req: NextRequest) {
  try {
    // This endpoint requires authentication
    const { role, canBypass } = await requireAdmin(req)

    // Check if user has bypass permissions (root or admin with bypass flag)
    // For now, all admins can bypass onboarding
    return NextResponse.json({
      role,
      canBypass,
    })
  } catch (error) {
    console.error('Bypass check error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
