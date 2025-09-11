<template>
  <v-app>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const { isAuthenticated, logout } = useAuthStore()
</script>