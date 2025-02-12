'use client'

import { useEffect, useState } from 'react'
import { Award } from '@/types'
import { urlForImage } from '@/lib/sanity.image'
import { ListItem } from '@/components/ui/listItem'

interface AwardWithCompletion extends Award {
  isCompleted: boolean
}

export function AwardsView() {
  const [awards, setAwards] = useState<AwardWithCompletion[]>([])
  const [availablePoints, setAvailablePoints] = useState(0)
  // const [completedAwards, setCompletedAwards] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [awardsRes, completedRes] = await Promise.all([
          fetch('/api/awards'),
          // fetch('/api/awards/completed')
        ])
        
        const awardsData = await awardsRes.json()
        // const completedData = await completedRes.json()
        
        setAwards(awardsData.awards)
        setAvailablePoints(awardsData.availablePoints)
        // setCompletedAwards(completedData.completedAwards)
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
        <div className="text-center text-2xl font-bold mb-4">
            Total Points: {availablePoints}
        </div>
        {awards.map((award) => (
          <ListItem
            key={award._id}
            type="award"
            href={award.isCompleted ? `/award/${award._id}?completed=true` : `/award/${award._id}`}
            title={award.name}
            description={award.abstract}
            points={award.points}
            imageUrl={urlForImage(award.image).url()}
            isCompleted={award.isCompleted}
            isSupervised={award.isSupervised}
          />
        ))}
      </div>
    </div>
  )
} 