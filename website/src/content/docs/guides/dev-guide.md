---
title: Developer Guide
description: Comprehensive setup and development guide for TangleCat
sidebar:
  order: 2
  label: Developer Guide
  hidden: false
---

## Overview

This guide provides comprehensive instructions for developers setting up and working with the TangleCat project locally. It covers both the Next.js frontend application and the Sanity Studio CMS.

## Prerequisites

### Required Software

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)

### Optional Software

- **VS Code** with recommended extensions
- **Postman** or similar for API testing
- **Chrome DevTools** for debugging

## Project Architecture

The TangleCat project consists of three main components:

1. **Next.js Frontend** (`/app`) - React-based web application
2. **Sanity Studio** (`/app/sanity`) - Content management system
3. **Documentation Site** (`/website`) - This documentation

## Detailed Setup Instructions

### 1. Repository Setup

```bash
# Clone the repository
git clone <your-repository-url>
cd leaderboard-challenges

# Verify the structure
ls -la
# Should show: app/, website/, docker-compose.yml, etc.
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your values
nano .env
```

**Required Environment Variables:**

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

### 3. Sanity Project Setup

#### Create Sanity Account

1. Go to [sanity.io](https://www.sanity.io/) and create an account
2. Create a new organization (if you don't have one)
3. Create a new project with a descriptive name

#### Configure Project

1. **Note your Project ID** from the dashboard
2. **Create Datasets:**
   - Go to "Datasets" tab
   - Create `production` dataset
   - Create `development` dataset
   - Create `testing` dataset (optional)

3. **Configure CORS Origins:**
   - Go to "API" tab
   - Add these URLs to CORS origins:
     ```
     http://localhost:8080
     http://localhost:3000
     http://localhost:3333
     http://localhost:4321
     ```

4. **Create API Token:**
   - Go to "API" tab
   - Click "Add API token"
   - Name: "Development Token"
   - Role: "Editor"
   - Copy the token (you won't see it again)

### 4. Development Environment Setup

#### Option A: Docker Setup (Recommended)

```bash
# Start both services
docker compose up

# Or start individually
docker compose up web        # Frontend only
docker compose up sanity     # Sanity Studio only

# View logs
docker compose logs -f web
docker compose logs -f sanity
```

#### Option B: Manual Setup

**Frontend Setup:**
```bash
cd app
npm install
npm run dev
```

**Sanity Studio Setup:**
```bash
cd app/sanity
npm install
npm run dev
```

**Documentation Site Setup:**
```bash
cd website
npm install
npm run dev
```

### 5. Verify Installation

After setup, you should be able to access:

- **Frontend**: http://localhost:8080 (Docker) or http://localhost:3000 (manual)
- **Sanity Studio**: http://localhost:3333
- **Documentation**: http://localhost:4321

## Development Workflow

### Daily Development

```bash
# Start development environment
docker compose up

# In another terminal, make code changes
# Changes will hot-reload automatically

# View logs
docker compose logs -f
```

### Code Changes

#### Frontend Changes
- Edit files in `/app/src/`
- Changes auto-reload in browser
- Check console for errors

#### Sanity Schema Changes
- Edit files in `/app/sanity/schemaTypes/`
- Restart Sanity Studio after schema changes
- Test in Sanity Studio interface

#### API Changes
- Edit files in `/app/src/app/api/`
- Test endpoints with Postman or browser
- Check server logs for errors

### Database Management

#### Access Sanity Studio
1. Go to http://localhost:3333
2. Log in with your Sanity account
3. Select your project and dataset

#### Content Operations
- **Create**: Add new challenges, awards, users
- **Read**: View existing content
- **Update**: Modify content through the interface
- **Delete**: Remove content (be careful!)

#### Import Demo Data
```bash
cd app/sanity
npm run demo-data
```

## Project Structure Deep Dive

### Frontend (`/app`)

```
app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (admin)/         # Admin routes
│   │   ├── (protected)/     # Protected routes
│   │   ├── api/             # API endpoints
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   └── *.tsx            # Feature components
│   ├── lib/                 # Utilities and configurations
│   │   ├── auth.ts          # Authentication logic
│   │   ├── sanity.ts        # Sanity client
│   │   └── utils/           # Helper functions
│   └── types/               # TypeScript definitions
├── sanity/                  # Sanity Studio
│   ├── schemaTypes/         # Content schemas
│   ├── sanity.config.ts     # Studio configuration
│   └── sanity.cli.ts        # CLI configuration
└── package.json             # Dependencies
```

### Key Files

- **`/app/src/app/layout.tsx`** - Root layout component
- **`/app/src/app/page.tsx`** - Home page
- **`/app/src/lib/sanity.ts`** - Sanity client configuration
- **`/app/src/middleware.ts`** - Authentication middleware
- **`/app/sanity/schemaTypes/`** - Content model definitions

## Testing and Debugging

### Frontend Testing

```bash
# Run linting
cd app
npm run lint

# Check TypeScript
npx tsc --noEmit

# Run tests (if configured)
npm test
```

### API Testing

```bash
# Test authentication endpoint
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Test challenges endpoint
curl http://localhost:8080/api/challenges
```

### Database Testing

1. **Sanity Studio**: http://localhost:3333
2. **Sanity Vision**: http://localhost:3333/vision
3. **API Explorer**: Use Sanity's built-in tools

## Common Development Tasks

### Adding New Content Types

1. **Create Schema** in `/app/sanity/schemaTypes/`
2. **Add to Index** in `/app/sanity/schemaTypes/index.ts`
3. **Restart Sanity Studio**
4. **Create Content** in Sanity Studio
5. **Query Data** in frontend

### Adding New API Endpoints

1. **Create Route File** in `/app/src/app/api/`
2. **Implement Handler** function
3. **Add Types** in `/app/src/types/`
4. **Test Endpoint** with Postman or browser

### Styling Changes

1. **Edit CSS** in `/app/src/app/globals.css`
2. **Use Tailwind** classes in components
3. **Custom Components** in `/app/src/components/ui/`

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
lsof -i :8080
lsof -i :3333
lsof -i :3000

# Kill processes or change ports in docker-compose.yml
```

#### Sanity Connection Issues
```bash
# Verify environment variables
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $SANITY_API_TOKEN

# Check CORS origins in Sanity dashboard
# Ensure API token has correct permissions
```

#### Docker Issues
```bash
# Rebuild containers
docker compose down
docker compose up --build

# Clear Docker cache
docker system prune -a

# Check Docker logs
docker compose logs -f
```

#### Node.js Issues
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 20+
```

### Debug Mode

#### Frontend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check browser console
# Use React DevTools extension
```

#### Sanity Debugging
```bash
# Enable Sanity debug mode
cd app/sanity
DEBUG=sanity:* npm run dev

# Check Sanity Studio console
# Use Sanity Vision for query testing
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images with next/image
- Use dynamic imports for code splitting

### Database
- Implement proper caching strategies
- Use GROQ projections to limit data
- Optimize queries with indexes
- Monitor query performance

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use strong, unique API tokens
- Rotate tokens regularly
- Limit token permissions

### API Security
- Implement proper authentication
- Validate all inputs
- Use HTTPS in production
- Implement rate limiting

### Content Security
- Sanitize user inputs
- Validate file uploads
- Implement proper access controls
- Monitor for suspicious activity

## Deployment Preparation

### Production Environment
```bash
# Build production images
ENVIRONMENT=production docker compose up --build

# Test production build locally
ENVIRONMENT=production docker compose up
```

### Environment Variables
Ensure production environment variables are set:
- Production Sanity project ID
- Production API tokens
- Production URLs
- Analytics and monitoring keys

## Getting Help

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Community
- [GitHub Issues](https://github.com/schroedinger-hat/tanglecat/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/tanglecat)

### Support
For technical support or questions:
- Create a GitHub issue
- Contact the development team
- Check the troubleshooting section above

## Next Steps

After completing this setup:

1. **Explore the codebase** to understand the architecture
2. **Create test content** in Sanity Studio
3. **Test the complete user flow** from registration to completion
4. **Customize the application** for your specific event
5. **Set up monitoring and analytics**
6. **Plan your production deployment**

Remember to check the [Getting Started](./getting-started) guide for a quick overview and the other guides for specific use cases.
