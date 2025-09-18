export const runtime = 'nodejs'

import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { MenuItemSchema } from '@/lib/server/schemas'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doc = await adminDB.doc(`items/${id}`).get()
  if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ id: doc.id, ...doc.data() })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const body = await req.json()
    const allowed = MenuItemSchema.partial().parse(body)

    await adminDB.doc(`items/${id}`).update({
      ...allowed,
      updatedAt: serverTimestamp(),
    } as any)
    const out = await adminDB.doc(`items/${id}`).get()
    if (!out.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ id: out.id, ...out.data() })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    await adminDB.doc(`items/${id}`).delete()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Error deleting item' }, { status: 500 })
  }
}
