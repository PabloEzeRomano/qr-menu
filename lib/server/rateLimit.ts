// Simple in-memory rate limiter for API routes
const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(identifier: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const entry = requests.get(identifier)

  if (!entry || now > entry.resetTime) {
    requests.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

export function getRateLimitKey(req: Request): string {
  // Use IP address or user agent as identifier
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}
