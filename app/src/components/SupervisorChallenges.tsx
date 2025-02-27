'use client'

import { useState } from 'react'
import { QRCodeScanner } from '@/components/QRCodeScanner'
import { Challenge, Award } from '@/types'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface Props {
  challenges?: Challenge[]
  awards?: Award[]
  type: 'challenge' | 'award'
}

export function SupervisorChallenges({ challenges = [], awards = [], type }: Props) {
  const [selectedItem, setSelectedItem] = useState<Challenge | Award | null>(null)
  const [scanning, setScanning] = useState(false)

  const items = type === 'challenge' ? challenges : awards
  const apiPath = type === 'challenge' ? 'verify-challenge' : 'verify-award'
  const itemIdParam = type === 'challenge' ? 'challengeId' : 'awardId'

  const handleScan = async (result: string) => {
    setScanning(false)
    setSelectedItem(null)
    
    try {
      const url = new URL(result)
      const itemId = url.searchParams.get(itemIdParam)
      const playerEmail = url.searchParams.get('email')
      
      if (!itemId || !playerEmail) {
        toast.error('Invalid QR code')
        return
      }

      const response = await fetch(`/api/admin/${apiPath}?${itemIdParam}=${itemId}&email=${playerEmail}`)

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || `Failed to verify ${type}`)
        return
      }

      toast.success(`${type === 'challenge' ? 'Challenge' : 'Award'} verified successfully!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to verify ${type}`)
    }
  }

  const handleClose = () => {
    setScanning(false)
    setSelectedItem(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mt-4">
        Your Assigned {type === 'challenge' ? 'Challenges' : 'Awards'}
      </h2>

      {scanning && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-semibold mb-4 pr-8">
              Scan QR Code for: {selectedItem.name}
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
        {items.map((item) => (
          <div 
            key={item._id}
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
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
                {'points' in item && (
                  <span className="text-sm text-blue-600 font-semibold">
                    {item.points} pts
                  </span>
                )}
              </div>
              
              <Button
                onClick={() => {
                  setSelectedItem(item)
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