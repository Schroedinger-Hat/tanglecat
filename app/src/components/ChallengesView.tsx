'use client'

import { useEffect, useState } from 'react'
import { Challenge } from '@/types'
import { ListItem } from './ui/listItem'

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
          <ListItem
            key={challenge._id}
            type="challenge"
            href={`/challenge/${challenge._id}?completed=${isCompleted}`}
            title={challenge.name}
            description={challenge.description}
            points={challenge.points}
            isCompleted={isCompleted}
          />
        )
      })}
      </div>
    </div>
  )
} 