import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { challengeId, userEmail } = await request.json()

    if (!challengeId || !userEmail) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify if the challenge exists
    const challenge = await client.fetch(`
      *[_type == "challenge" && _id == $challengeId][0]
    `, { challengeId })

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Find the user and check if they haven't completed this challenge yet
    const player = await client.fetch(`
      *[_type == "user" && 
        role == "player" && 
        email == $userEmail &&
        !($challengeId in completedChallenges[]._ref)
      ][0]
    `, { userEmail, challengeId })

    if (!player) {
      return NextResponse.json(
        { message: 'Player not found or challenge already completed' },
        { status: 404 }
      )
    }

    // Update player's completed challenges
    await client
      .patch(player._id)
      .setIfMissing({ completedChallenges: [] })
      .append('completedChallenges', [{
        _key: crypto.randomUUID(),
        _type: 'reference',
        _ref: challengeId
      }])
      .commit()

    return NextResponse.json({ 
      message: 'Challenge completed successfully',
      success: true
    })

  } catch (error) {
    console.error('Form Webhook Error:', error)
    return NextResponse.json(
      { message: 'Failed to process form submission', success: false },
      { status: 500 }
    )
  }
} 