import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

import { z } from 'zod'
import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { mpPreference } from '@/lib/server/mp'
import { rateLimit, getRateLimitKey } from '@/lib/server/rateLimit'

const BodySchema = z.object({
  cart: z.array(z.object({ id: z.string(), qty: z.number().int().positive() })),
  table: z.string().optional(),
})

export async function POST(req: Request) {
  // Rate limiting for payment endpoints
  const rateLimitKey = getRateLimitKey(req)
  if (!rateLimit(rateLimitKey, 5, 60000)) {
    // 5 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { cart, table } = BodySchema.parse(body)

    let total = 0
    const enriched: Array<{ title: string; quantity: number; unit_price: number; id: string }> = []
    for (const { id, qty } of cart) {
      const snap = await adminDB.doc(`items/${id}`).get()
      if (!snap.exists) throw new Error(`Item not found: ${id}`)
      const data = snap.data() as any
      const unit_price = Number(data.price || 0)
      total += unit_price * qty
      enriched.push({ title: data.name, quantity: qty, unit_price, id })
    }

    const orderRef = adminDB.collection('orders').doc()
    await orderRef.set({
      items: enriched,
      total,
      table: table || null,
      status: 'pending',
      createdAt: serverTimestamp(),
    })

    const base = process.env.MP_BACK_URL_BASE || 'http://localhost:3000/menu'
    if (!/^https?:\/\//i.test(base)) {
      throw new Error('MP_BACK_URL_BASE must be an absolute URL')
    }
    const back_urls = {
      success: `${base}?mp_status=success&order=${orderRef.id}`,
      failure: `${base}?mp_status=failure&order=${orderRef.id}`,
      pending: `${base}?mp_status=pending&order=${orderRef.id}`,
    }

    const prefBody: any = {
      external_reference: orderRef.id,
      items: enriched.map((i) => ({
        id: i.id,
        title: i.title,
        quantity: i.quantity,
        unit_price: i.unit_price,
        currency_id: 'ARS',
      })),
      back_urls,
      auto_return: 'approved',
      statement_descriptor: 'QR-MENU',
    }

    const wh = process.env.MP_WEBHOOK_URL
    if (wh) {
      const token = process.env.MP_WEBHOOK_TOKEN ? `?token=${process.env.MP_WEBHOOK_TOKEN}` : ''
      prefBody.notification_url = `${wh}${token}`
    }

    // console.debug('[MP preference] body:', prefBody)
    const pref = await mpPreference.create({ body: prefBody })

    return NextResponse.json({
      orderId: orderRef.id,
      id: pref.id,
      init_point: pref.init_point,
      sandbox_init_point: pref.sandbox_init_point,
    })
  } catch (error: any) {
    console.error('Error creating payment preference:', error)
    return NextResponse.json(
      { error: error.message || 'Error processing payment' },
      { status: 500 },
    )
  }
}
