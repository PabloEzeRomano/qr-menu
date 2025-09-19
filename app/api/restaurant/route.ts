import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { RestaurantSchema } from '@/lib/server/schemas'
import { NextResponse } from 'next/server'

const PATH = 'meta/restaurant'

export async function GET() {
  const doc = await adminDB.doc(PATH).get()
  return NextResponse.json(doc.exists ? doc.data() : null)
}

export async function PATCH(req: Request) {
  await requireAdmin(req)
  const body = await req.json()
  const patch = RestaurantSchema.partial().parse(body)
  await adminDB.doc(PATH).set({ ...patch, updatedAt: serverTimestamp() }, { merge: true })
  const out = await adminDB.doc(PATH).get()
  return NextResponse.json(out.data())
}
