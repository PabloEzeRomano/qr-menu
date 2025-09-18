import { NextResponse } from 'next/server'

export function addCorsHeaders(response: NextResponse, origin?: string) {
  // Allow specific origins in production, all in development
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.NEXT_PUBLIC_BASE_URL, 'https://qr-menu.vercel.app']
    : ['*']

  const requestOrigin = origin || '*'
  const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(requestOrigin)

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin)
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

export function corsResponse(data: any, status = 200, origin?: string) {
  const response = NextResponse.json(data, { status })
  return addCorsHeaders(response, origin)
}
