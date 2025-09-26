import { auth } from '@/lib/firebase'

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiGetAuth<T>(url: string): Promise<T> {
  const headers = new Headers()
  const token = await auth.currentUser?.getIdToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(url, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiJson<T>(
  url: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body?: any,
): Promise<T> {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  const token = await auth.currentUser?.getIdToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let json: any = {}
  try {
    json = await res.json()
  } catch {}
  if (!res.ok) throw new Error(json?.error || res.statusText)
  return json as T
}
