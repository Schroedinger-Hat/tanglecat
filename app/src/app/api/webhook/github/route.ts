import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import { findPlayerAndChallenge } from '@/lib/sanity.queries'
import {
  GitHubWebhookRequest,
  GitHubWebhookResponse,
  isValidGitHubVerificationData,
  GitHubIssue,
  GitHubPullRequest
} from '@/types/github'

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN

// GitHub API version - matches the pagination documentation
// https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28
const GITHUB_API_VERSION = '2022-11-28'

async function githubFetch(url: string, type: string) {
  const response = await fetch(`https://api.github.com${url}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': GITHUB_API_VERSION
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return type === 'memberships' ? response.ok : response.json()
}

// Helper function to fetch all pages from GitHub API using link headers
// This follows GitHub's best practices for pagination as documented at:
// https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api
// Instead of manually counting pages, we use the 'link' header to navigate between pages
async function githubFetchAllPages(baseUrl: string, type: string): Promise<unknown[]> {
  const allResults: unknown[] = []
  let currentUrl = baseUrl
  let hasMorePages = true

  while (hasMorePages) {
    // Add per_page parameter if not already present
    const url = currentUrl.includes('per_page=')
      ? currentUrl
      : `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}per_page=100`

    const response = await fetch(`https://api.github.com${url}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': GITHUB_API_VERSION
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const results = type === 'memberships' ? response.ok : await response.json()

    if (Array.isArray(results)) {
      allResults.push(...results)

      // Check if there are more pages using the link header
      const linkHeader = response.headers.get('link')
      if (linkHeader && linkHeader.includes('rel="next"')) {
        // Extract the next page URL from the link header
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/)
        if (nextMatch) {
          // Extract just the path from the full URL
          const nextUrl = new URL(nextMatch[1])
          currentUrl = nextUrl.pathname + nextUrl.search
        } else {
          hasMorePages = false
        }
      } else {
        // No next page link, we're done
        hasMorePages = false
      }
    } else {
      // If it's not an array (e.g., for memberships), just return the result
      return results
    }
  }

  return allResults
}

// Helper function to check if a user follows another user
async function checkUserFollowsUser(follower: string, following: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/users/${follower}/following/${following}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': GITHUB_API_VERSION
      }
    })
    return response.status === 204 // 204 means following, 404 means not following
  } catch (error) {
    console.error('Error checking user follow:', error)
    return false
  }
}

// Helper function to check repository contributions
async function checkRepositoryContributions(username: string, owner: string, repo: string, contributionType: string): Promise<boolean> {
  try {
    let hasContributions = false

    switch (contributionType) {
      case 'issues_created':
        const createdIssues = await githubFetchAllPages(`/repos/${owner}/${repo}/issues?creator=${username}&state=all`, 'issues') as GitHubIssue[]
        hasContributions = createdIssues.length > 0
        break

      case 'issues_closed':
        const closedIssues = await githubFetchAllPages(`/repos/${owner}/${repo}/issues?creator=${username}&state=closed`, 'issues') as GitHubIssue[]
        hasContributions = closedIssues.length > 0
        break

      case 'prs_opened':
        const openedPrs = await githubFetchAllPages(`/repos/${owner}/${repo}/pulls?creator=${username}&state=all`, 'pulls') as GitHubPullRequest[]
        hasContributions = openedPrs.length > 0
        break

      case 'prs_merged':
        const mergedPrs = await githubFetchAllPages(`/repos/${owner}/${repo}/pulls?creator=${username}&state=closed`, 'pulls') as GitHubPullRequest[]
        hasContributions = mergedPrs.some((pr: GitHubPullRequest) => pr.merged_at !== null)
        break

      case 'any_contribution':
        // Check for any type of contribution (issues, PRs, commits)
        // For any_contribution, we can limit to first few pages since we just need to find any contribution
        const [anyIssues, anyPrs, commits] = await Promise.all([
          githubFetchAllPages(`/repos/${owner}/${repo}/issues?creator=${username}&state=all&per_page=10`, 'issues') as Promise<GitHubIssue[]>,
          githubFetchAllPages(`/repos/${owner}/${repo}/pulls?creator=${username}&state=all&per_page=10`, 'pulls') as Promise<GitHubPullRequest[]>,
          githubFetchAllPages(`/repos/${owner}/${repo}/commits?author=${username}&per_page=10`, 'commits') as Promise<unknown[]>
        ])
        hasContributions = anyIssues.length > 0 || anyPrs.length > 0 || commits.length > 0
        break

      default:
        throw new Error(`Unsupported contribution type: ${contributionType}`)
    }

    return hasContributions
  } catch (error) {
    console.error('Error checking repository contributions:', error)
    return false
  }
}

