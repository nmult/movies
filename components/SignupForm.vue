<template>
  <v-container fluid class="pa-6">
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-h4 font-weight-light mb-6 text-center">
            Sign Up
          </v-card-title>

          <v-form @submit.prevent="handleSubmit" ref="formRef">
            <v-text-field
                v-model="form.username"
                label="Username"
                required
                :error-messages="errors.username ? [errors.username] : []"
                :disabled="loading"
            ></v-text-field>

            <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                required
                :error-messages="errors.email ? [errors.email] : []"
                :disabled="loading"
            ></v-text-field>

            <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                required
                :error-messages="errors.password ? [errors.password] : []"
                :disabled="loading"
            ></v-text-field>

            <v-text-field
                v-model="form.confirmPassword"
                label="Confirm Password"
                type="password"
                required
                :error-messages="errors.confirmPassword ? [errors.confirmPassword] : []"
                :disabled="loading"
            ></v-text-field>

            <v-select
                v-model="form.role"
                :items="roles"
                label="Role"
                :disabled="!allowRoleSelection"
            ></v-select>

            <v-alert
                v-if="message"
                :type="messageType"
                class="mb-4"
                dismissible
                @click:close="message = ''"
            >
              {{ message }}
            </v-alert>

            <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
                :disabled="!isFormValid"
            >
              Sign Up
            </v-btn>

            <div class="text-center mt-4">
              <nuxt-link to="/login" class="text-primary">
                Already have an account? Login
              </nuxt-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { SignupRequest, UserRole } from '~/types/user'
import { useAuthStore } from '@/stores/auth'

interface Props {
  allowRoleSelection?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowRoleSelection: false
})

const roles = [
  { value: 'user', title: 'User' },
  { value: 'admin', title: 'Admin' }
]

const authStore = useAuthStore()

const form = reactive<SignupRequest>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user' as UserRole
})

const formRef = ref()
const errors = ref<Partial<SignupRequest>>({})
const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const isFormValid = computed(() => {
  return (
      form.username.trim() !== '' &&
      form.email.trim() !== '' &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword
  )
})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.username.trim()) {
    errors.value.username = 'Username is required'
  }

  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Please enter a valid email'
  }

  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  message.value = ''

  try {
    const result = await authStore.signup(
        form.username,
        form.email,
        form.password,
        form.role
    )

    if (result.success) {
      message.value = 'Signup successful!'
      messageType.value = 'success'
      Object.assign(form, {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
      })
      await navigateTo('/movies')
    } else {
      message.value = result.error || 'Signup failed'
      messageType.value = 'error'
    }
  } catch (error: any) {
    message.value = error.data?.message || 'Signup failed'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>