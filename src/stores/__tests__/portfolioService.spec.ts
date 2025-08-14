import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePortfolioStore } from '../portfolioStore'

vi.mock('@/services/portfolioService', () => ({
  portfolioService: {
    getPortfoliosForCurrentUser: vi.fn(),
    createPortfolio: vi.fn(),
    deletePortfolio: vi.fn(),
    getPortfolio: vi.fn(),
    createTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
  },
}))

import { portfolioService } from '@/services/portfolioService'
import type { NewTransactionData } from '@/components/AddTransactionModal.vue'
import { TransactionType } from '@/types/transaction'
import { isAxiosError } from 'axios'

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

  it('sollte initial nicht im loading state sein', () => {
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

  it('sollte einen unbekannten Fehler beim Laden der Portfolios behandeln', async () => {
    const errorMessage = 'Ein unbekannter Fehler ist aufgetreten.'
    vi.mocked(portfolioService.getPortfoliosForCurrentUser).mockRejectedValue({})
    const portfolioStore = usePortfolioStore()
    await portfolioStore.fetchPortfolios()
    expect(portfolioStore.error).toBe(errorMessage)
  })

  it('sollte einen unbekannten Fehler beim Erstellen des Portfolios behandeln', async () => {
    const errorMessage = 'Ein unbekannter Fehler ist aufgetreten.'
    vi.mocked(portfolioService.createPortfolio).mockRejectedValue({})
    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleCreatePortfolio('Neues Depot', 'Test')
    expect(portfolioStore.error).toBe(errorMessage)
  })

  it('sollte einen unbekannten Fehler beim Löschen des Portfolios behandeln', async () => {
    const errorMessage = 'Ein unbekannter Fehler ist aufgetreten.'
    vi.mocked(portfolioService.deletePortfolio).mockRejectedValue({})
    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleDeletePortfolio('1')
    expect(portfolioStore.error).toBe(errorMessage)
  })

  it('sollte ein einzelnes Portfolio laden können', async () => {
    const mockPortfolio = {
      id: '1',
      name: 'Test Portfolio',
      description: 'Test',
      transactions: [],
      createdAt: '',
      updatedAt: '',
      userId: '',
    }
    vi.mocked(portfolioService.getPortfolio).mockResolvedValue(mockPortfolio)
    const portfolioStore = usePortfolioStore()
    await portfolioStore.fetchPortfolio('1')
    expect(portfolioService.getPortfolio).toHaveBeenCalledWith('1')
    expect(portfolioStore.currentPortfolio).toEqual(mockPortfolio)
  })

  it('sollte einen Fehler beim Laden eines einzelnen Portfolios behandeln', async () => {
    const errorMessage = 'Fehler beim Laden'
    vi.mocked(portfolioService.getPortfolio).mockRejectedValue(new Error(errorMessage))
    const portfolioStore = usePortfolioStore()
    await portfolioStore.fetchPortfolio('1')
    expect(portfolioStore.error).toBe(errorMessage)
  })

  it('sollte einen unbekannten Fehler beim Laden eines einzelnen Portfolios behandeln', async () => {
    const errorMessage = 'Ein unbekannter Fehler ist aufgetreten.'
    vi.mocked(portfolioService.getPortfolio).mockRejectedValue({})
    const portfolioStore = usePortfolioStore()
    await portfolioStore.fetchPortfolio('1')
    expect(portfolioStore.error).toBe(errorMessage)
  })

  it('sollte eine Transaktion erstellen können', async () => {
    const portfolioId = '1'
    const newTransaction: NewTransactionData = {
      type: TransactionType.BUY,
      ticker: 'AAPL',
      quantity: 10,
      price: 150,
      date: '2023-01-01',
    }
    const portfolioStore = usePortfolioStore()
    portfolioStore.currentPortfolio = {
      id: portfolioId,
      name: 'Test',
      description: '',
      transactions: [],
      createdAt: '',
      updatedAt: '',
      userId: '',
    }
    vi.mocked(portfolioService.createTransaction).mockResolvedValue(undefined)
    vi.mocked(portfolioService.getPortfolio).mockResolvedValue(portfolioStore.currentPortfolio)

    await portfolioStore.handleCreateTransaction(portfolioId, newTransaction)

    expect(portfolioService.createTransaction).toHaveBeenCalled()
    expect(portfolioService.getPortfolio).toHaveBeenCalledWith(portfolioId)
  })

  it('sollte einen Fehler werfen, wenn kein Portfolio beim Erstellen einer Transaktion vorhanden ist', async () => {
    const portfolioStore = usePortfolioStore()
    portfolioStore.currentPortfolio = null
    await portfolioStore.handleCreateTransaction('1', {} as NewTransactionData)
    expect(portfolioStore.transactionError).toContain('Portfolio not found')
  })

  it('sollte einen Axios-Fehler beim Erstellen einer Transaktion behandeln', async () => {
    const backendError = 'Nicht genügend Guthaben'
    const axiosError = { isAxiosError: true, response: { data: { error: backendError } } }
    vi.mocked(portfolioService.createTransaction).mockRejectedValue(axiosError)

    const portfolioStore = usePortfolioStore()
    portfolioStore.currentPortfolio = {
      id: '1',
      name: 'Test',
      description: '',
      transactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '',
    }

    await portfolioStore.handleCreateTransaction('1', {
      type: TransactionType.BUY,
      ticker: 'AAPL',
      quantity: 10,
      price: 150,
      date: '2023-01-01',
    } as NewTransactionData)
    console.log(portfolioStore.transactionError)
    expect(portfolioStore.transactionError).toContain(backendError)
  })

  it('sollte einen generischen Axios-Fehler beim Erstellen einer Transaktion behandeln', async () => {
    const axiosError = { isAxiosError: true, response: { data: {} } } // Kein 'error'-Feld
    vi.mocked(portfolioService.createTransaction).mockRejectedValue(axiosError)

    const portfolioStore = usePortfolioStore()
    portfolioStore.currentPortfolio = {
      id: '1',
      name: 'Test',
      description: '',
      transactions: [],
      createdAt: '',
      updatedAt: '',
      userId: '',
    }

    await portfolioStore.handleCreateTransaction('1', {
      type: TransactionType.BUY,
      ticker: 'AAPL',
      quantity: 10,
      price: 150,
      date: '2023-01-01',
    } as NewTransactionData)
    expect(portfolioStore.transactionError).toBe('Ein unbekannter Fehler ist aufgetreten.')
  })

  it('sollte einen unbekannten Fehler beim Erstellen einer Transaktion behandeln', async () => {
    vi.mocked(portfolioService.createTransaction).mockRejectedValue({})
    const portfolioStore = usePortfolioStore()
    portfolioStore.currentPortfolio = {
      id: '1',
      name: 'Test',
      description: '',
      transactions: [],
      createdAt: '',
      updatedAt: '',
      userId: '',
    }
    await portfolioStore.handleCreateTransaction('1', {
      type: TransactionType.BUY,
      ticker: 'AAPL',
      quantity: 10,
      price: 150,
      date: '2023-01-01',
    } as NewTransactionData)
    expect(portfolioStore.transactionError).toBe('Ein unbekannter Fehler ist aufgetreten.')
  })

  it('sollte eine Transaktion löschen können', async () => {
    const portfolioId = '1'
    const transactionId = 't1'
    const portfolioStore = usePortfolioStore()
    portfolioStore.currentPortfolio = {
      id: portfolioId,
      name: 'Test',
      description: '',
      transactions: [],
      createdAt: '',
      updatedAt: '',
      userId: '',
    }
    vi.mocked(portfolioService.deleteTransaction).mockResolvedValue(undefined)
    vi.mocked(portfolioService.getPortfolio).mockResolvedValue(portfolioStore.currentPortfolio)

    await portfolioStore.handleDeleteTransaction(portfolioId, transactionId)

    expect(portfolioService.deleteTransaction).toHaveBeenCalledWith(portfolioId, transactionId)
    expect(portfolioService.getPortfolio).toHaveBeenCalledWith(portfolioId)
  })

  it('sollte einen Fehler beim Löschen einer Transaktion behandeln', async () => {
    const errorMessage = 'Fehler beim Löschen'
    vi.mocked(portfolioService.deleteTransaction).mockRejectedValue(new Error(errorMessage))
    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleDeleteTransaction('1', 't1')
    expect(portfolioStore.transactionError).toContain(errorMessage)
  })

  it('sollte einen unbekannten Fehler beim Löschen einer Transaktion behandeln', async () => {
    vi.mocked(portfolioService.deleteTransaction).mockRejectedValue({})
    const portfolioStore = usePortfolioStore()
    await portfolioStore.handleDeleteTransaction('1', 't1')
    expect(portfolioStore.transactionError).toBe('Ein unbekannter Fehler ist aufgetreten.')
  })
})
