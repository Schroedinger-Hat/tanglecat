---
title: Getting Started with TangleCat
description: Setting up a Tanglecat event page
sidebar:
  order: 1
  label: Getting Started
  hidden: false
---

*This page is currently under development*

## Prerequisites

Ensure that the following are installed on your device:
- Docker and Docker Compose
- Node.js 20+ (for local development)

### Sanity Setup

Even in local development, your TangleCat game data will be hosted in a Sanity Studio Data Lake.

It is recommended that you complete the following steps before attempting to load Tanglecat, as a database connection is necessary for basic functionality.

  1. Create a create a [Sanity.io](https://www.sanity.io/) account (if you do not already have one).
  2. Navigate to your *Dashboard* and *Create a new project* (name and org should match your event)
      - Below your Project Title, you should find a your **Project ID** - save this id for later.
  3. Now, Navigate to the *Datasets* Tab
     - Create a database named **production** and another named **development**
  4.  From your new project dashboard, navigate to the *API* tab
      - Under **CORS origins**, add the URL **http://localhost:8080** and any other desired host addresses (your future deployed site URL will go here too).
      - Next, select **Add API token** - create a new token with **Editor** permissions - **save this token**; it will be used by your TangleCat app to access your project.


Now, when you setup your project's `.env` file, you should have all the necessary environment variables.


### Setting up your Development Environment

1. Clone the TangleCat Git repository:

```bash
git clone Schroedinger-Hat/tanglecat.git
cd tanglecat
cd app
```
2. Create your `.env` file under the `/app` directory as follows
  ```bash
NODE_ENV="development"
NEXT_PUBLIC_SANITY_DATASET="production" <!--change_if_needed-->
NEXT_PUBLIC_SANITY_DATASET_DEV="development" <!--change_if_needed-->
NEXT_PUBLIC_SANITY_PROJECT_ID=<your_project_ID>
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
SANITY_API_TOKEN=<your_api_token>
SANITY_API_VERSION="2024-03-21" <!--change_if_needed-->

```

2. Start the development environment:

```bash
docker compose up
```

This will start the Next.js application and the Sanity Studio CMS.

**NOTE**: The first time you start the environment, it will take a while to download the images and start the containers. 

Once Complete, you should be able to access the application at [http://localhost:8080](http://localhost:8080)

### Production Environment

1. Build the production image:

```bash
ENVIRONMENT=production docker compose up --build
```

2. Start the production environment:

```bash
ENVIRONMENT=production docker compose up
```

3. Access the local studio at `http://localhost:8080/studio`: you need to be logged in to the Sanity Studio to manage the content.

This will start the Next.js application and the Sanity Studio CMS in production mode.

## Project Structure

The project is organized into the following directories:

- `app`: Next.js application code
- `app/components`: Reusable React components
- `app/lib`: Utility functions
- `app/api`: API routes
- `app/public`: Static assets
- `app/styles`: Global CSS styles
- `app/types`: TypeScript type definitions
- `app/utils`: Utility functions
- `app/sanity`: Sanity Studio configuration and schemas

## Deployment

### Deploying to Vercel

1. Fork or clone this repository to your GitHub account

2. Create a new project on [Vercel](https://vercel.com)

3. Import your repository

4. Configure the following environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset name (usually "production")
   - `SANITY_API_VERSION`: Your Sanity API version (e.g., "2024-03-21")
   - `SANITY_API_TOKEN`: Your Sanity API token with write access

5. Deploy! Vercel will automatically build and deploy your app

The app will be automatically deployed on every push to the main branch.

### Production URLs
- Next.js app: `https://your-project.vercel.app`
- Sanity Studio: Deploy separately or access via your Sanity project dashboard