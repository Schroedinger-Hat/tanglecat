import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getChallengeById } from "@/lib/sanity.queries"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const tokenCookie = (await cookies()).get("user_token")?.value

        if (!tokenCookie) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { email } = JSON.parse(tokenCookie)
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

        const data = await webhookResponse.json()
        return NextResponse.json(data, { status: webhookResponse.status })
    } catch (error) {
        console.error("Error proxying webhook:", error)
        return NextResponse.json({ message: "Failed to process webhook" }, { status: 500 })
    }
}