# Enterteinment App for attendees in tech events

A platform for managing tech events with QR code-based challenge verification.

Hey, are you looking to implement this in your event? Contact us via events@schroedinger-hat.org we might help you!

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)

### Development Environment

1. Clone the repository:

```bash
git clone Schroedinger-Hat/event-gamification.git
cd event-gamification
```

2. Start the development environment:

```bash
docker compose up
```

This will start the Next.js application and the Sanity Studio CMS.
**NOTE**: The first time you start the environment, it will take a while to download the images and start the containers. You need to have a .env file in the root of the project. Check bitwarden or create one as follow:

```bash
NODE_ENV=development
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=your_sanity_dataset
SANITY_API_VERSION=your_sanity_api_version
```

3. Access the application at `http://localhost:8080`

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
