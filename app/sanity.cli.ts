import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({ // Do we want the cli to reference the dev or prod dataset locally?
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_SANITY_DATASET_DEV : process.env.NEXT_PUBLIC_SANITY_DATASET //: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