export async function POST(request: Request): Promise<NextResponse<GitHubWebhookResponse>> {
  try {
    const body: GitHubWebhookRequest = await request.json()
    const { verificationData, playerEmail, challengeId } = body

    if (!verificationData || !playerEmail || !challengeId) {
      return NextResponse.json(
        { message: 'Invalid request data', success: false },
        { status: 400 }
      )
    }

    // Validate verification data structure
    if (!isValidGitHubVerificationData(verificationData)) {
      return NextResponse.json(
        { message: 'Invalid verification data format', success: false },
        { status: 400 }
      )
    }

    const player = await findPlayerAndChallenge(playerEmail, challengeId)

    if (!player) {
      return NextResponse.json(
        { message: 'Player not found or challenge already completed', success: false },
        { status: 404 }
      )
    }

    // Verify each requirement based on verification type
    const { type, github_username: githubUsername } = verificationData

    try {
      switch (type) {
        case 'org_follow': {
          const { organization } = verificationData
          if (!organization) {
            throw new Error('Organization is required for org_follow type')
          }

          // Check if user follows the organization
          const membership = await githubFetch(`/orgs/${organization}/members/${githubUsername}`, 'memberships')

          if (!membership) {
            return NextResponse.json({
              message: `User ${githubUsername} is not following ${organization}`,
              success: false
            }, { status: 404 })
          }
          break
        }

        case 'user_follow': {
          const { user_to_follow } = verificationData
          if (!user_to_follow) {
            throw new Error('User to follow is required for user_follow type')
          }

          // Check if user follows another user
          const isFollowing = await checkUserFollowsUser(githubUsername, user_to_follow)

          if (!isFollowing) {
            return NextResponse.json({
              message: `User ${githubUsername} is not following ${user_to_follow}`,
              success: false
            }, { status: 404 })
          }
          break
        }

        case 'repo_star': {
          const { organization, repository } = verificationData
          if (!repository) {
            throw new Error('Valid repository (owner/repo) is required for repo_star type')
          }

          // Check if user starred the repository
          const stars = await githubFetchAllPages(`/users/${githubUsername.trim()}/starred`, 'starred') as Array<{ full_name: string }>
          const star = stars.find((star: { full_name: string }) =>
            star.full_name.toLowerCase() === (organization.trim() + '/' + repository.trim()).toLowerCase()
          )

          if (!star) {
            return NextResponse.json({
              message: `User ${githubUsername} has not starred ${repository}`,
              success: false
            }, { status: 404 })
          }
          break
        }

        case 'repo_contribution': {
          const { repository, contribution_type } = verificationData
          if (!repository || !contribution_type) {
            throw new Error('Repository and contribution_type are required for repo_contribution type')
          }

          const [owner, repo] = repository.split('/')
          if (!owner || !repo) {
            throw new Error('Repository must be in format "owner/repo"')
          }

          // Check if user has made contributions to the repository
          const hasContributions = await checkRepositoryContributions(githubUsername, owner, repo, contribution_type)

          if (!hasContributions) {
            return NextResponse.json({
              message: `User ${githubUsername} has not made ${contribution_type} contributions to ${repository}`,
              success: false
            }, { status: 404 })
          }
          break
        }

        case 'repo_watch': {
          const { repository } = verificationData
          if (!repository) {
            throw new Error('Valid repository (owner/repo) is required for repo_watch type')
          }

          // Check if user is watching the repository
          const [watchOwner, watchRepo] = repository.split('/')
          if (!watchOwner || !watchRepo) {
            throw new Error('Repository must be in format "owner/repo"')
          }

          const watchResponse = await fetch(`https://api.github.com/repos/${watchOwner}/${watchRepo}/subscribers/${githubUsername}`, {
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github+json',
              'X-GitHub-Api-Version': GITHUB_API_VERSION
            }
          })

          if (watchResponse.status !== 204) {
            return NextResponse.json({
              message: `User ${githubUsername} is not watching ${repository}`,
              success: false
            }, { status: 404 })
          }
          break
        }

        default:
          throw new Error(`Unsupported verification type: ${type}`)
      }
    } catch (error) {
      console.error('GitHub API Error:', error)
      return NextResponse.json({
        message: `Failed to verify GitHub action: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      }, { status: 500 })
    }

    // All verifications passed, update player's completed challenges
    await client
      .patch(player._id)
      .setIfMissing({ completedChallenges: [], verificationChallengesData: [] })
      .append('completedChallenges', [{
        _key: crypto.randomUUID(),
        _type: 'reference',
        _ref: challengeId
      }])
      .append('verificationChallengesData', [{
        _key: crypto.randomUUID(),
        _type: 'object',
        challenge: {
          _key: crypto.randomUUID(),
          _type: 'reference',
          _ref: challengeId
        },
        verificationData: JSON.stringify(verificationData)
      }])
      .commit()

    return NextResponse.json({
      message: 'GitHub actions verified successfully',
      success: true
    })

  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json(
      { message: 'Failed to process webhook', success: false },
      { status: 500 }
    )
  }
}