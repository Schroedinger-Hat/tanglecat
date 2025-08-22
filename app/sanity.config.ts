import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'event-gamification',
  title: 'Event Gamification',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'local',
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3333'],
    credentials: true,
  },
})