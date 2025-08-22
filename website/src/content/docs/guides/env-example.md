---
title: Environment Variables Template
description: Example .env file for TangleCat development
sidebar:
  order: 4
  label: Environment Template
  hidden: false
---

## Environment Variables Template

Copy this template to create your `.env` file in the root directory:

```bash
# Environment
NODE_ENV=development
PORT=8080

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_DATASET_DEV=development
SANITY_API_VERSION=2024-03-21
SANITY_API_TOKEN=your_api_token_here

# Sanity Studio Environment Variables
SANITY_STUDIO_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
SANITY_STUDIO_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PUBLIC_SANITY_DATASET_DEV=development
```

## How to Use

1. Copy the template above
2. Create a `.env` file in your project root
3. Replace the placeholder values with your actual Sanity project details
4. Save the file
5. Restart your development environment

## Getting Your Values

### Project ID
- Found in your Sanity project dashboard
- Looks like: `abc12345`

### API Token
- Go to Sanity project → API → Add API token
- Role: Editor
- Copy the generated token

### Datasets
- Create these in Sanity project → Datasets
- Common names: `production`, `development`, `testing`

## Security Notes

- Never commit your `.env` file to version control
- Keep your API tokens secure
- Use different tokens for development and production
- Rotate tokens regularly
