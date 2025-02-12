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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [awardsRes] = await Promise.all([
          fetch('/api/awards'),
        ])
        
        const awardsData = await awardsRes.json()
        
        setAwards(awardsData.awards)
        setAvailablePoints(awardsData.availablePoints)
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
        <div className="text-center text-white text-2xl font-bold mb-4 filter drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            Available Points: {availablePoints}
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