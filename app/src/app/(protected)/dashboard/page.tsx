'use client'

import { useState } from 'react'
import { LeaderboardView } from '@/components/LeaderboardView'
import { ChallengesView } from '@/components/ChallengesView'

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<'challenges' | 'leaderboard'>('leaderboard')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveView('challenges')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'challenges'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            Challenges
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'leaderboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {activeView === 'leaderboard' ? <LeaderboardView /> : <ChallengesView />}
      </div>
    </div>
  )
} 