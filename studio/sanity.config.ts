import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Leaderboard attendees',

  projectId: 'n9u23251',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3333'],
    credentials: true,
  },
})
