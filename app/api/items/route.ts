export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { adminDB, serverTimestamp } from '@/lib/server/firebaseAdmin'
import { requireAdmin } from '@/lib/server/verifyAdmin'
import { MenuItemSchema } from '@/server/schemas'
import { cacheOrFetch } from '@/lib/server/cache'
import { corsResponse } from '@/lib/server/cors'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const showAll = searchParams.get('showAll') === 'true'

    const cacheKey = showAll ? 'items:all' : 'items:visible'

    const data = await cacheOrFetch(
      cacheKey,
      async () => {
        const query = showAll
          ? adminDB.collection('items')
          : adminDB.collection('items').where('isVisible', '==', true)
        const snap = await query.get()
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      },
      180000, // 3 minutes cache
    )

    return corsResponse(data, 200, req.headers.get('origin') || undefined)
  } catch (error) {
    console.error('Error fetching items:', error)
    return corsResponse({ error: 'Error fetching items' }, 500)
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const parsed = MenuItemSchema.parse(body)

    const ref = await adminDB.collection('items').add({
      ...parsed,
      // isVisible: true, // New items are visible by default
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any)

    // Invalidate cache when items are modified
    const { cache } = await import('@/lib/server/cache')
    cache.delete('items:visible')
    cache.delete('items:all')

    const doc = await ref.get()
    return corsResponse({ id: ref.id, ...doc.data() }, 201, req.headers.get('origin') || undefined)
  } catch (error) {
    console.error('Error creating item', error)
    return corsResponse({ error: 'Error creating item' }, 500)
  }
}
