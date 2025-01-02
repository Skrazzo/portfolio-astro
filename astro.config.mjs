// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
// TODO: Add sitemap maybe
export default defineConfig({
  devToolbar: {
      enabled: true,
  },

  integrations: [tailwind()],
});