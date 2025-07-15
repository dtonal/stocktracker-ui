import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import type { AuthenticationRequest } from '@/types/auth'
import type { UserResponse } from '@/types/user'

const TOKEN_STORAGE_KEY = 'stocktracker-auth-token'

export const useAuthStore = defineStore('auth', () => {
  // =================================================================
  // STATE
  // =================================================================

  const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))
  const user = ref<UserResponse | null>(null)

  // =================================================================
  // GETTERS
  // =================================================================

  const isLoggedIn = computed(() => !!token.value)
  const authToken = computed(() => token.value)

  // =================================================================
  // ACTIONS
  // =================================================================

  /**
   * Führt den Login-Vorgang aus.
   * @param credentials E-Mail und Passwort des Benutzers.
   */
  async function login(credentials: AuthenticationRequest): Promise<void> {
    const response = await authService.login(credentials)
    if (response.token) {
      token.value = response.token
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
    } else {
      throw new Error(response.error || 'Login fehlgeschlagen')
    }
  }

  /**
   * Loggt den Benutzer aus, indem der Token entfernt wird.
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  return {
    // State
    token,
    user,
    // Getters
    isLoggedIn,
    authToken,
    // Actions
    login,
    logout,
  }
})
