'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { LeaderboardView } from '@/components/LeaderboardView'
import { ChallengesView } from '@/components/ChallengesView'
import { AwardsView } from '@/components/AwardsView'
import { Button } from '@/components/ui/button'

type ViewType = 'challenges' | 'leaderboard' | 'award'

function DashboardNav() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const view = (searchParams.get('view') as ViewType) || 'leaderboard'

    const setView = (newView: ViewType) => {
        const params = new URLSearchParams(searchParams)
        params.set('view', newView)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="max-w-2xl mx-auto pt-4">
            <div className="flex justify-center gap-2 mb-4">
                <Button
                    size='sm'
                    variant={view === 'challenges' ? 'accent' : 'default'}
                    onClick={() => setView('challenges')}
                >
                    Challenges
                </Button>
                <Button
                    size='sm'
                    variant={view === 'leaderboard' ? 'accent' : 'default'}
                    onClick={() => setView('leaderboard')}
                >
                    Leaderboard
                </Button>
                <Button
                    size='sm'
                    variant={view === 'award' ? 'accent' : 'default'}
                    onClick={() => setView('award')}
                >
                    Awards
                </Button>
            </div>

            {view === 'leaderboard' && <LeaderboardView />}
            {view === 'challenges' && <ChallengesView />}
            {view === 'award' && <AwardsView />}
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardNav />
        </Suspense>
    )
}