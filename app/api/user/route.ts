import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("dyslexiaAssistant")

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while fetching user data" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, updates } = await req.json()

    const client = await clientPromise
    const db = client.db("dyslexiaAssistant")

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while updating user data" }, { status: 500 })
  }
}

