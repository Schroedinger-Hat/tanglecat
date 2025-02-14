'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Challenge } from '@/types'
import { QRCodeSVG } from 'qrcode.react'
import { X } from 'lucide-react'
import confetti from 'canvas-confetti'
import Image from 'next/image'
import { Button } from './ui/button'
import { Card, CardHeader, CardContent, CardFooter, CardSection } from './ui/Card'
import { Input } from './ui/input.generic'
import { toast } from 'sonner'

interface Props {
  challenge: Challenge
}

export function ChallengeDetail({ challenge }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCompleted = searchParams.get('completed') === 'true'
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isCompleted])

  useEffect(() => {
    // Get user email from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_token='))

    if (token) {
      const { email } = JSON.parse(decodeURIComponent(token.split('=')[1]))
      setUserEmail(email)
    }
  }, [])

  const checkChallengeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/challenges/${challenge._id}/status`)
      const data = await response.json()

      if (data.isCompleted) {
        setShowQR(false)
        router.push(`/challenge/${challenge._id}?completed=true`)
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking challenge status:', error)
      return false
    }
  }, [challenge._id, router])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (showQR) {
      intervalId = setInterval(async () => {
        const isComplete = await checkChallengeStatus()
        if (isComplete && intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      }, 5000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }, [showQR, checkChallengeStatus])

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/verify-challenge?challengeId=${challenge._id}&email=${userEmail}`

  const handleRedeem = async () => {
    if (challenge.isSupervised) {
      setShowQR(true)
      return
    }

    setIsRedeeming(true)
    let challengeVerified = true
    if (challenge.webhookUrl) {
      try {
        const formData = new FormData(document.querySelector('form') as HTMLFormElement)
        const verificationData = Object.fromEntries(formData)
        
        if (Object.keys(verificationData).length === 0) {
          throw new Error('No verification data provided')
        }

        const response = await fetch(challenge.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId: challenge._id, verificationData, playerEmail: userEmail }),
        })

        if (!response.ok) {
          throw new Error('Failed to verify the challenge. If the problem persists, please contact the staff.')
        }
      } catch (error) {
        console.error('Error verifying challenge:', error)
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred')
        challengeVerified = false
      } finally {
        setIsRedeeming(false)
      }
    }

    if (challengeVerified) {
      try {
        const response = await fetch('/api/challenges/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId: challenge._id }),
        })

        if (!response.ok) {
          throw new Error('Failed to redeem challenge')
        }

        router.push(`/challenge/${challenge._id}?completed=true`)
      } catch (error) {
        console.error('Error redeeming challenge:', error)
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setIsRedeeming(false)
      }
    }
  }

  if (isCompleted) {
    return (
      <Card>
        <CardContent className="text-center">
          <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
          <h3 className="text-xl mb-6">CHALLENGE COMPLETE</h3>

          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image
                src="/medal.svg"
                alt="Achievement medal"
                fill
                className="object-contain"
              />
            </div>

            <h4 className="text-lg font-semibold mb-2">
              {challenge.name}
            </h4>

            <div className="flex items-center justify-center text-2xl font-bold text-yellow-500">
              🏆 {challenge.points} Points
            </div>
          </div>

          <Button
            onClick={() => router.push('/dashboard?view=leaderboard')}
            variant="accent"
            className="w-full"
          >
            View Leaderboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold">{challenge.name}</h1>
      </CardHeader>

      <CardContent>
        <div className="text-neutral-600 m-2">
          {challenge.description}
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-yellow-500">🏆</span>
            <span className="ml-2 font-semibold">
              {challenge.points} Points
            </span>
          </div>
          {challenge.playersLimit && (
            <div className="text-sm text-gray-500">
              Limited to {challenge.playersLimit} players
            </div>
          )}
        </div>

        {challenge?.pointsRequirement && challenge?.pointsRequirement > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ You need {challenge.pointsRequirement} points to unlock this challenge
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <CardSection>
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <p className="text-sm text-neutral-600">
            {challenge.instructions ? challenge.instructions : ''}
          </p>
          <p className="text-sm text-neutral-600">
            {challenge.isSupervised
              ? "To complete this challenge, click the button below to generate a QR code and show it to a supervisor."
              : challenge.isOnline
                ? "The challenge is online, so there will be an auto-verification after you've done the challenge requirements. You might need to refresh the page to see the challenge as completed."
                : "To complete this challenge, click the button below once you've finished."}
          </p>

        </CardSection>

        <form>
          {challenge.verificationConfigJSON && challenge.verificationConfigJSON.fields.map((field) => (
            <div key={field.name}>
              {field.type === 'hidden' ? null : <h3 className="font-semibold mb-2">{field.title}:</h3>}
              {field.type === 'hidden' ? null : <label htmlFor={field.name} className="text-sm text-neutral-600 mb-2">{field.description}</label>}
              <Input type={field.type} name={field.name} defaultValue={field?.value || ''} />
            </div>
          ))}
        </form>

        {!challenge.isOnline && (
          <Button
            onClick={handleRedeem}
            disabled={isRedeeming}
            variant="accent"
            className="w-full"
        >
          {isRedeeming ? 'Redeeming...' :
            challenge.isSupervised ? 'Generate Verification QR' : 'Redeem Challenge'}
        </Button>
        )}
      </CardFooter>

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <CardHeader>
              <h3 className="text-lg font-semibold">
                Show this QR code to a supervisor
              </h3>
            </CardHeader>

            <CardContent>
              <div className="bg-white p-4 rounded-lg flex justify-center">
                <QRCodeSVG
                  value={verificationUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="mt-4 text-sm text-gray-600">
                A supervisor will scan this code to verify your challenge completion.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
}