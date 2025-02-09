import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity'

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, eventCode } = await request.json()

    // Validate event code
    const event = await client.fetch(
        `*[_type == "eventCode" && code == $code && isActive == true && (!validUntil || validUntil > now())][0]`,
        { code: eventCode }
      )
  
      if (!event) {
        return NextResponse.json(
          { message: 'Invalid or expired event code' },
          { status: 400 }
        )
      }

    // Check if user exists as supervisor
    const supervisor = await client.fetch(
      `*[_type == "user" && role == "supervisor" && email == $email][0]`,
      { email }
    )

    if (supervisor) {
      // Set supervisor cookie
      (await cookies()).set('supervisor_token', JSON.stringify({ 
        email, 
        role: 'supervisor',
        eventId: event._id,
        user: supervisor
      }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })

      return NextResponse.json({ 
        message: 'Logged in successfully',
        role: 'supervisor'
      })
    }

    // Check if user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && role == "player" && email == $email][0]`,
      { email }
    )

    let user = existingUser

    if (!existingUser) {
      // Create new user
      user = await client.create({
        _type: 'user',
        name: `${firstName} ${lastName}`,
        email,
        role: 'player',
        createdAt: new Date().toISOString(),
        eventCodes: [{
          _key: crypto.randomUUID(),
          _type: 'reference',
          _ref: event._id,
        }],
      })
    }

    // Set authentication cookie with both email and event code
    const tokenData = JSON.stringify({ 
        email, 
        role: 'player',
        eventId: event._id,
        user
    });

    (await cookies()).set('user_token', tokenData, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({ 
      message: existingUser ? 'Welcome back!' : 'User registered successfully',
      user,
      email: user.email,
      eventId: event._id,
      role: 'player'
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 