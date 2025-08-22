<!-- [![Schrödinger Hat - Tangle Cat Logo](/app/public/tanglecat-white.png)](https://schroedinger-hat.org) -->
<div align="center">
    <a href="https://schroedinger-hat.org">
      <img src="/app/public/tanglecat-red.png" alt="Schrödinger Hat - Tangle Cat Logo" width="20%" align="center"/>
    </a>
</div>

# Entertainment App for attendees in tech events

A platform for managing tech events with QR code-based challenge verification.

Hey, are you looking to implement this in your event? Contact us via events@schroedinger-hat.org we might help you!

## Getting Started


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

#### Prerequisites:

Ensure that the following are installed on your device:
- Docker and Docker Compose
- Node.js 20+ (for local development)

#### Basic Setup Steps

1. Clone the TangleCat Git repository:

```bash
git clone Schroedinger-Hat/tanglecat.git
cd tanglecat
```

2. Create you nextJS app `.env` file under the `/app` directory as follows.
   
  ```bash
NODE_ENV="development"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_DATASET_DEV="development"
NEXT_PUBLIC_SANITY_PROJECT_ID=<your_project_ID>
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
SANITY_API_TOKEN=<your_api_token>
SANITY_API_VERSION="2024-03-21"
```
(Dataset values may differ, but should match your Sanity testing and production db names)

3. Start the development environment (from main project directory)

```bash
docker compose up
```

This will start the Next.js application and the integrated Sanity Studio CMS. 

**NOTE:** The first time you start the environment, it will take a while to download the images and start the containers. If you encounter issues, confirm you have a correctly configured `.env` file in the root of the `/app` directory.

4. Accessing your locally hosted application:
   - `http://localhost:8080` - this should show you your local version on the NextJS app, with access to live *development* database data.
    - `http://localhost:8080/studio` - this should show you your live *development* database hosted on Sanity.io. Use this Studio interface to create test content for your event app.

#### Local Sanity Studio Setup (optional)

The above instructions allow you to access and edit your *development* database locally (from within your app), but not access your *production* database locally. If you would like to make changes to the production database locally, deploy a remote sanity studio, or otherwise work with your Sanity data uncoupled from the frontend app, follow these instructions to run a separate Sanity Studio instance:

1. Create you Sanity Studio `.env` file under `/app/sanity` as follows (see provided `.env.example` in same directory).
   
  ```bash
SANITY_STUDIO_SANITY_DATASET="production"
SANITY_STUDIO_SANITY_DATASET_DEV="development"
SANITY_STUDIO_SANITY_PROJECT_ID=<your_project_ID>
SANITY_API_TOKEN=<your_api_token>
SANITY_API_VERSION="2024-03-21"
```
(These values should match your primary `.env` file, however the names will differ. You may also wish to use a separate API token with different permissions than app token).

**NOTE**: additional `.env.development` & `.env.production` example files are provided - if you remove the `.sample` suffix from both, Sanity Studio will default to showing *production* database first in production environments & *development* database first in development environments (extra optional).

2. Start the development environment (from main project directory)

```bash
docker compose -f docker-compose.sanity.yml up
```

This will start the Next.js application and the integrated Sanity Studio CMS. 

**NOTE:** The first time you start the environment, it will take a while to download the images and start the containers. If you encounter issues, confirm you have a correctly configured `.env` file in the root of the `/app/sanity` directory.

4. Accessing your locally hosted Sanity Studio:
   - `http://localhost:3333` - this should show you your live *development* database hosted on Sanity.io. You will find, however, that you can also navigate to and edit your *production* database from here.
   - If your Sanity Studio *development* database was empty when docker compose was first run, then it should now be populated with some demo data to play with.

### Production Environment

1. Build the production image:

```bash
NODE_ENV=production docker compose up --build
```

2. Start the production environment:

```bash
NODE_ENV=production docker compose up
```

This will start the Next.js application and the Sanity Studio CMS in production mode.
   
3.  Access the production site and studio at `http://localhost:8080` & `http://localhost:8080/studio`


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


## License

This project is licensed under the AGPLv3 License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact us at [events@schroedinger-hat.org](mailto:events@schroedinger-hat.org)

## Maintainers 👨‍💻👩‍💻

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/TheJoin95">
          <img src="https://github.com/TheJoin95.png" width="100px;" alt="Miki Lombardi"/>
          <br />
          <sub>
            <b>Miki Lombardi</b>
          </sub>
        </a>
        <br />
        <span>💻 Maintainer</span>
      </td>
      <td align="center">
        <a href="https://github.com/Readpato">
          <img src="https://github.com/Readpato.png" width="100px;" alt="Patrick Raedler"/>
          <br />
          <sub>
            <b>Patrick Raedler</b>
          </sub>
        </a>
        <br />
        <span>💻 Maintainer</span>
      </td>
      <td align="center">
        <a href="https://github.com/BugliL">
          <img src="https://github.com/BugliL.png" width="100px;" alt="Lorenzo Bugli"/>
          <br />
          <sub>
            <b>Lorenzo Bugli</b>
          </sub>
        </a>
        <br />
        <span>💻 Maintainer</span>
      </td>
    </tr>
  </table>
</div>
