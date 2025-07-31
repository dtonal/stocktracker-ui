import type { Portfolio, PortfolioCreateRequest } from '@/types/portfolio'
import apiClientFactory from './apiClientFactory'

const apiClient = apiClientFactory()

export const portfolioService = {
  async getPortfoliosForCurrentUser(): Promise<Portfolio[]> {
    try {
      const response = await apiClient.get<Portfolio[]>('/portfolios')
      console.log('getPortfoliosForCurrentUser response:', response.data)
      return response.data
    } catch (error) {
      console.error('Fehler beim Abrufen der Portfolios:', error)
      throw error
    }
  },
  async createPortfolio(request: PortfolioCreateRequest): Promise<Portfolio> {
    try {
      const response = await apiClient.post<Portfolio>('/portfolios', request)
      return response.data
    } catch (error) {
      console.error('Fehler beim Erstellen des Portfolios:', error)
      throw error
    }
  },
  async deletePortfolio(portfolioId: string): Promise<void> {
    try {
      await apiClient.delete(`/portfolios/${portfolioId}`)
    } catch (error) {
      console.error('Fehler beim Löschen des Portfolios:', error)
      throw error
    }
  },
}
