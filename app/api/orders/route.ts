export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'

const OrderItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
})

const OrderSchema = z.object({
  items: z.array(OrderItemSchema),
  total: z.number().positive(),
  table: z.string().nullable().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional(),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const limit = url.searchParams.get('limit')

    let query = adminDB.collection('orders').orderBy('createdAt', 'desc')

    if (status && status !== 'all') {
      query = query.where('status', '==', status)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const snap = await query.get()
    const orders = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }))

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Error al obtener las órdenes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const parsed = OrderSchema.parse(body)

    const orderRef = adminDB.collection('orders').doc()
    await orderRef.set({
      items: parsed.items,
      total: parsed.total,
      table: parsed.table || null,
      status: parsed.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const doc = await orderRef.get()
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Error al crear la orden' }, { status: 500 })
  }
}
