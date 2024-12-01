import { NextApiRequest, NextApiResponse } from 'next'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 1, // Per second
})

export default async function rateLimitMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    await rateLimiter.consume(req.ip!)
    next()
  } catch {
    res.status(429).json({ error: 'Too Many Requests' })
  }
}

