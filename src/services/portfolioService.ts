import type { Portfolio, PortfolioCreateRequest } from '@/types/portfolio'
import type { NewTransactionData } from '@/types/transaction'
import apiClientFactory from './apiClientFactory'
import type { StockSearchResult } from '@/types/stock'

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
  async getPortfolio(portfolioId: string): Promise<Portfolio> {
    try {
      const response = await apiClient.get<Portfolio>(`/portfolios/${portfolioId}`)
      return response.data
    } catch (error) {
      console.error('Fehler beim Abrufen des Portfolios:', error)
      throw error
    }
  },
  async createTransaction(portfolioId: string, data: NewTransactionData): Promise<void> {
    try {
      console.log('createTransaction', portfolioId, data)
      await apiClient.post(`/portfolios/${portfolioId}/transactions`, data)
    } catch (error) {
      console.error('Fehler beim Erstellen der Transaktion:', error)
      throw error
    }
  },
  async deleteTransaction(portfolioId: string, transactionId: string): Promise<void> {
    try {
      await apiClient.delete(`/portfolios/${portfolioId}/transactions/${transactionId}`)
    } catch (error) {
      console.error('Fehler beim Löschen der Transaktion:', error)
      throw error
    }
  },
  async searchStocks(query: string): Promise<StockSearchResult> {
    if (!query || query.length < 3 || query.trim() === '') {
      return {
        count: 0,
        items: [],
      }
    }
    try {
      const response = await apiClient.get<StockSearchResult>(`/stocks/search?query=${query}`)
      return response.data
    } catch (error) {
      console.error('Fehler beim Suchen der Aktien:', error)
      throw error
    }
  },
}
