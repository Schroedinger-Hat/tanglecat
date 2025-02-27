'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types'
import { ListItem } from './ui/listItem'
import CurveIllustration from './ui/curveIllustration'

export function LeaderboardView() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
      async function fetchLeaderboard() {
       try {
        const response = await fetch('/api/leaderboard')
        const data = await response.json()
        setUsers(data.users)
        const { user } = JSON.parse(decodeURIComponent(document?.cookie.split('; ').find(row => row.startsWith('user_token='))?.split('=')[1] || ''));
        setCurrentUser(data.users.find((u: User) => u._id === user._id) || null)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 space-y-3 max-h-[70vh] p-4 overflow-y-auto">
        {users.map((user, index) => (
          <ListItem
            key={user._id}
            type="leaderboard"
            position={index + 1}
            name={user.name}
            points={user.totalPoints}
            isCurrentUser={user._id === currentUser?._id}
          />
        ))}
      </div>
      {currentUser && (
        <div className="fixed bg-yellow-400 bottom-0 left-0 right-0">
          <div className="rotate-180 -mt-2">
            <CurveIllustration />
          </div>
          <div className="max-w-2xl mx-auto p-2">
            <ListItem
              type="leaderboard"
              position={users.findIndex(u => u._id === currentUser._id) + 1}
              name={currentUser.name}
              points={currentUser.totalPoints}
              isCurrentUser={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}