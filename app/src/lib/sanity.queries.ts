import { client } from './sanity'
import { Challenge } from '@/types'

export async function getChallengeById(id: string): Promise<Challenge | null> {
  return client.fetch(`
    *[_type == "challenge" && _id == $id][0] {
      _id,
      name,
      description,
      points,
      isSupervised,
      isOnline,
      startDate,
      endDate,
      playersLimit,
      pointsRequirement,
      webhookUrl
    }
  `, { id })
} 