// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import starlight from '@astrojs/starlight'
import lottie from 'astro-integration-lottie'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Documentation',
      logo: {
        src: '/public/tanglecat-logo.png',
        alt: 'TangleCat logo',
        replacesTitle: false
      },
      customCss: ['./src/styles/global.css']
    }),
    lottie()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});