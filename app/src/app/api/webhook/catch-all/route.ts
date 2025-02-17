import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { challengeId, playerEmail, verificationData } = await request.json()

    // Check for required fields
    if (!challengeId || !playerEmail) {
      return NextResponse.json(
        { message: 'Missing required fields: challengeId and playerEmail' },
        { status: 400 }
      )
    }

    // Check if there are any validation fields
    if (Object.keys(verificationData).length === 0) {
      return NextResponse.json(
        { message: 'No validation data provided' },
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
        email == $playerEmail &&
        !($challengeId in completedChallenges[]._ref)
      ][0]
    `, { playerEmail, challengeId })

    if (!player) {
      return NextResponse.json(
        { message: 'Player not found or challenge already completed' },
        { status: 404 }
      )
    }

    // Update player's completed challenges and validation data
    await client
      .patch(player._id)
      .setIfMissing({ 
        completedChallenges: [], 
        verificationChallengesData: [] 
      })
      .append('completedChallenges', [{
        _key: crypto.randomUUID(),
        _type: 'reference',
        _ref: challengeId
      }])
      .append('verificationChallengesData', [{
        _key: crypto.randomUUID(),
        _type: 'object',
        challenge: {
          _key: crypto.randomUUID(),
          _type: 'reference',
          _ref: challengeId
        },
        verificationData: JSON.stringify(verificationData)
      }])
      .commit()

    return NextResponse.json({ 
      message: 'Challenge completed and validation data saved successfully',
      success: true
    })

  } catch (error) {
    console.error('Catch-all Webhook Error:', error)
    return NextResponse.json(
      { message: 'Failed to process webhook', success: false },
      { status: 500 }
    )
  }
} 