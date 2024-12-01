import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import natural from 'natural'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("dyslexiaAssistant")

    const user = await db.collection("users").findOne({ _id: userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.trainingWords || user.trainingWords.length === 0) {
      return NextResponse.json({ error: "No training words available" }, { status: 404 })
    }

    const currentWord = user.trainingWords[0]
    const phoneticRepresentation = natural.Metaphone.process(currentWord)
    const similarWords = natural.WordNet.getBaseWords()
      .filter(word => natural.Metaphone.process(word) === phoneticRepresentation)
      .filter(word => word !== currentWord)
      .slice(0, 3)

    return NextResponse.json({ word: currentWord, similarWords })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while fetching training data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, word, correct } = await req.json()
    const client = await clientPromise
    const db = client.db("dyslexiaAssistant")

    await db.collection("users").updateOne(
      { _id: userId },
      { 
        $pop: { trainingWords: -1 },
        $push: { 
          completedWords: {
            word,
            correct,
            completedAt: new Date()
          }
        }
      }
    )

    const user = await db.collection("users").findOne({ _id: userId })
    if (user.trainingWords.length === 0) {
      await db.collection("users").updateOne(
        { _id: userId },
        { $set: { currentLevel: 'phrase' } }
      )
      return NextResponse.json({ message: "Word training completed", nextLevel: 'phrase' })
    }

    return NextResponse.json({ message: "Progress saved" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred while saving progress" }, { status: 500 })
  }
}

