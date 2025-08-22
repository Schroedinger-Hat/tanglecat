// import {defineCliConfig} from 'sanity/cli'

// export default defineCliConfig({
//   api: {
//     projectId: 'r9iqr1x2',
//     dataset: 'testing'
//   },
//   /**
//    * Enable auto-updates for studios.
//    * Learn more at https://www.sanity.io/docs/cli#auto-updates
//    */
//   autoUpdates: true,
// })

import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'local',
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
