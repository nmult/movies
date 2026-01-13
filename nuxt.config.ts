import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  // Compatibility window
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module',
  ],

  // Nitro configuration
  nitro: {
    // Remove MongoDB plugin; Supabase client is stateless and needs no plugin
    plugins: [],
    // Avoid bundling large native deps, load at runtime
    externals: {
      external: ['bcrypt'],
      inline: ['jsonwebtoken']
    },
    moduleSideEffects: ['bcrypt']
  },

  // Runtime configuration
  runtimeConfig: {
    apiSecret: {
      // Keep existing to avoid type errors; service key read directly from env in code
      MONGO_URL: process.env.MONGO_URL,
      DB_NAME:   process.env.DB_NAME
    },
    public: {
      apiBase: '/api',
      // Supabase URL and anon key for client/server usage
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
    }
  },

  // TypeScript settings
  typescript: {
    strict: true
  },
});