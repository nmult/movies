<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-title>Movie Database</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/">Home</v-btn>
      <v-btn to="/movies">Movies</v-btn>
      <v-btn v-if="!isAuthenticated" to="/login">Login</v-btn>
      <v-btn v-if="!isAuthenticated" to="/signup">Sign up</v-btn>
      <v-btn v-else @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const { isAuthenticated, logout } = useAuthStore()
</script>