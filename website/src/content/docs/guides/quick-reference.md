---
title: Quick Reference
description: Common commands and shortcuts for TangleCat development
sidebar:
  order: 3
  label: Quick Reference
  hidden: false
---

## Development Commands

### Docker Commands

```bash
# Start all services
docker compose up

# Start specific service
docker compose up web        # Frontend only
docker compose up sanity     # Sanity Studio only

# Start in background
docker compose up -d

# View logs
docker compose logs -f
docker compose logs -f web
docker compose logs -f sanity

# Stop services
docker compose down

# Rebuild and start
docker compose up --build

# Clean up
docker system prune -a
```

### Frontend Commands

```bash
cd app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Sanity Studio Commands

```bash
cd app/sanity

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Build for production
npm run build

# Deploy to Sanity
npm run deploy

# Load demo data
npm run demo-data
```

### Documentation Site Commands

```bash
cd website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Required Variables

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

# Sanity Studio
SANITY_STUDIO_PUBLIC_SANITY_PROJECT_ID=your_project_id
SANITY_STUDIO_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PUBLIC_SANITY_DATASET_DEV=development
```

## URLs and Ports

| Service | Docker Port | Manual Port | URL |
|---------|-------------|-------------|-----|
| Frontend | 8080 | 3000 | http://localhost:8080 |
| Sanity Studio | 3333 | 3333 | http://localhost:3333 |
| Documentation | 4321 | 4321 | http://localhost:4321 |

## Common File Paths

### Frontend
- **Layout**: `app/src/app/layout.tsx`
- **Home Page**: `app/src/app/page.tsx`
- **Components**: `app/src/components/`
- **API Routes**: `app/src/app/api/`
- **Types**: `app/src/types/`
- **Utilities**: `app/src/lib/`

### Sanity Studio
- **Config**: `app/sanity/sanity.config.ts`
- **Schemas**: `app/sanity/schemaTypes/`
- **CLI Config**: `app/sanity/sanity.cli.ts`

### Configuration Files
- **Docker Compose**: `docker-compose.yml`
- **Sanity Docker**: `docker-compose.sanity.yml`
- **Next.js Config**: `app/next.config.ts`
- **Tailwind Config**: `app/tailwind.config.ts`
- **TypeScript Config**: `app/tsconfig.json`

## Troubleshooting Commands

### Port Conflicts
```bash
# Check what's using a port
lsof -i :8080
lsof -i :3333
lsof -i :3000

# Kill process using port
kill -9 <PID>
```

### Docker Issues
```bash
# Check Docker status
docker info
docker version

# List containers
docker ps -a

# Check container logs
docker logs <container_id>

# Restart Docker Desktop
# (On macOS/Windows)
```

### Node.js Issues
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json
npm install
```

### Sanity Issues
```bash
# Check Sanity CLI
npx sanity --version

# Login to Sanity
npx sanity login

# Check project access
npx sanity projects list

# Test connection
npx sanity dataset list
```

## Development Workflow

### Daily Development
```bash
# 1. Start services
docker compose up

# 2. Make code changes
# 3. Test in browser
# 4. Check logs if issues
docker compose logs -f

# 5. Stop services
docker compose down
```

### Code Changes
```bash
# Frontend changes - auto-reload
# Sanity schema changes - restart studio
# API changes - test endpoints
# Environment changes - restart services
```

### Testing
```bash
# Frontend: http://localhost:8080
# Sanity Studio: http://localhost:3333
# API endpoints: Use Postman or curl
# Database: Use Sanity Vision
```

## Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push changes
git push origin main

# Pull latest
git pull origin main

# Check branches
git branch -a

# Create new branch
git checkout -b feature-name
```

## Package Management

### Frontend Dependencies
```bash
cd app

# Add dependency
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Update dependencies
npm update

# Check outdated packages
npm outdated

# Audit security
npm audit
```

### Sanity Dependencies
```bash
cd app/sanity

# Add Sanity plugin
npm install sanity-plugin-plugin-name

# Update Sanity
npm update sanity

# Check Sanity version
npm list sanity
```

## Performance Monitoring

### Frontend
- Use Chrome DevTools Performance tab
- Monitor Network tab for API calls
- Check Console for errors
- Use React DevTools for component analysis

### Backend
- Monitor Sanity query performance
- Check API response times
- Monitor database usage
- Use Sanity Vision for query testing

## Security Checklist

- [ ] Environment variables not committed
- [ ] API tokens have minimal permissions
- [ ] CORS origins properly configured
- [ ] Input validation implemented
- [ ] Authentication middleware active
- [ ] HTTPS enabled in production
- [ ] Regular dependency updates
- [ ] Security audits run

## Deployment Checklist

- [ ] Environment variables set
- [ ] Production build tested
- [ ] Sanity Studio deployed
- [ ] CORS origins updated
- [ ] API tokens rotated
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback plan ready
