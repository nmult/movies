<template>
  <v-container fluid class="pa-6">
    <SignupForm :allow-role-selection="false" />
  </v-container>
</template>

<script setup lang="ts">
import SignupForm from '@/components/SignupForm.vue'
</script>