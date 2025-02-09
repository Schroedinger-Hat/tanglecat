import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'event-gamification',
  title: 'Event Gamification',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
],
  schema: {
    types: schemaTypes,
  },
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3333'],
    credentials: true,
  },
}) 