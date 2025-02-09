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

    const awards = await client.fetch(`
      *[_type == "award"] | order(points desc) {
        _id,
        name,
        abstract,
        description,
        isSupervised,
        image,
        points
      }
    `, { eventId })

    return NextResponse.json({ awards })
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json(
      { message: 'Failed to fetch awards' },
      { status: 500 }
    )
  }
} 