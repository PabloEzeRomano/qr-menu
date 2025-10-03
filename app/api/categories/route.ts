export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { CategorySchema } from '@/lib/server/schemas'
import { requireAdmin } from '@/lib/server/verifyAdmin'

export async function GET() {
  const snap = await adminDB.collection('categories').get()
  return NextResponse.json(snap.docs.map((d) => ({ key: d.id, ...d.data() })))
}

export async function POST(req: Request) {
  await requireAdmin(req)
  const body = await req.json()
  const parsed = CategorySchema.parse(body)
  const ref = adminDB.doc(`categories/${parsed.key}`)
  await ref.set(
    {
      label: parsed.label,
      icon: parsed.icon,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any,
    { merge: true },
  )
  const doc = await ref.get()
  return NextResponse.json({ key: doc.id, ...doc.data() }, { status: 201 })
}
