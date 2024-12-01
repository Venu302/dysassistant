import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default function jwtMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' })
      }

      req.user = user
      next()
    })
  } else {
    res.status(401).json({ error: 'Authorization token required' })
  }
}

