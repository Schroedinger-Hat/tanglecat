import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const awardId = searchParams.get('awardId')
    const playerEmail = searchParams.get('email')

    const tokenCookie = (await cookies()).get('supervisor_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { email, eventId } = JSON.parse(tokenCookie)

    // Verify supervisor and award assignment
    const supervisor = await client.fetch(`
      *[_type == "user" && 
        role == "supervisor" && 
        email == $email && 
        $awardId in assignedAwards[]._ref &&
        $eventId in eventCodes[]._ref
      ][0]
    `, { 
      email,
      awardId,
      eventId
    })

    if (!supervisor) {
      return NextResponse.json(
        { message: 'Not authorized to verify this award' },
        { status: 403 }
      )
    }

    if (!playerEmail) {
      return NextResponse.json(
        { message: 'Invalid QR code' },
        { status: 400 }
      )
    }

    // Fetch player with their completed challenges and received awards
    const player = await client.fetch(`
      *[_type == "user" && 
        role == "player" && 
        email == $playerEmail
      ][0] {
        ...,
        "completedChallenges": completedChallenges[]-> {
          points
        },
        "receivedAwards": receivedAwards[]-> {
          _id,
          points
        },
        eventCodes
      }
    `, { playerEmail })

    if (!player) {
      return NextResponse.json(
        { message: 'Player not found' },
        { status: 404 }
      )
    }

    // Check if player has access to this event
    if (!player.eventCodes?.some((code: { _ref: string }) => code._ref === eventId)) {
      return NextResponse.json(
        { message: 'Player not registered for this event' },
        { status: 403 }
      )
    }

    // Check if player already has this award
    if (player.receivedAwards?.some((award: { _id: string }) => award._id === awardId)) {
      return NextResponse.json(
        { message: 'Player has already received this award' },
        { status: 400 }
      )
    }

    // Get award details
    const award = await client.fetch(`
      *[_type == "award" && _id == $awardId][0] {
        points
      }
    `, { awardId })

    // Calculate total points from completed challenges
    const totalChallengePoints = player.completedChallenges?.reduce((sum: number, challenge: { points: number }) => 
      sum + (challenge.points || 0), 0) || 0

    // Calculate points already used for awards
    const usedAwardPoints = player.receivedAwards?.reduce((sum: number, award: { points: number }) =>
      sum + (award.points || 0), 0) || 0

    // Calculate available points
    const availablePoints = totalChallengePoints - usedAwardPoints

    if (availablePoints < award.points) {
      return NextResponse.json(
        { message: 'Insufficient points for this award' },
        { status: 400 }
      )
    }

    // Update player's received awards
    await client
      .patch(player._id)
      .setIfMissing({ receivedAwards: [] })
      .append('receivedAwards', [{
        _key: crypto.randomUUID(),
        _type: 'reference',
        _ref: awardId
      }])
      .commit()

    return NextResponse.json({ 
      message: 'Award verified successfully' 
    })

  } catch (error) {
    console.error('Error verifying award:', error)
    return NextResponse.json(
      { message: 'Failed to verify award' },
      { status: 500 }
    )
  }
} 