import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'
import { completeChallenge, findChallenge } from '@/lib/sanity.queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const challengeId = searchParams.get('challengeId')
    const playerEmail = searchParams.get('email')

    const tokenCookie = (await cookies()).get('supervisor_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!challengeId || !playerEmail) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const { email, eventId } = JSON.parse(tokenCookie)

    // Verify supervisor and challenge assignment
    const supervisor = await client.fetch(`
      *[_type == "user" && 
        role == "supervisor" && 
        email == $email && 
        $challengeId in assignedChallenges[]._ref &&
        $eventId in eventCodes[]._ref
      ][0]
    `, { 
      email,
      challengeId,
      eventId
    })

    if (!supervisor) {
      return NextResponse.json(
        { message: 'Not authorized to verify this challenge' },
        { status: 403 }
      )
    }

    if (!playerEmail) {
      return NextResponse.json(
        { message: 'Invalid QR code' },
        { status: 400 }
      )
    }

    const player = await client.fetch(`
      *[_type == "user" && 
        role == "player" && 
        $eventId in eventCodes[]._ref && 
        email == $playerEmail &&
        (!defined(completedChallenges) || !($challengeId in completedChallenges[]._ref))
      ][0]
    `, { eventId, playerEmail, challengeId });

    if (!player) {
      return NextResponse.json(
        { message: 'Player not found or challenge already completed' },
        { status: 404 }
      )
    }

    const challenge = await findChallenge(challengeId)

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge not found' },
        { status: 404 }
      )
    }

    await completeChallenge(player._id, challengeId, challenge.verificationConfigJSON)

    return NextResponse.json({ 
      message: 'Challenge verified successfully' 
    })

  } catch (error) {
    console.error('Error verifying challenge:', error)
    return NextResponse.json(
      { message: 'Failed to verify challenge' },
      { status: 500 }
    )
  }
} 