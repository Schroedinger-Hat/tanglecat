# TangleCat

This is the Next.js application for the TangleCat system.

## Documentation

For comprehensive documentation, including guides and API references, please visit the [TangleCat Website Documentation](https://tanglecat.org/guides/).

## GitHub Integration

The enhanced GitHub integration documentation has been moved to the website:

- **[GitHub Integration Guide](https://tanglecat.org/guides/github-integration/)** - Complete guide for using GitHub verification types
- **[GitHub Integration Summary](https://tanglecat.org/guides/github-integration-summary/)** - Overview of features and improvements

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sanity:dev` - Start Sanity Studio development server
- `npm run sanity:start` - Start Sanity Studio production server
- `npm run sanity:build` - Build Sanity Studio
- `npm run sanity:deploy` - Deploy Sanity Studio

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components
- `src/lib/` - Utility functions and configurations
- `src/types/` - TypeScript type definitions
- `sanity/` - Sanity CMS configuration and schema
- `public/` - Static assets

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Sanity CMS** - Content management
- **Framer Motion** - Animations
- **Zustand** - State management

## Contributing

Please read the [Contributing Guide](https://tanglecat.org/guides/dev-guide/) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
