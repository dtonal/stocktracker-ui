import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../authStore'
import { authService } from '@/services/authService'

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getMe: vi.fn(),
  },
}))

describe('Auth Store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('sollte initial nicht eingeloggt sein', () => {
    const authStore = useAuthStore()
    expect(authStore.isLoggedIn).toBe(false)
    expect(authStore.token).toBe(null)
  })

  it('sollte erfolgreich einloggen, Benutzerdaten abrufen und alles speichern', async () => {
    const authStore = useAuthStore()
    const mockToken = 'fake-jwt-token-12345'
    const mockUser = { id: 'user-1', name: 'Test User', email: 'test@example.com' }

    vi.mocked(authService.login).mockResolvedValue({ token: mockToken })
    vi.mocked(authService.getMe).mockResolvedValue(mockUser)

    await authStore.login({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(authService.login).toHaveBeenCalledOnce()
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(authService.getMe).toHaveBeenCalledOnce()
    expect(authService.getMe).toHaveBeenCalledWith(mockToken)

    expect(authStore.isLoggedIn).toBe(true)
    expect(authStore.token).toBe(mockToken)
    expect(authStore.user).toEqual(mockUser)

    expect(localStorage.getItem('stocktracker-auth-token')).toBe(mockToken)
  })

  it('sollte bei fehlgeschlagenem Login einen Fehler werfen und keine Benutzerdaten abrufen', async () => {
    const authStore = useAuthStore()
    vi.mocked(authService.login).mockResolvedValue({ error: 'Invalid credentials' })

    await expect(
      authStore.login({ email: 'wrong@example.com', password: 'wrongpassword' }),
    ).rejects.toThrow('Invalid credentials')

    expect(authService.getMe).not.toHaveBeenCalled()

    expect(authStore.isLoggedIn).toBe(false)
    expect(authStore.token).toBe(null)
    expect(authStore.user).toBe(null)
  })

  it('sollte beim Logout Token und Benutzer entfernen', () => {
    const authStore = useAuthStore()
    authStore.token = 'fake-token'
    authStore.user = { id: 'user-1', name: 'Test User', email: 'test@example.com' }
    localStorage.setItem('stocktracker-auth-token', 'fake-token')
    expect(authStore.isLoggedIn).toBe(true)

    authStore.logout()

    expect(authStore.isLoggedIn).toBe(false)
    expect(authStore.token).toBe(null)
    expect(authStore.user).toBe(null)
    expect(localStorage.getItem('stocktracker-auth-token')).toBe(null)
  })

  it('sollte beim Start der App versuchen, den Benutzer abzurufen, wenn ein Token vorhanden ist', async () => {
    const mockToken = 'existing-token'
    const mockUser = { id: 'user-1', name: 'Test User', email: 'test@example.com' }
    localStorage.setItem('stocktracker-auth-token', mockToken)
    vi.mocked(authService.getMe).mockResolvedValue(mockUser)

    const authStore = useAuthStore()

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(authService.getMe).toHaveBeenCalledOnce()
    expect(authService.getMe).toHaveBeenCalledWith(mockToken)
    expect(authStore.user).toEqual(mockUser)
    expect(authStore.isLoggedIn).toBe(true)
  })

  it('sollte den Benutzer ausloggen, wenn fetchUser fehlschlägt', async () => {
    // Setup
    const pinia = createPinia()
    setActivePinia(pinia)
    const authStore = useAuthStore()

    // Mock initial state
    authStore.token = 'invalid-token'

    // Mock service rejection
    authService.getMe.mockRejectedValue(new Error('Invalid Token'))

    // Action
    await authStore.fetchUser()

    // Assertions
    expect(authService.getMe).toHaveBeenCalledWith('invalid-token')
    expect(authStore.token).toBeNull()
    expect(authStore.user).toBeNull()
    expect(localStorage.getItem('stocktracker-auth-token')).toBeNull()
  })
})
