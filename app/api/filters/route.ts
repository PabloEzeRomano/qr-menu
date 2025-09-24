// app/api/filters/route.ts
import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
import { z } from 'zod'
import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { FilterSchema } from '@/lib/server/schemas'

const Payload = z.object({ filters: z.array(FilterSchema).min(0) })

const PATH = 'meta/filters'

export async function GET() {
  const snap = await adminDB.doc(PATH).get()
  return NextResponse.json(snap.data()?.filters ?? [])
}

export async function POST(req: Request) {
  await requireAdmin(req)
  const data = Payload.parse(await req.json())
  await adminDB.doc(PATH).set({ ...data, updatedAt: serverTimestamp() }, { merge: true })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
  await requireAdmin(req)
  const data = Payload.parse(await req.json())
  await adminDB.doc(PATH).set({ ...data, updatedAt: serverTimestamp() }, { merge: true })
  return NextResponse.json({ ok: true })
}
