import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const client = await clientPromise
    const db = client.db("dyslexiaAssistant")

    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' })

    return NextResponse.json({ token, userId: user._id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while logging in" }, { status: 500 })
  }
}

