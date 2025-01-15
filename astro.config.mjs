// @ts-check
import { defineConfig } from 'astro/config';

import db from '@astrojs/db';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [db(), react(), tailwind()],
  output: "server",
  adapter: vercel()
});