export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { MenuItemSchema } from '@/lib/server/schemas'
import { requireAdmin } from '@/lib/server/verifyAdmin'

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
    // Validate that the body is a valid partial of the schema
    const parseResult = MenuItemSchema.partial().safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parseResult.error },
        { status: 400 },
      )
    }

    await adminDB.doc(`items/${id}`).update({
      ...body,
      updatedAt: serverTimestamp(),
    })

    // Invalidate cache when items are updated (especially visibility changes)
    const { cache } = await import('@/lib/server/cache')
    cache.delete('items:visible')
    cache.delete('items:all')

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

    // Invalidate cache
    const { cache } = await import('@/lib/server/cache')
    cache.delete('items:visible')
    cache.delete('items:all')

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Error deleting item' }, { status: 500 })
  }
}
