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

    const { email, eventId } = JSON.parse(tokenCookie)

    const player = await client.fetch(`
      *[_type == "user" && email == $email][0] {
        "completedAwards": *[
          _type == "award" && 
          _id in ^.completedAwards[]._ref &&
          eventCode._ref == $eventId
        ]._id
      }
    `, { email, eventId })

    return NextResponse.json({ 
      completedAwards: player?.completedAwards || [] 
    })
  } catch (error) {
    console.error('Error fetching completed awards:', error)
    return NextResponse.json(
      { message: 'Failed to fetch completed awards' },
      { status: 500 }
    )
  }
} 