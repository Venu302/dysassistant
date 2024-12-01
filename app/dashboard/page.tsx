'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (!token || !userId) {
      router.push('/login')
    } else {
      // Fetch user data
      fetch(`/api/user?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error('Error fetching user data:', err))
    }
  }, [])

  const handleStartScreening = () => {
    router.push('/screening')
  }

  const handleStartTraining = () => {
    router.push('/training')
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome, {user.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          {!user.screeningComplete ? (
            <p>You haven't completed the screening test yet. Take the test to get personalized training.</p>
          ) : (
            <p>Your current training level: {user.currentLevel}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!user.screeningComplete ? (
            <Button onClick={handleStartScreening}>Start Screening</Button>
          ) : (
            <Button onClick={handleStartTraining}>Continue Training</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

