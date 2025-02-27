import { client } from './sanity'
import { Challenge } from '@/types'

export async function getChallengeById(id: string): Promise<Challenge | null> {
  return client.fetch(`
    *[_type == "challenge" && _id == $id][0] {
      _id,
      name,
      description,
      instructions,
      points,
      isSupervised,
      isOnline,
      verificationConfigJSON {
        type,
        fields[] {
          type,
          title,
          name,
          description,
          value
        }
      },
      callToAction {
        text,
        url
      },
      startDate,
      endDate,
      playersLimit,
      pointsRequirement,
      webhookUrl
    }
  `, { id })
}

export const queries = {
  findPlayerAndChallenge: `*[_type == "user" && 
    role == "player" && 
    email == $playerEmail &&
    (!defined(completedChallenges) || !($challengeId in completedChallenges[]._ref))
  ][0]`,

  findChallenge: `*[_type == "challenge" && _id == $challengeId][0]`,
}

export async function findPlayerAndChallenge(playerEmail: string, challengeId: string) {
  return client.fetch(queries.findPlayerAndChallenge, { playerEmail, challengeId })
}

export async function findChallenge(challengeId: string) {
  return client.fetch(queries.findChallenge, { challengeId })
} 