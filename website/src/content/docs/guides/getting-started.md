---
title: Getting Started with TangleCat
description: Setting up a Tanglecat event page locally
sidebar:
  order: 1
  label: Getting Started
  hidden: false
---

## Prerequisites

Ensure that the following are installed on your device:
- **Docker and Docker Compose** (for containerized setup)
- **Node.js 20+** (for local development)
- **Git** (for cloning the repository)

## Quick Start (Docker - Recommended)

The fastest way to get started is using Docker Compose, which will set up both the Next.js frontend and Sanity Studio automatically.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd leaderboard-challenges
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Environment
NODE_ENV=development
PORT=8080

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_DATASET_DEV=development
SANITY_API_VERSION=2024-03-21
SANITY_API_TOKEN=your_api_token

# Sanity Studio Environment Variables
SANITY_STUDIO_PUBLIC_SANITY_PROJECT_ID=your_project_id
SANITY_STUDIO_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PUBLIC_SANITY_DATASET_DEV=development
```

### 3. Start the Development Environment

```bash
# Start both frontend and Sanity Studio
docker compose up

# Or start them separately
docker compose up web        # Frontend only
docker compose up sanity     # Sanity Studio only
```

### 4. Access Your Applications

- **Frontend**: http://localhost:8080
- **Sanity Studio**: http://localhost:3333

## Manual Setup (Alternative)

If you prefer to run the services directly on your machine without Docker:

### Frontend Setup

```bash
cd app
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### Sanity Studio Setup

```bash
cd app/sanity
npm install
npm run dev
```

The Sanity Studio will be available at http://localhost:3333

## Sanity Configuration

### Initial Setup

1. Create a [Sanity.io](https://www.sanity.io/) account
2. Create a new project (name and org should match your event)
3. Note your **Project ID** from the dashboard
4. Create two datasets: **production** and **development**
5. Configure CORS origins:
   - Add `http://localhost:8080` for Docker setup
   - Add `http://localhost:3000` for manual setup
   - Add `http://localhost:3333` for Sanity Studio
6. Create an API token with **Editor** permissions

### Environment Variables

Ensure these are set in your `.env` file:

```bash
# Required for frontend
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_DATASET_DEV=development
SANITY_API_VERSION=2024-03-21
SANITY_API_TOKEN=your_api_token

# Required for Sanity Studio
SANITY_STUDIO_PUBLIC_SANITY_PROJECT_ID=your_project_id
SANITY_STUDIO_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PUBLIC_SANITY_DATASET_DEV=development
```

## Project Structure

```
leaderboard-challenges/
├── app/                    # Next.js frontend application
│   ├── src/               # Source code
│   ├── sanity/            # Sanity Studio configuration
│   └── package.json       # Frontend dependencies
├── website/               # Documentation site (this site)
├── docker-compose.yml     # Frontend container configuration
├── docker-compose.sanity.yml  # Sanity Studio container configuration
└── .env                   # Environment variables
```

## Development Workflow

### 1. Start Development Environment

```bash
# Using Docker (recommended)
docker compose up

# Or manually
cd app && npm run dev
cd app/sanity && npm run dev
```

### 2. Make Changes

- Frontend code changes will hot-reload automatically
- Sanity Studio changes will hot-reload automatically
- Schema changes require restarting Sanity Studio

### 3. Database Management

- Access Sanity Studio at http://localhost:3333
- Create and manage your content models
- Import demo data if available

### 4. Testing

- Frontend: http://localhost:8080 (Docker) or http://localhost:3000 (manual)
- Test all features including authentication, challenges, and awards

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Check what's using the port
lsof -i :8080
lsof -i :3333

# Kill the process or change ports in docker-compose.yml
```

**Sanity Connection Issues**
- Verify your `.env` file has correct values
- Check CORS origins in Sanity dashboard
- Ensure API token has correct permissions

**Docker Issues**
```bash
# Rebuild containers
docker compose down
docker compose up --build

# Clear Docker cache
docker system prune -a
```

### Getting Help

- Check the [Developer Guide](./dev-guide) for detailed setup instructions
- Review [Sanity.io documentation](https://www.sanity.io/docs)
- Check [Next.js documentation](https://nextjs.org/docs)

## Next Steps

Once your local environment is running:

1. **Set up your content models** in Sanity Studio
2. **Create demo data** for testing
3. **Customize the frontend** for your event
4. **Test the complete workflow** from user registration to award completion
5. **Deploy to production** when ready

For detailed customization and advanced setup, see the [Developer Guide](./dev-guide).