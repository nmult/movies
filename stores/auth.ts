import { defineStore, acceptHMRUpdate } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  username?: string
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

interface AuthResponse {
  token: string
  user: User
  message?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user',
    currentUser: (state) => state.user
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    },

    setToken(token: string) {
      this.token = token
      if (import.meta.client) {
        localStorage.setItem('token', token)
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      if (import.meta.client) {
        localStorage.removeItem('token')
      }
    },

    async login(email: string, password: string): Promise<boolean> {
      try {
        this.loading = true

        const response = await $fetch<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })

        if (response.token && response.user) {
          this.setToken(response.token)
          this.setUser(response.user)
          return true
        }

        return false
      } catch (error: any) {
        console.error('Login error:', error)
        this.clearAuth()
        throw error
      } finally {
        this.loading = false
      }
    },

    async signup(username: string, email: string, password: string, role: string = 'user') {
      try {
        this.loading = true

        const response = await $fetch<AuthResponse>('/api/auth/signup', {
          method: 'POST',
          body: { username, email, password, role }
        })

        if (response.token && response.user) {
          this.setToken(response.token)
          this.setUser(response.user)
          return { success: true }
        }

        return { success: false, error: 'Signup failed' }
      } catch (error: any) {
        console.error('Signup error:', error)
        return {
          success: false,
          error: error.data?.message || 'Signup failed'
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const token = this.token || (import.meta.client ? localStorage.getItem('token') : null)

        if (token) {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
        await navigateTo('/login')
      }
    },

    async checkAuth(): Promise<boolean> {
      try {
        if (!process.client) return false

        const token = localStorage.getItem('token')
        if (!token) return false

        const response = await $fetch<{ user: User }>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.user) {
          this.setToken(token)
          this.setUser(response.user)
          return true
        }

        return false
      } catch (error) {
        console.error('Auth check failed:', error)
        this.clearAuth()
        return false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}