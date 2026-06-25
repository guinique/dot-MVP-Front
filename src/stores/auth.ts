import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiFetch, login as apiLogin } from '@/api/client'
import type { User } from '@/config'

const TOKEN_KEY = 'dot_mvp_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setToken(value: string | null) {
    token.value = value
    if (value) {
      localStorage.setItem(TOKEN_KEY, value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  async function login(email: string, password: string) {
    const accessToken = await apiLogin(email, password)
    setToken(accessToken)
    await fetchMe()
    if (!isAdmin.value) {
      logout()
      throw new Error('Admin access required')
    }
  }

  async function fetchMe() {
    if (!token.value) return
    user.value = await apiFetch<User>('/api/v1/auth/me', {}, token.value)
  }

  function logout() {
    setToken(null)
    user.value = null
  }

  async function init() {
    if (token.value) {
      try {
        await fetchMe()
        if (!isAdmin.value) logout()
      } catch {
        logout()
      }
    }
  }

  return { token, user, isAuthenticated, isAdmin, login, logout, init, fetchMe }
})
