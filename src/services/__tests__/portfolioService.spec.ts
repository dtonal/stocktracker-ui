import { describe, it, expect, vi, beforeEach } from 'vitest'
import { portfolioService } from '../portfolioService'
import type { Portfolio, PortfolioCreateRequest } from '@/types/portfolio'

import { mockGet, mockPost, mockDelete } from '../__mocks__/apiClientFactory'

vi.mock('../apiClientFactory')

describe('portfolioService', () => {
  const mockPortfolios: Portfolio[] = [
    {
      id: '1',
      name: 'ETF Depot',
      description: 'Langfristig',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Zocker-Depot',
      description: 'Kurzfristig',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  beforeEach(() => {
    mockGet.mockReset()
    mockPost.mockReset()
    mockDelete.mockReset()
  })

  describe('getPortfoliosForCurrentUser', () => {
    it('sollte eine Liste von Portfolios zurückgeben', async () => {
      mockGet.mockResolvedValue({ data: mockPortfolios })

      const portfolios = await portfolioService.getPortfoliosForCurrentUser()

      expect(mockGet).toHaveBeenCalledWith('/portfolios')
      expect(portfolios).toEqual(mockPortfolios)
    })
  })

  describe('createPortfolio', () => {
    it('sollte das neu erstellte Portfolio zurückgeben', async () => {
      const newPortfolioRequest: PortfolioCreateRequest = {
        name: 'Neues Depot',
        description: 'Test',
      }
      const newPortfolioResponse: Portfolio = {
        id: '3',
        ...newPortfolioRequest,
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockPost.mockResolvedValue({ data: newPortfolioResponse })

      const result = await portfolioService.createPortfolio(newPortfolioRequest)

      expect(mockPost).toHaveBeenCalledWith('/portfolios', newPortfolioRequest)
      expect(result).toEqual(newPortfolioResponse)
    })
  })

  describe('deletePortfolio', () => {
    it('sollte die delete-Methode aufrufen', async () => {
      const portfolioId = 'portfolio-123'
      mockDelete.mockResolvedValue({})

      await portfolioService.deletePortfolio(portfolioId)

      expect(mockDelete).toHaveBeenCalledWith(`/portfolios/${portfolioId}`)
    })
  })
})
