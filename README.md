# Enterteinment App for attendees in tech events

A platform for managing tech events with QR code-based challenge verification.

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


License

This project is licensed under the AGPLv3 License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact us at [events@schroedinger-hat.org](mailto:events@schroedinger-hat.org)
