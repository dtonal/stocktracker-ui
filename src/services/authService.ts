import axios from 'axios'
import type { AuthenticationRequest, AuthenticationResponse } from '@/types/auth'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authService = {
  async login(credentials: AuthenticationRequest): Promise<AuthenticationResponse> {
    try {
      const response = await apiClient.post<AuthenticationResponse>('/auth/login', credentials)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      throw new Error('Ein unerwarteter Fehler ist aufgetreten')
    }
  },
}
