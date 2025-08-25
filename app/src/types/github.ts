// GitHub verification types for the enhanced integration

export type GitHubVerificationType =
  | 'org_follow'
  | 'user_follow'
  | 'repo_star'
  | 'repo_watch'
  | 'repo_contribution'

export type GitHubContributionType =
  | 'issues_created'
  | 'issues_closed'
  | 'prs_opened'
  | 'prs_merged'
  | 'any_contribution'

// Base interface for all GitHub verification data
export interface BaseGitHubVerificationData {
  type: GitHubVerificationType
  github_username: string
}

// Organization follow verification
export interface OrgFollowVerificationData extends BaseGitHubVerificationData {
  type: 'org_follow'
  organization: string
}

// User follow verification
export interface UserFollowVerificationData extends BaseGitHubVerificationData {
  type: 'user_follow'
  user_to_follow: string
}

// Repository star verification
export interface RepoStarVerificationData extends BaseGitHubVerificationData {
  type: 'repo_star'
  organization: string
  repository: string
}

// Repository watch verification
export interface RepoWatchVerificationData extends BaseGitHubVerificationData {
  type: 'repo_watch'
  repository: string // Format: "owner/repo"
}

// Repository contribution verification
export interface RepoContributionVerificationData extends BaseGitHubVerificationData {
  type: 'repo_contribution'
  repository: string // Format: "owner/repo"
  contribution_type: GitHubContributionType
}

// Union type for all verification data
export type GitHubVerificationData =
  | OrgFollowVerificationData
  | UserFollowVerificationData
  | RepoStarVerificationData
  | RepoWatchVerificationData
  | RepoContributionVerificationData

// GitHub API response types
export interface GitHubIssue {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  created_at: string
  closed_at?: string
  user: {
    login: string
  }
}

export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  created_at: string
  closed_at?: string
  merged_at?: string
  user: {
    login: string
  }
}

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author?: {
    login: string
  }
}

export interface GitHubRepository {
  id: number
  full_name: string
  name: string
  owner: {
    login: string
    type: 'User' | 'Organization'
  }
  stargazers_count: number
  watchers_count: number
  forks_count: number
}

export interface GitHubUser {
  id: number
  login: string
  type: 'User' | 'Organization'
  followers: number
  following: number
  public_repos: number
}

// Webhook request/response types
export interface GitHubWebhookRequest {
  challengeId: string
  playerEmail: string
  verificationData: GitHubVerificationData
}

export interface GitHubWebhookResponse {
  message: string
  success: boolean
}

// Error types
export interface GitHubVerificationError {
  message: string
  success: false
  error?: string
}

// Helper function to validate verification data
export function isValidGitHubVerificationData(data: unknown): data is GitHubVerificationData {
  if (!data || typeof data !== 'object') return false

  const verificationData = data as Record<string, unknown>

  if (!verificationData.type || !verificationData.github_username) {
    return false
  }

  const type = verificationData.type as string
  const username = verificationData.github_username as string

  if (!username || typeof username !== 'string') {
    return false
  }

  switch (type) {
    case 'org_follow':
      return typeof verificationData.organization === 'string'

    case 'user_follow':
      return typeof verificationData.user_to_follow === 'string'

    case 'repo_star':
      return typeof verificationData.organization === 'string' &&
             typeof verificationData.repository === 'string'

    case 'repo_watch':
    case 'repo_contribution':
      return typeof verificationData.repository === 'string' &&
             (type !== 'repo_contribution' || typeof verificationData.contribution_type === 'string')

    default:
      return false
  }
}

// Helper function to get required fields for a verification type
export function getRequiredFieldsForType(type: GitHubVerificationType): string[] {
  const baseFields = ['type', 'github_username']

  switch (type) {
    case 'org_follow':
      return [...baseFields, 'organization']

    case 'user_follow':
      return [...baseFields, 'user_to_follow']

    case 'repo_star':
      return [...baseFields, 'organization', 'repository']

    case 'repo_watch':
      return [...baseFields, 'repository']

    case 'repo_contribution':
      return [...baseFields, 'repository', 'contribution_type']

    default:
      return baseFields
  }
}
