import axios from 'axios'
import type { AuthenticationRequest, AuthenticationResponse } from '@/types/auth'
import type { UserRegistrationRequest, UserResponse } from '@/types/user'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Extrahiert eine menschenlesbare Fehlermeldung aus einer Axios-Fehlerantwort.
 * Prüft auf Spring Boot Validierungsfehler und generische Fehlermeldungen.
 * @param error Der Axios-Fehler.
 * @returns Eine String-Fehlermeldung.
 */
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response && error.response.data) {
    const data = error.response.data
    // Prüfen auf Spring Boot @Valid-Fehlerstruktur
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].defaultMessage || 'Ein Validierungsfehler ist aufgetreten.'
    }
    // Prüfen auf unsere "einfache" Fehlerstruktur wie { "error": "Nachricht" }
    if (data.error) {
      return data.error
    }
    // Prüfen auf eine generische "message"-Eigenschaft
    if (data.message) {
      return data.message
    }
  }
  return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
}

export const authService = {
  async login(credentials: AuthenticationRequest): Promise<AuthenticationResponse> {
    try {
      const response = await apiClient.post<AuthenticationResponse>('/auth/login', credentials)
      return response.data
    } catch (error) {
      // Wir werfen den Fehler weiter, damit die Komponente ihn fangen und behandeln kann.
      // Axios packt den eigentlichen Fehler in das 'response'-Objekt.
      if (axios.isAxiosError(error) && error.response) {
        // Die Login-Antwort hat ein anderes Format, wir geben sie direkt zurück
        return error.response.data
      }
      throw new Error(extractErrorMessage(error))
    }
  },

  async register(data: UserRegistrationRequest): Promise<UserResponse> {
    try {
      const response = await apiClient.post<UserResponse>('/users/register', data)
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },

  async getMe(token: string): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error))
    }
  },
}
