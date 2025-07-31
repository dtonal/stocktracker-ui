import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePortfolioStore } from '../portfolioStore'

vi.mock('@/services/portfolioService', () => ({
  portfolioService: {
    getPortfoliosForCurrentUser: vi.fn(),
    createPortfolio: vi.fn(),
    deletePortfolio: vi.fn(),
  },
}))

import { portfolioService } from '@/services/portfolioService'

describe('Portfolio Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sollte initial keine Portfolios haben', () => {
    const portfolioStore = usePortfolioStore()
    expect(portfolioStore.portfolios).toEqual([])
  })

  it('sollte initiaö nicht im loading state sein', () => {
    const portfolioStore = usePortfolioStore()
    expect(portfolioStore.isLoading).toBe(false)
  })

  it('sollte Portfolios laden können', async () => {
    const mockPortfolios = [
      {
        id: '1',
        name: 'ETF Depot',
        description: 'Langfristig',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
      },
      {
        id: '2',
        name: 'Zocker-Depot',
        description: 'Kurzfristig',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
      },
    ]
    vi.mocked(portfolioService.getPortfoliosForCurrentUser).mockResolvedValue(mockPortfolios)

    const portfolioStore = usePortfolioStore()
    await portfolioStore.fetchPortfolios()

    expect(portfolioService.getPortfoliosForCurrentUser).toHaveBeenCalled()
    expect(portfolioStore.portfolios).toEqual(mockPortfolios)
  })

  it('sollte einen Fehler werfen, wenn das Laden der Portfolios fehlschlägt', async () => {
    const errorMessage = 'Fehler beim Laden der Portfolios'
    vi.mocked(portfolioService.getPortfoliosForCurrentUser).mockRejectedValue(
      new Error(errorMessage),
    )

    const portfolioStore = usePortfolioStore()
    await portfolioStore.fetchPortfolios()

    expect(portfolioService.getPortfoliosForCurrentUser).toHaveBeenCalled()
    expect(portfolioStore.error).toBe(errorMessage)
  })

  it('sollte ein Portfolio erstellen können', async () => {
    const newPortfolio = {
      id: '3',
      name: 'Neues Depot',
      description: 'Test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1',
    }
    vi.mocked(portfolioService.createPortfolio).mockResolvedValue(newPortfolio)

    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleCreatePortfolio('Neues Depot', 'Test')

    expect(portfolioService.createPortfolio).toHaveBeenCalledWith({
      name: 'Neues Depot',
      description: 'Test',
    })
    expect(portfolioStore.portfolios).toEqual([newPortfolio])
  })

  it('sollte ein Portfolio löschen können', async () => {
    const portfolioId = '1'
    vi.mocked(portfolioService.deletePortfolio).mockResolvedValue(undefined)
    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleDeletePortfolio(portfolioId)

    expect(portfolioService.deletePortfolio).toHaveBeenCalledWith(portfolioId)
    expect(portfolioStore.portfolios).toEqual([])
  })

  it('sollte einen Fehler werfen, wenn das Erstellen des Portfolios fehlschlägt', async () => {
    const errorMessage = 'Fehler beim Erstellen des Portfolios'
    vi.mocked(portfolioService.createPortfolio).mockRejectedValue(new Error(errorMessage))

    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleCreatePortfolio('Neues Depot', 'Test')

    expect(portfolioService.createPortfolio).toHaveBeenCalledWith({
      name: 'Neues Depot',
      description: 'Test',
    })
    expect(portfolioStore.error).toBe(errorMessage)
  })

  it('sollte einen Fehler werfen, wenn das Löschen des Portfolios fehlschlägt', async () => {
    const errorMessage = 'Fehler beim Löschen des Portfolios'
    vi.mocked(portfolioService.deletePortfolio).mockRejectedValue(new Error(errorMessage))
    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleDeletePortfolio('1')
  })

  it('sollte initial keinen Fehler haben', () => {
    const portfolioStore = usePortfolioStore()
    expect(portfolioStore.error).toBe(null)
  })

  it('fehler sollte zurückgesetzt werden, wenn Portfolios geladen werden', async () => {
    const portfolioStore = usePortfolioStore()
    const mockPortfolios = [
      {
        id: '1',
        name: 'ETF Depot',
        description: 'Langfristig',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
      },
    ]
    portfolioStore.error = 'Fehler'
    vi.mocked(portfolioService.getPortfoliosForCurrentUser).mockResolvedValue(mockPortfolios)

    await portfolioStore.fetchPortfolios()
    expect(portfolioStore.error).toBe(null)
  })

  it('sollte im loading state sein, WÄHREND Portfolios geladen werden', async () => {
    const portfolioStore = usePortfolioStore()
    vi.mocked(portfolioService.getPortfoliosForCurrentUser).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
    )

    const fetchPromise = portfolioStore.fetchPortfolios()

    expect(portfolioStore.isLoading).toBe(true)

    await fetchPromise

    expect(portfolioStore.isLoading).toBe(false)
  })
})
