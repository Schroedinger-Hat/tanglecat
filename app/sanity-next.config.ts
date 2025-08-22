import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig( process.env.NODE_ENV === 'development' ? [
  {
  name: 'default',
  title: 'DEV Event Gamification',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_DEV!,
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
},
]
:
[
  {
  name: 'default',
  title: 'PROD Event Gamification',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
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
},
]
) 