---
title: "GitHub Integration Guide"
description: "Learn how to use the enhanced GitHub integration for verifying challenge completions in the leaderboard system"
---

# GitHub Integration Guide

This guide explains how to use the enhanced GitHub integration for verifying challenge completions in the leaderboard system.

## Overview

The GitHub integration supports multiple verification types to track user engagement with GitHub repositories, organizations, and users. This allows event organizers to create challenges that reward various forms of GitHub participation.

## Supported Verification Types

### 1. Organization Follow (`org_follow`)

Verifies that a user follows a specific GitHub organization.

**Required fields:**
- `type`: Must be `"org_follow"`
- `github_username`: The GitHub username to verify
- `organization`: The organization name to check

**Example verification data:**
```json
{
  "type": "org_follow",
  "github_username": "johndoe",
  "organization": "microsoft"
}
```

### 2. User Follow (`user_follow`)

Verifies that a user follows another specific GitHub user.

**Required fields:**
- `type`: Must be `"user_follow"`
- `github_username`: The GitHub username to verify
- `user_to_follow`: The GitHub username they should be following

**Example verification data:**
```json
{
  "type": "user_follow",
  "github_username": "johndoe",
  "user_to_follow": "torvalds"
}
```

### 3. Repository Star (`repo_star`)

Verifies that a user has starred a specific repository.

**Required fields:**
- `type`: Must be `"repo_star"`
- `github_username`: The GitHub username to verify
- `organization`: The repository owner/organization
- `repository`: The repository name

**Example verification data:**
```json
{
  "type": "repo_star",
  "github_username": "johndoe",
  "organization": "microsoft",
  "repository": "vscode"
}
```

### 4. Repository Watch (`repo_watch`)

Verifies that a user is watching (subscribed to) a specific repository.

**Required fields:**
- `type`: Must be `"repo_watch"`
- `github_username`: The GitHub username to verify
- `repository`: The repository in format "owner/repo"

**Example verification data:**
```json
{
  "type": "repo_watch",
  "github_username": "johndoe",
  "repository": "microsoft/vscode"
}
```

### 5. Repository Contribution (`repo_contribution`)

Verifies that a user has made specific types of contributions to a repository.

**Required fields:**
- `type`: Must be `"repo_contribution"`
- `github_username`: The GitHub username to verify
- `repository`: The repository in format "owner/repo"
- `contribution_type`: The type of contribution to verify

**Supported contribution types:**
- `issues_created`: User has created issues in the repository
- `issues_closed`: User has created and closed issues in the repository
- `prs_opened`: User has opened pull requests
- `prs_merged`: User has opened pull requests that were merged
- `any_contribution`: User has made any type of contribution (issues, PRs, or commits)

**Example verification data:**
```json
{
  "type": "repo_contribution",
  "github_username": "johndoe",
  "repository": "microsoft/vscode",
  "contribution_type": "issues_created"
}
```

## Challenge Configuration

To use these verification types, you need to:

1. **Set `isOnline: true`** in your challenge configuration
2. **Set `webhookUrl`** to point to `/api/webhook/github`
3. **Configure verification fields** in the challenge form

### Example Challenge Configuration

```json
{
  "name": "GitHub Community Engagement",
  "description": "Engage with the open source community on GitHub",
  "isOnline": true,
  "webhookUrl": "https://yourdomain.com/api/webhook/github",
  "verificationConfigJSON": {
    "type": "verification",
    "fields": [
      {
        "type": "text",
        "name": "github_username",
        "title": "GitHub Username",
        "description": "Enter your GitHub username"
      },
      {
        "type": "hidden",
        "name": "type",
        "value": "repo_star"
      },
      {
        "type": "hidden",
        "name": "organization",
        "value": "microsoft"
      },
      {
        "type": "hidden",
        "name": "repository",
        "value": "vscode"
      }
    ]
  }
}
```

## API Endpoint

The GitHub webhook endpoint is located at:
```
POST /api/webhook/github
```

**Request body:**
```json
{
  "challengeId": "challenge-id-here",
  "playerEmail": "player@example.com",
  "verificationData": {
    "type": "repo_star",
    "github_username": "johndoe",
    "organization": "microsoft",
    "repository": "vscode"
  }
}
```

## Pagination Support

The GitHub integration automatically handles pagination for all API calls, ensuring that:
- **All starred repositories** are checked (not just the first 100)
- **All contributions** are verified across multiple pages
- **Complete coverage** of user activity on GitHub

This implementation follows [GitHub's official pagination best practices](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api) by:
- Using the `link` header to navigate between pages
- Automatically detecting when there are more pages available
- Handling edge cases gracefully (no next page, API errors, etc.)

This means users with hundreds or thousands of stars or contributions will have their verification work correctly, regardless of how many pages of data exist.

## Environment Variables

Make sure to set the following environment variable:
- `NEXT_PUBLIC_GITHUB_TOKEN`: A GitHub personal access token with appropriate permissions

## GitHub API Permissions

The GitHub token needs the following permissions:
- `public_repo` (for public repositories)
- `repo` (for private repositories, if needed)
- `read:user` (for user follow checks)
- `read:org` (for organization membership checks)

## Error Handling

The integration provides detailed error messages for various failure scenarios:
- Invalid verification type
- Missing required fields
- GitHub API errors
- User not found or not meeting requirements

## Rate Limiting

GitHub API has rate limits:
- **Authenticated requests**: 5,000 requests per hour
- **Unauthenticated requests**: 60 requests per hour

The integration handles rate limiting gracefully and provides appropriate error messages.

## Best Practices

1. **Use specific contribution types** rather than `any_contribution` when possible for better challenge clarity
2. **Test verification** with real GitHub accounts before deploying challenges
3. **Monitor API usage** to stay within GitHub's rate limits
4. **Provide clear instructions** to users about what they need to do
5. **Use hidden fields** for challenge-specific values to simplify user input

## Troubleshooting

### Common Issues

1. **"GitHub API error"**: Check your GitHub token and permissions
2. **"User not found"**: Verify the GitHub username exists
3. **"Repository not found"**: Ensure the repository exists and is accessible
4. **Rate limiting**: Wait for the rate limit to reset or use authenticated requests

### Debug Mode

Enable debug logging by checking the server console for detailed error messages during verification.

## Future Enhancements

Potential future verification types:
- Repository fork verification
- Commit count verification
- Issue/PR comment verification
- Repository discussion participation
- GitHub Actions workflow runs
- Package publishing verification
