import { NextResponse } from "next/server"
import { client } from "@/lib/sanity"
import { findPlayerAndChallenge, findChallenge } from "@/lib/sanity.queries"

// Optional app-level token for Mastodon API — reduces rate-limit risk.
// Attach it to the instance configured below.
const MASTODON_TOKEN = process.env.MASTODON_API_TOKEN

// Maximum number of following-list pages to walk before giving up.
// Each page returns up to 80 accounts, so 12 pages ≈ 960 checked entries.
const MAX_FOLLOWING_PAGES = 12

interface MastodonAccount {
    id: string
    acct: string
    url: string
}

/**
 * Build request headers for the Mastodon API.
 * The token is optional; if absent the request is sent unauthenticated
 * (public endpoints still work, but rate limits are tighter).
 */
function mastodonHeaders(): HeadersInit {
    const headers: HeadersInit = { Accept: "application/json" }
    if (MASTODON_TOKEN) {
        headers["Authorization"] = `Bearer ${MASTODON_TOKEN}`
    }
    return headers
}

/**
 * Resolve a Mastodon username to an account object via the lookup API.
 *
 * Uses GET /api/v1/accounts/lookup which works without authentication and
 * directly returns the account for a given acct handle on the instance.
 *
 * @param username The bare username (no @ prefix, no domain) entered by the player.
 * @param instance The Mastodon instance derived from the challenge's callToAction URL.
 */
async function resolveAccount(username: string, instance: string): Promise<MastodonAccount | null> {
    const lookupUrl = `https://${instance}/api/v1/accounts/lookup?acct=${encodeURIComponent(username)}`

    const response = await fetch(lookupUrl, { headers: mastodonHeaders() })

    if (response.status === 404) return null

    if (!response.ok) {
        throw new Error(
            `Mastodon account lookup failed on ${instance}: ${response.status} ${response.statusText}`,
        )
    }

    return (await response.json()) as MastodonAccount
}

/**
 * Parse the Mastodon instance and username from a profile URL.
 *
 * Supports:
 *  - https://mastodon.social/@nephila   → { instance: "mastodon.social", username: "nephila" }
 *  - https://fosstodon.org/@fosstodon   → { instance: "fosstodon.org", username: "fosstodon" }
 */
function parseProfileUrl(url: string): { instance: string; username: string } | null {
    try {
        const parsed = new URL(url)
        const instance = parsed.hostname
        // pathname is typically "/@username" or "/users/username"
        const match = parsed.pathname.match(/^\/@?([^/]+)/)
        if (!match) return null
        return { instance, username: match[1] }
    } catch {
        return null
    }
}

/**
 * Check whether `followerAccount` (identified by its Mastodon ID on `instance`)
 * is following `targetAcct` (the full qualified acct, e.g. "nephila@mastodon.social"
 * or just "nephila" if on the same instance).
 *
 * Paginates through the follower's following list up to MAX_FOLLOWING_PAGES pages.
 */
