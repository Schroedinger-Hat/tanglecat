import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { client } from "@/lib/sanity"
import { completeChallenge } from "@/lib/sanity.queries"

export async function POST(request: Request) {
  try {
    const tokenCookie = (await cookies()).get("user_token")?.value

    if (!tokenCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { email, eventId } = JSON.parse(tokenCookie)
    const { challengeId, secretCode } = await request.json()

    if (!challengeId || !secretCode) {
      return NextResponse.json({ message: "Missing challengeId or secretCode" }, { status: 400 })
    }

    // Fetch challenge with verification config
    const challenge = await client.fetch(
      `
      *[_type == "challenge" && _id == $challengeId][0] {
        _id,
        verificationConfigJSON {
          type,
          fields[] {
            type,
            name,
            value
          }
        }
      }
    `,
      { challengeId },
    )

    if (!challenge) {
      return NextResponse.json({ message: "Challenge not found" }, { status: 404 })
    }

    if (challenge.verificationConfigJSON?.type !== "secret-code") {
      return NextResponse.json(
        { message: "This challenge does not use secret code verification" },
        { status: 400 },
      )
    }

    // Find the hidden field containing the secret
    const secretField = challenge.verificationConfigJSON.fields?.find(
      (f: { type: string; name: string }) => f.type === "hidden" && f.name === "secretCode",
    )

    if (!secretField?.value) {
      return NextResponse.json(
        { message: "Challenge is not configured correctly" },
        { status: 500 },
      )
    }

    // Case-insensitive comparison
    if (secretCode.trim().toLowerCase() !== secretField.value.trim().toLowerCase()) {
      return NextResponse.json({ message: "Invalid secret code" }, { status: 400 })
    }

    // Check if player exists and hasn't already completed this challenge
    const player = await client.fetch(
      `
      *[_type == "user" && 
        role == "player" && 
        email == $email && 
        $eventId in eventCodes[]._ref &&
        (!defined(completedChallenges) || !($challengeId in completedChallenges[]._ref))
      ][0]
    `,
      { email, eventId, challengeId },
    )

    if (!player) {
      return NextResponse.json(
        { message: "Player not found or challenge already completed" },
        { status: 400 },
      )
    }

    await completeChallenge(player._id, challengeId)

    return NextResponse.json({ message: "Challenge completed successfully" })
  } catch (error) {
    console.error("Error verifying secret code:", error)
    return NextResponse.json({ message: "Failed to verify secret code" }, { status: 500 })
  }
}
