import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  // Compatibility window
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Modules
  modules: [
    'vuetify-nuxt-module',
  ],

  // Nitro configuration
  nitro: {
    // Register our DB plugin
    plugins: ['~/server/utils/database.ts'],
    // Avoid bundling large native deps, load at runtime
    externals: {
      inline: ['mongodb', 'bcrypt', 'jsonwebtoken']
    },
  },

  // Runtime configuration
  runtimeConfig: {
    apiSecret: {
      MONGO_URL: process.env.MONGO_URL,
      DB_NAME:   process.env.DB_NAME
    },
    public: { apiBase: '/api' }
  },

  // TypeScript settings
  typescript: {
    strict: true
  },
});