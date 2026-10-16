import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://humansonmars.info',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
