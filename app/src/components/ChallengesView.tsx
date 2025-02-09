'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Challenge } from '@/types'
import { CheckCircle2 } from 'lucide-react'

export function ChallengesView() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [challengesRes, completedRes] = await Promise.all([
          fetch('/api/challenges'),
          fetch('/api/challenges/completed')
        ])
        
        const challengesData = await challengesRes.json()
        const completedData = await completedRes.json()
        
        setChallenges(challengesData.challenges)
        setCompletedChallenges(completedData.completedChallenges)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="grid gap-4">
        {challenges.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge._id)
          
          return (
            <Link
              key={challenge._id}
              href={`/challenge/${challenge._id}?completed=${isCompleted}`}
              className={`block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow relative
                ${isCompleted ? 'border-2 border-green-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    {challenge.name}
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {challenge.description}
                  </p>
                </div>
                <span className="text-blue-600 font-bold">
                  {challenge.points} pts
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 