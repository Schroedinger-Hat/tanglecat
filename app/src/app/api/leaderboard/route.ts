import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
    const tokenCookie = (await cookies()).get('user_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { eventId } = JSON.parse(tokenCookie)

    // Get event ID from code
    const event = await client.fetch(
      `*[_type == "eventCode" && _id == $eventId][0]._id`,
      { eventId }
    )

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      )
    }

    // Fetch users with their completed challenges and calculate total points
    const users = await client.fetch(`
      *[_type == "user" && role == "player" && $eventId in eventCodes[]._ref] {
        _id,
        name,
        "completedChallenges": *[
          _type == "challenge" && 
          _id in ^.completedChallenges[]._ref && 
          eventCode._ref == $eventId
        ] {
          _id,
          points
        },
        "totalPoints": math::sum(
          *[
            _type == "challenge" && 
            _id in ^.completedChallenges[]._ref && 
            eventCode._ref == $eventId
          ].points
        )
      } | order(totalPoints desc)
    `, { eventId })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { message: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
} 