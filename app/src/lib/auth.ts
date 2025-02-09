import { cookies } from 'next/headers'
import { client } from './sanity'

export async function getUser() {
  const userToken = (await cookies()).get('user_token')?.value
  
  if (!userToken) {
    return null
  }

  try {
    const user = await client.fetch(`
      *[_type == "user" && email == $email][0] {
        ...,
        "eventId": eventCode._ref
      }
    `, { email: userToken })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
} 