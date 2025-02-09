import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tokenCookie = (await cookies()).get('user_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { email, eventId } = JSON.parse(tokenCookie)

    // Check if challenge is completed
    const player = await client.fetch(`
      *[_type == "user" && 
        role == "player" && 
        email == $email && 
        $eventId in eventCodes[]._ref
      ][0] {
        "isCompleted": count(
          completedChallenges[
            _ref == $challengeId
          ]
        ) > 0
      }
    `, { 
      email,
      challengeId: (await params).id,
      eventId
    })

    return NextResponse.json({ 
      isCompleted: player?.isCompleted || false 
    })
  } catch (error) {
    console.error('Error checking challenge status:', error)
    return NextResponse.json(
      { message: 'Failed to check challenge status' },
      { status: 500 }
    )
  }
} 