'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Training() {
  const [currentWord, setCurrentWord] = useState('')
  const [similarWords, setSimilarWords] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchNextWord()
  }, [])

  const fetchNextWord = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/training/word?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setCurrentWord(data.word)
        setSimilarWords(data.similarWords)
        setUserInput('')
        setFeedback('')
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error('An error occurred while fetching the next word:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('token')
      const correct = userInput.toLowerCase() === currentWord.toLowerCase()
      const response = await fetch('/api/training/word', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, word: currentWord, correct }),
      })
      const data = await response.json()
      if (response.ok) {
        setFeedback(correct ? 'Correct!' : `Incorrect. The correct word was "${currentWord}".`)
        if (data.nextLevel) {
          router.push(`/training/${data.nextLevel}`)
        } else {
          setTimeout(fetchNextWord, 2000)
        }
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error('An error occurred while submitting the answer:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Word Training</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Type the word you hear:</p>
          <Button onClick={() => new SpeechSynthesisUtterance(currentWord).speak()}>
            Speak Word
          </Button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="mt-4 w-full p-2 border rounded"
          />
          {feedback && <p className="mt-2 text-center">{feedback}</p>}
          <div className="mt-4">
            <p>Similar words:</p>
            <ul className="list-disc list-inside">
              {similarWords.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