async function checkIsFollowing(
    instance: string,
    followerId: string,
    targetAcct: string,
): Promise<boolean> {
    // Normalise targetAcct for comparison — strip leading @
    const normTarget = targetAcct.replace(/^@/, "").toLowerCase()

    let url: string | null =
        `https://${instance}/api/v1/accounts/${followerId}/following?limit=80`
    let pages = 0

    while (url !== null && pages < MAX_FOLLOWING_PAGES) {
        const currentUrl: string = url
        url = null

        const response: Response = await fetch(currentUrl, { headers: mastodonHeaders() })

        if (!response.ok) {
            throw new Error(
                `Mastodon following-list fetch failed: ${response.status} ${response.statusText}`,
            )
        }

        const followingPage = (await response.json()) as MastodonAccount[]

        for (const account of followingPage) {
            const acct = account.acct.toLowerCase()
            // Match "nephila" or "nephila@mastodon.social"
            if (acct === normTarget || acct.split("@")[0] === normTarget.split("@")[0]) {
                // Confirm the instance also matches when both sides have a domain
                const acctDomain = acct.split("@")[1] ?? instance
                const targetDomain = normTarget.split("@")[1] ?? instance
                if (acctDomain === targetDomain) return true
            }
        }

        // Mastodon uses Link headers for cursor-based pagination
        const linkHeader: string | null = response.headers.get("link")
        if (linkHeader) {
            const nextMatch: RegExpMatchArray | null = linkHeader.match(/<([^>]+)>;\s*rel="next"/)
            if (nextMatch) url = nextMatch[1]
        }

        pages++
    }

    return false
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            challengeId,
            playerEmail,
            verificationData,
        }: {
            challengeId?: string
            playerEmail?: string
            verificationData?: Record<string, string>
        } = body

        if (!challengeId || !playerEmail || !verificationData) {
            return NextResponse.json({ message: "Missing required fields", success: false }, { status: 400 })
        }

        const mastodonUsername = verificationData.username?.trim().replace(/^@/, "").split("@")[0]
        if (!mastodonUsername) {
            return NextResponse.json(
                { message: "Mastodon username is required", success: false },
                { status: 400 },
            )
        }

        // Load the challenge so we can extract the target account from callToAction.url
        const challenge = await findChallenge(challengeId)
        if (!challenge) {
            return NextResponse.json({ message: "Challenge not found", success: false }, { status: 404 })
        }

        const callToActionUrl: string | undefined = challenge.callToAction?.url
        if (!callToActionUrl) {
            return NextResponse.json(
                { message: "Challenge has no callToAction URL configured", success: false },
                { status: 500 },
            )
        }

        const targetParsed = parseProfileUrl(callToActionUrl)
        if (!targetParsed) {
            return NextResponse.json(
                { message: "Could not parse target Mastodon profile URL", success: false },
                { status: 500 },
            )
        }

        const { instance: targetInstance, username: targetUsername } = targetParsed
        // Full qualified acct used for comparison
        const targetAcct = `${targetUsername}@${targetInstance}`

        // Verify the player hasn't already completed this challenge
        const player = await findPlayerAndChallenge(playerEmail, challengeId)
        if (!player) {
            return NextResponse.json(
                { message: "Player not found or challenge already completed", success: false },
                { status: 404 },
            )
        }

        // Resolve the submitting user's Mastodon account.
        // We search on the target instance (mastodon.social) which can WebFinger-resolve
        // remote accounts — so cross-instance users are handled correctly.
        let followerAccount: MastodonAccount | null
        try {
            followerAccount = await resolveAccount(mastodonUsername, targetInstance)
        } catch (error) {
            console.error("Mastodon account resolution error:", error)
            return NextResponse.json(
                {
                    message: `Could not resolve Mastodon account "${mastodonUsername}". Make sure you entered the correct username`,
                    success: false,
                },
                { status: 422 },
            )
        }

        if (!followerAccount) {
            return NextResponse.json(
                {
                    message: `Mastodon account "${mastodonUsername}" not found.`,
                    success: false,
                },
                { status: 404 },
            )
        }

        // Check following list
        let isFollowing: boolean
        try {
            isFollowing = await checkIsFollowing(targetInstance, followerAccount.id, targetAcct)
        } catch (error) {
            console.error("Mastodon following-check error:", error)
            return NextResponse.json(
                {
                    message: "Failed to verify Mastodon follow status. Please try again later.",
                    success: false,
                },
                { status: 500 },
            )
        }

        if (!isFollowing) {
            return NextResponse.json(
                {
                    message: `@${followerAccount.acct} does not appear to be following @${targetAcct}. Make sure you follow the account and try again.`,
                    success: false,
                },
                { status: 422 },
            )
        }

        // Follow confirmed — mark the challenge as completed
        await client
            .patch(player._id)
            .setIfMissing({ completedChallenges: [], verificationChallengesData: [] })
            .append("completedChallenges", [
                {
                    _key: crypto.randomUUID(),
                    _type: "reference",
                    _ref: challengeId,
                },
            ])
            .append("verificationChallengesData", [
                {
                    _key: crypto.randomUUID(),
                    _type: "object",
                    challenge: {
                        _key: crypto.randomUUID(),
                        _type: "reference",
                        _ref: challengeId,
                    },
                    verificationData: JSON.stringify({ mastodon_username: followerAccount.acct }),
                },
            ])
            .commit()

        return NextResponse.json({
            message: `Follow verified! @${followerAccount.acct} is following @${targetAcct}.`,
            success: true,
        })
    } catch (error) {
        console.error("Mastodon webhook error:", error)
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 },
        )
    }
}
