'use client'

import { useState } from 'react'
import { QRCodeScanner } from '@/components/QRCodeScanner'
import { Challenge } from '@/types'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface Props {
  challenges: Challenge[]
}

export function SupervisorChallenges({ challenges }: Props) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [scanning, setScanning] = useState(false)

  const handleScan = async (result: string) => {
    setScanning(false)
    setSelectedChallenge(null)
    
    try {
      // Extract challengeId from QR code URL
      const url = new URL(result)
      const challengeId = url.searchParams.get('challengeId')
      const playerEmail = url.searchParams.get('email')
      
      if (!challengeId || !playerEmail) {
        toast.error('Invalid QR code')
        return
      }

      const response = await fetch(`/api/admin/verify-challenge?challengeId=${challengeId}&email=${playerEmail}`)

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Failed to verify challenge')
        return
      }

      // Show success message and close scanner
      toast.success('Challenge verified successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify challenge')
    }
  }

  const handleClose = () => {
    setScanning(false)
    setSelectedChallenge(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Assigned Challenges</h2>

      {scanning && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-semibold mb-4 pr-8">
              Scan QR Code for: {selectedChallenge.name}
            </h3>
            
            <QRCodeScanner
              onScan={handleScan}
              onClose={handleClose}
            />

            <Button
              onClick={handleClose}
              className="mt-4 w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        {challenges.map((challenge) => (
          <div 
            key={challenge._id}
            className="
                block
                w-full
                p-4
                bg-neutral-50
                text-neutral-950
                border-2
                border-neutral-950
                rounded-2xl
                shadow-[4px_4px_0px_0px_rgba(23,23,23)]
                transition-all
                duration-200
                
                hover:shadow-[2px_2px_0px_0px_rgba(23,23,23)]
                hover:translate-x-[2px]
                hover:translate-y-[2px]"
           >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{challenge.name}</h3>
                <p className="text-sm text-gray-600">
                  {challenge.description}
                </p>
                <span className="text-sm text-blue-600 font-semibold">
                  {challenge.points} pts
                </span>
              </div>
              
              <Button
                onClick={() => {
                  setSelectedChallenge(challenge)
                  setScanning(true)
                }}
                variant="accent"
              >
                Scan QR
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 