import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../authStore'

// WICHTIG: Das Mock muss ganz oben stehen, bevor der authStore importiert wird!
// vi.mock() ersetzt die echte authService-Implementierung durch eine Mock-Version.
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

// Nach dem Mock können wir den gemockten authService importieren
import { authService } from '@/services/authService'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Vor jedem Test: Alle Mock-Aufrufe zurücksetzen
    vi.clearAllMocks()
    // LocalStorage auch cleanen für saubere Tests
    localStorage.clear()
  })

  it('should be logged out initially', () => {
    const authStore = useAuthStore()

    expect(authStore.isLoggedIn).toBe(false)
    expect(authStore.token).toBe(null)
  })

  it('sollte erfolgreich einloggen und Token speichern', async () => {
    // 1. ARRANGE (Setup)
    const authStore = useAuthStore()
    const mockToken = 'fake-jwt-token-12345'

    // Mock die login-Funktion so, dass sie einen erfolgreichen Response zurückgibt
    vi.mocked(authService.login).mockResolvedValue({
      token: mockToken,
    })

    // 2. ACT (Ausführung)
    await authStore.login({
      email: 'test@example.com',
      password: 'password123',
    })

    // 3. ASSERT (Überprüfung)
    expect(authStore.isLoggedIn).toBe(true)
    expect(authStore.token).toBe(mockToken)
    expect(authStore.authToken).toBe(mockToken)

    // Zusätzlich prüfen: Wurde der authService korrekt aufgerufen?
    expect(authService.login).toHaveBeenCalledOnce()
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })

    // Und: Wurde der Token im localStorage gespeichert?
    expect(localStorage.getItem('stocktracker-auth-token')).toBe(mockToken)
  })

  it('sollte bei fehlgeschlagenem Login einen Fehler werfen', async () => {
    // 1. ARRANGE
    const authStore = useAuthStore()

    // Mock die login-Funktion so, dass sie einen Fehler-Response zurückgibt
    vi.mocked(authService.login).mockResolvedValue({
      error: 'Invalid credentials',
    })

    // 2. ACT & ASSERT
    // Wir erwarten, dass die login-Action einen Fehler wirft
    await expect(
      authStore.login({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow('Invalid credentials')

    // Der Store sollte weiterhin ausgeloggt sein
    expect(authStore.isLoggedIn).toBe(false)
    expect(authStore.token).toBe(null)

    // Kein Token im localStorage
    expect(localStorage.getItem('stocktracker-auth-token')).toBe(null)
  })

  it('sollte beim Logout Token entfernen und ausloggen', () => {
    // 1. ARRANGE - Simuliere einen eingeloggten Zustand
    const authStore = useAuthStore()
    const mockToken = 'fake-token'

    // Setze Token direkt im Store (simuliert einen erfolgreichen Login)
    authStore.token = mockToken
    localStorage.setItem('stocktracker-auth-token', mockToken)

    // Verify setup
    expect(authStore.isLoggedIn).toBe(true)

    // 2. ACT
    authStore.logout()

    // 3. ASSERT
    expect(authStore.isLoggedIn).toBe(false)
    expect(authStore.token).toBe(null)
    expect(localStorage.getItem('stocktracker-auth-token')).toBe(null)
  })
})
