export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { z } from 'zod'

const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']),
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const orderRef = adminDB.doc(`orders/${id}`)
    const doc = await orderRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    const orderData = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate?.() || doc.data()?.createdAt,
      updatedAt: doc.data()?.updatedAt?.toDate?.() || doc.data()?.updatedAt,
    }

    return NextResponse.json(orderData)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Error al obtener la orden' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const { id } = await params
    const parsed = UpdateOrderSchema.parse(body)

    const orderRef = adminDB.doc(`orders/${id}`)
    const doc = await orderRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    await orderRef.update({
      status: parsed.status,
      updatedAt: serverTimestamp(),
    })

    const updatedDoc = await orderRef.get()
    const updatedOrder = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate?.() || updatedDoc.data()?.createdAt,
      updatedAt: updatedDoc.data()?.updatedAt?.toDate?.() || updatedDoc.data()?.updatedAt,
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Error al actualizar la orden' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)

    const { id } = await params
    const orderRef = adminDB.doc(`orders/${id}`)
    const doc = await orderRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    await orderRef.delete()

    return NextResponse.json({ message: 'Orden eliminada correctamente' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Error al eliminar la orden' }, { status: 500 })
  }
}
