import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Report() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Your Dyslexia Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Based on your screening test results, here's a summary of your dyslexia profile:</p>
          <ul className="list-disc list-inside mt-4">
            <li>You may have mild difficulties with letter order recognition</li>
            <li>Reading aloud seems to be a moderate challenge for you</li>
            <li>Spelling appears to be an area where you face significant challenges</li>
          </ul>
          <p className="mt-4">
            We recommend starting with our word-level exercises to build a strong foundation. As you progress, we'll
            introduce more complex tasks to help you improve your reading and writing skills.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/training">Start Training</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

