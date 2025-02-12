'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types'
import { ListItem } from './ui/listItem'

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
        const { email: currentUserEmail } = JSON.parse(decodeURIComponent(document?.cookie.split('; ').find(row => row.startsWith('user_token='))?.split('=')[1] || ''));
        setCurrentUser(data.users.find((user: User) => user.email === currentUserEmail))
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        CONGRATULATE THE MOST ACTIVE MEMBERS OF OUR EVENT
      </h1>
      
      <div className="space-y-4">
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
    </div>
  )
}