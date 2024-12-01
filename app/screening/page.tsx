'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const questions = [
  {
    id: 1,
    question: 'Do you often confuse the order of letters in words?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 2,
    question: 'Do you find it challenging to read aloud?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  {
    id: 3,
    question: 'Do you struggle with spelling?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
  },
  // Add more questions as needed
]

export default function Screening() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const router = useRouter()

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // TODO: Send answers to backend for analysis
      console.log('Screening test completed:', answers)
      router.push('/report')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Dyslexia Screening Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{questions[currentQuestion].question}</p>
          <RadioGroup onValueChange={handleAnswer} value={answers[questions[currentQuestion].id]}>
            {questions[currentQuestion].options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleNext} disabled={!answers[questions[currentQuestion].id]}>
            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

