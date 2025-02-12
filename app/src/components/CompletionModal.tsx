'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Challenge } from '@/types'
import confetti from 'canvas-confetti'
import Image from 'next/image'
import { Button } from './ui/button'

interface Props {
  isOpen: boolean
  onClose: () => void
  challenge: Challenge
}

export function CompletionModal({ isOpen, onClose, challenge }: Props) {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl relative z-10 
              max-w-sm w-full mx-4"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <h3 className="text-xl mb-6">CHALLENGE COMPLETE</h3>
              
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-4">
                  <Image
                    src="/medal.svg"
                    alt="Achievement medal"
                    className="w-full h-full"
                    width={100}
                    height={100}
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
                onClick={onClose}
                variant="accent"
              >
                View Leaderboard
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 