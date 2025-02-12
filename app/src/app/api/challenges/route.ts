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

    // Fetch challenges for the event
    const challenges = await client.fetch(`
      *[_type == "challenge" && 
        eventCode._ref == $eventId && 
        startDate <= now() && 
        endDate >= now()
      ] {
        _id,
        name,
        description,
        points,
        isSupervised,
        isOnline,
        startDate,
        endDate,
        playersLimit,
        pointsRequirement
      }
    `, { eventId })

    return NextResponse.json({ challenges })
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { message: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
} 