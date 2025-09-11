<template>
  <v-container fluid class="pa-6">
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-h4 font-weight-light mb-6 text-center">
            Login
          </v-card-title>

          <v-form @submit.prevent="handleLogin" ref="form">
            <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :error-messages="errors.email"
                :disabled="loading"
            ></v-text-field>

            <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                :error-messages="errors.password"
                :disabled="loading"
            ></v-text-field>

            <v-alert
                v-if="errorMessage"
                type="error"
                class="mb-4"
                dismissible
                @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
                :disabled="!isFormValid"
            >
              Login
            </v-btn>

            <div class="text-center mt-4">
              <nuxt-link to="/signup" class="text-primary">
                Don't have an account? Sign up
              </nuxt-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref<{ email: string[], password: string[] }>({
  email: [],
  password: []
})

const authStore = useAuthStore()

const isFormValid = computed(() => {
  return email.value.trim() !== '' &&
      password.value.trim() !== '' &&
      /\S+@\S+\.\S+/.test(email.value)
})

const validateForm = () => {
  errors.value = { email: [], password: [] }

  if (!email.value.trim()) {
    errors.value.email.push('Email is required')
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email.push('Please enter a valid email')
  }

  if (!password.value.trim()) {
    errors.value.password.push('Password is required')
  }

  return errors.value.email.length === 0 && errors.value.password.length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const success = await authStore.login(email.value.trim(), password.value)

    if (success) {
      await navigateTo('/movies')
    } else {
      errorMessage.value = 'Invalid email or password'
    }
  } catch (error: any) {
    console.error('Login failed:', error)
    errorMessage.value = error.data?.message || error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await navigateTo('/movies')
  }
})
</script>