export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { CategorySchema } from '@/lib/server/schemas'

export async function PATCH(req: Request, { params }: { params: Promise<{ key: string }> }) {
  await requireAdmin(req)
  const { key } = await params
  const body = await req.json()
  // Validate that the body is a valid partial of the schema
  const parseResult = CategorySchema.partial().safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid data', details: parseResult.error }, { status: 400 })
  }

  await adminDB.doc(`categories/${key}`).update({
    ...body,
    updatedAt: serverTimestamp(),
  })
  const doc = await adminDB.doc(`categories/${key}`).get()
  return NextResponse.json({ key: doc.id, ...doc.data() })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ key: string }> }) {
  await requireAdmin(req)
  const { key: paramKey } = await params

  const { searchParams } = new URL(req.url)
  const forceDelete = searchParams.get('forceDelete') === 'true'
  const key = decodeURIComponent(paramKey)

  const snap = await adminDB.collection('items').where('category', '==', key).get()

  if (!forceDelete && !snap.empty) {
    return NextResponse.json(
      {
        error: 'Category has items',
        hint: 'Call DELETE with ?forceDelete=true to remove category and its items',
        count: snap.size,
      },
      { status: 409 },
    )
  }

  if (forceDelete && !snap.empty) {
    const docs = snap.docs
    for (let i = 0; i < docs.length; i += 500) {
      const chunk = docs.slice(i, i + 500)
      const batch = adminDB.batch()
      chunk.forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }
  }

  await adminDB.doc(`categories/${key}`).delete()

  return NextResponse.json({ ok: true, deletedItems: forceDelete ? snap.size : 0 })
}
