import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
    const tokenCookie = (await cookies()).get('player_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { email } = JSON.parse(tokenCookie)

    // Get player's completed challenges
    const player = await client.fetch(`
      *[_type == "user" && email == $email][0] {
        "completedChallenges": completedChallenges[]._ref
      }
    `, { email })

    return NextResponse.json({ 
      completedChallenges: player?.completedChallenges || [] 
    })
  } catch (error) {
    console.error('Error fetching completed challenges:', error)
    return NextResponse.json(
      { message: 'Failed to fetch completed challenges' },
      { status: 500 }
    )
  }
} 