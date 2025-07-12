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

export default defineCliConfig({ // Do we want the cli to reference the dev or prod dataset locally?
  api: {
    projectId: process.env.SANITY_STUDIO_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_ENV === 'development' ? process.env.SANITY_STUDIO_PUBLIC_SANITY_DATASET_DEV : process.env.SANITY_STUDIO_PUBLIC_SANITY_DATASET //: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
