'use client'

import { useState } from 'react'
import { LeaderboardView } from '@/components/LeaderboardView'
import { ChallengesView } from '@/components/ChallengesView'
import { AwardsView } from '@/components/AwardsView'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
    const [activeView, setActiveView] = useState<'challenges' | 'leaderboard' | 'award'>('leaderboard')

    return (
        <div className="max-w-2xl mx-auto pt-8">
            <div className="flex justify-center gap-2 mb-8">
                <Button
                    size='sm'
                    variant={activeView === 'challenges' ? 'accent' : 'default'}
                    onClick={() => setActiveView('challenges')}
                >
                    Challenges
                </Button>
                <Button
                    size='sm'
                    variant={activeView === 'leaderboard' ? 'accent' : 'default'}
                    onClick={() => setActiveView('leaderboard')}
                >
                    Leaderboard
                </Button>
                <Button
                    size='sm'
                    variant={activeView === 'award' ? 'accent' : 'default'}
                    onClick={() => setActiveView('award')}
                >
                    Awards
                </Button>
            </div>

            {activeView === 'leaderboard' ? <LeaderboardView /> : activeView === 'challenges' ? <ChallengesView /> : <AwardsView />}
        </div>
    )
} 