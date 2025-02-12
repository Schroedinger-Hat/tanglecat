import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'
import { Award } from '@/types'

export async function GET() {
  try {
    const tokenCookie = (await cookies()).get('user_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { eventId, user: { _id: userId } } = JSON.parse(tokenCookie)

    const awards = await client.fetch(`
      *[_type == "award"] | order(points desc) {
        _id,
        name,
        abstract,
        description,
        isSupervised,
        image,
        points
      }
    `, { eventId })

    // Get the user's received awards and total points
    const userWithData = await client.fetch(`
      *[_type == "user" && _id == $userId][0] {
        receivedAwards[] -> {
          _id,
          points
        },
        completedChallenges[] -> {
          _id,
          points
        }
      }
    `, { userId })

    // Calculate total points from received awards
    const receivedAwardsPoints = userWithData?.receivedAwards?.reduce((total: number, award: { points: number }) => 
      total + (award.points || 0), 0) || 0

    // Calculate available points
    const availablePoints = (userWithData?.completedChallenges?.reduce((total: number, challenge: { points: number }) => 
      total + (challenge.points || 0), 0) || 0) - receivedAwardsPoints

    // Add isCompleted flag to each award
    const awardsWithCompletion = awards.map((award: Award) => ({
      ...award,
      isCompleted: userWithData?.receivedAwards?.some((received: { _id: string }) => received._id === award._id)
    }))

    return NextResponse.json({ 
      awards: awardsWithCompletion,
      availablePoints
    })
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json(
      { message: 'Failed to fetch awards' },
      { status: 500 }
    )
  }
} 