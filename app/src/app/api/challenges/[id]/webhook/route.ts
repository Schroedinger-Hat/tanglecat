import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getChallengeById } from "@/lib/sanity.queries"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tokenCookie = (await cookies()).get("user_token")?.value

    if (!tokenCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let email: string
    try {
      const parsedToken = JSON.parse(tokenCookie) as { email?: string }
      if (typeof parsedToken.email !== "string") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }
      email = parsedToken.email
    } catch {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: challengeId } = await params

    const challenge = await getChallengeById(challengeId)

    if (!challenge) {
      return NextResponse.json({ message: "Challenge not found" }, { status: 404 })
    }

    if (!challenge.webhookUrl) {
      return NextResponse.json(
        { message: "No webhook configured for this challenge" },
        { status: 400 },
      )
    }

    const { verificationData } = await request.json()

    // Use the path from webhookUrl but resolve it against the local origin,
    // so we always hit our own API regardless of what host is stored in Sanity.
    const { pathname, search } = new URL(challenge.webhookUrl)
    if (!pathname.startsWith("/api/webhook/")) {
      return NextResponse.json({ message: "Invalid webhook path" }, { status: 400 })
    }

    const { origin } = new URL(request.url)
    const localWebhookUrl = `${origin}${pathname}${search}`

    const webhookResponse = await fetch(localWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId,
        playerEmail: email,
        verificationData,
      }),
    })

    const contentType = webhookResponse.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      const text = await webhookResponse.text()
      console.error("Webhook returned non-JSON response:", text)
      return NextResponse.json(
        { message: "Webhook returned an unexpected response" },
        { status: 502 },
      )
    }
    const data = await webhookResponse.json()
    return NextResponse.json(data, { status: webhookResponse.status })
  } catch (error) {
    console.error("Error proxying webhook:", error)
    return NextResponse.json({ message: "Failed to process webhook" }, { status: 500 })
  }
}