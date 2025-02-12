import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ awardId: string }> }
) {
  try {
    const tokenCookie = (await cookies()).get('user_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { eventId } = JSON.parse(tokenCookie)
    const { awardId } = await params

    const award = await client.fetch(`
      *[_type == "award" && _id == $awardId][0] {
        _id,
        name,
        abstract,
        description,
        isSupervised,
        image,
        points,
        requirements[] {
          _key,
          title,
          description
        }
      }
    `, { 
      awardId,
      eventId 
    })

    if (!award) {
      return NextResponse.json(
        { message: 'Award not found' },
        { status: 404 }
      )
    }

    // Check if the award is completed by the current user
    const { user: { _id: userId } } = JSON.parse(tokenCookie)
    const completedAward = await client.fetch(`
      *[_type == "user" && _id == $userId && $awardId in receivedAwards[]._ref][0]`, {
      userId,
      awardId
    })

    return NextResponse.json({
      award,
      isCompleted: !!completedAward
    })
  } catch (error) {
    console.error('Error fetching award:', error)
    return NextResponse.json(
      { message: 'Failed to fetch award' },
      { status: 500 }
    )
  }
}

// Optional: Add POST route for completing awards
export async function POST(request: Request, { params }: { params: Promise<{ awardId: string }> }) {
  try {
    const tokenCookie = (await cookies()).get('user_token')?.value
    
    if (!tokenCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { user: { _id: userId }, eventId } = JSON.parse(tokenCookie)
    const { awardId } = await params

    // Check if award exists and is supervised
    const award = await client.fetch(`
      *[_type == "award" && _id == $awardId][0] {
        isSupervised,
        points
      }
    `, { awardId })

    if (!award) {
      return NextResponse.json(
        { message: 'Award not found' },
        { status: 404 }
      )
    }

    // If award is supervised, return error
    if (award.isSupervised) {
      return NextResponse.json(
        { message: 'This award requires verification' },
        { status: 400 }
      )
    }

    // Check if already completed
    const existingCompletion = await client.fetch(`
      *[_type == "user" && _id == $userId && $awardId in receivedAwards[]._ref][0]`, {
      userId,
      awardId
    })

    if (existingCompletion) {
      return NextResponse.json(
        { message: 'Award already completed' },
        { status: 400 }
      )
    }

    // Create completion record
    await client.create({
      _type: 'award',
      award: {
        _type: 'reference',
        _ref: awardId
      },
      user: {
        _type: 'reference',
        _ref: userId
      },
      event: {
        _type: 'reference',
        _ref: eventId
      },
      completedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      message: 'Award completed successfully',
      points: award.points
    })
  } catch (error) {
    console.error('Error completing award:', error)
    return NextResponse.json(
      { message: 'Failed to complete award' },
      { status: 500 }
    )
  }
} 