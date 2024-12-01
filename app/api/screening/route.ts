import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import natural from 'natural'

export async function POST(req: Request) {
  try {
    const { userId, answers } = await req.json()
    const client = await clientPromise
    const db = client.db("dyslexiaAssistant")

    // Simple scoring system
    const scoreMap = { 'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3, 'Always': 4 }
    const totalScore = Object.values(answers).reduce((sum, answer) => sum + scoreMap[answer as keyof typeof scoreMap], 0)
    const maxPossibleScore = Object.keys(answers).length * 4
    const severityPercentage = (totalScore / maxPossibleScore) * 100

    let severity
    if (severityPercentage < 25) severity = 'Mild'
    else if (severityPercentage < 50) severity = 'Moderate'
    else if (severityPercentage < 75) severity = 'Significant'
    else severity = 'Severe'

    const report = {
      userId,
      answers,
      totalScore,
      severityPercentage,
      severity,
      createdAt: new Date()
    }

    await db.collection("screeningReports").insertOne(report)

    // Generate training words based on severity
    const wordList = natural.WordNet.getBaseWords()
    const trainingWords = wordList
      .sort(() => 0.5 - Math.random())
      .slice(0, severity === 'Mild' ? 50 : severity === 'Moderate' ? 100 : 150)

    await db.collection("users").updateOne(
      { _id: userId },
      { 
        $set: { 
          screeningComplete: true,
          severity,
          currentLevel: 'word',
          trainingWords
        }
      }
    )

    return NextResponse.json({ message: "Screening completed", severity, nextStep: '/training' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred during screening" }, { status: 500 })
  }
}

