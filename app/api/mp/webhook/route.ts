import { NextResponse, NextRequest } from 'next/server'
export const runtime = 'nodejs'

import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { mpPayment } from '@/lib/server/mp'

function bad(status = 400, msg = 'bad request') {
  return NextResponse.json({ ok: false, error: msg }, { status })
}

async function verifySignature(req: NextRequest, bodyText: string) {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return true // sin secret, no verificamos firma

  const sig = req.headers.get('x-signature') || ''
  const reqId = req.headers.get('x-request-id') || ''
  const parts = Object.fromEntries(
    sig.split(',').map((kv) =>
      kv
        .trim()
        .split('=')
        .map((x) => x.trim()),
    ),
  ) as Record<string, string>
  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1 || !reqId) return false

  const toSign = `id:${extractPaymentIdFromBody(bodyText)};request-id:${reqId};ts:${ts}`

  const crypto = await import('node:crypto')
  const h = crypto.createHmac('sha256', secret).update(toSign).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(v1))
}

function extractPaymentIdFromBody(txt: string): string {
  try {
    const j = JSON.parse(txt)
    return String(j?.data?.id || j?.resource?.split('/').pop() || '')
  } catch {
    return ''
  }
}

async function handlePaymentUpdate(paymentId: number) {
  const payment = await mpPayment.get({ id: paymentId })
  const { status, external_reference } = payment
  if (!external_reference) return

  const ref = adminDB.doc(`orders/${external_reference}`)
  await ref.set(
    {
      status, // approved | pending | rejected | ...
      paymentId,
      paymentRaw: payment,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || ''
  if ((process.env.MP_WEBHOOK_TOKEN || '') !== token) return bad(401, 'unauthorized')

  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || ''
  if ((process.env.MP_WEBHOOK_TOKEN || '') !== token) return bad(401, 'unauthorized')

  const bodyText = await req.text()
  const ok = await verifySignature(req, bodyText)
  if (!ok) return bad(401, 'invalid signature')

  const body = JSON.parse(bodyText || '{}')
  const topic = body.type || body.topic // 'payment' | 'merchant_order' ...
  const idStr = body?.data?.id || body?.resource?.split('/').pop()
  const idNum = Number(idStr)

  if (topic === 'payment' && Number.isFinite(idNum)) {
    await handlePaymentUpdate(idNum)
  }

  return NextResponse.json({ ok: true })
}
