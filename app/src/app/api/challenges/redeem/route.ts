import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { challengeId } = await request.json()
    const tokenCookie = (await cookies()).get('user_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { email, eventId } = JSON.parse(tokenCookie)

    // Get player
    const user = await client.fetch(
      `*[_type == "user" && email == $email && $eventId in eventCodes[]._ref][0]`,
      { email, eventId }
    )

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Update player's completed challenges
    await client
      .patch(user._id)
      .setIfMissing({ completedChallenges: [] })
      .append('completedChallenges', [
        {_key: crypto.randomUUID(), _type: 'reference', _ref: challengeId }
      ])
      .commit()

    return NextResponse.json({ 
      message: 'Challenge redeemed successfully' 
    })
  } catch (error) {
    console.error('Error redeeming challenge:', error)
    return NextResponse.json(
      { message: 'Failed to redeem challenge' },
      { status: 500 }
    )
  }
} 