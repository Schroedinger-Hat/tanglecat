'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Award } from '@/types'
import { CheckCircle2 } from 'lucide-react'
import { urlForImage } from '@/lib/sanity.image'

export function AwardsView() {
  const [awards, setAwards] = useState<Award[]>([])
  const [completedAwards, setCompletedAwards] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [awardsRes, completedRes] = await Promise.all([
          fetch('/api/awards'),
          fetch('/api/awards/completed')
        ])
        
        const awardsData = await awardsRes.json()
        const completedData = await completedRes.json()
        
        setAwards(awardsData.awards)
        setCompletedAwards(completedData.completedAwards)
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
        {awards.map((award) => {
          const isCompleted = completedAwards.includes(award._id)
          
          return (
            <Link
              key={award._id}
              href={`/award/${award._id}`}
              className={`block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow relative
                ${isCompleted ? 'border-2 border-green-500' : ''}`}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={urlForImage(award.image).url()}
                    alt={award.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {award.name}
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {award.abstract}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-blue-600 font-bold">
                        {award.points} pts
                      </span>
                      {award.isSupervised && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          Requires Verification
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 