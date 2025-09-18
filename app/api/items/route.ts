export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { MenuItemSchema } from '@/server/schemas'

export async function GET() {
  const snap = await adminDB.collection('items').get()
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const parsed = MenuItemSchema.parse(body)

    const ref = await adminDB.collection('items').add({
      ...parsed,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any)
    const doc = await ref.get()
    return NextResponse.json({ id: ref.id, ...doc.data() }, { status: 201 })
  } catch (error) {
    console.error('Error creating item', error)
    return NextResponse.json({ error: 'Error creating item' }, { status: 500 })
  }
}
