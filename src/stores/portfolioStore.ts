import type { NewTransactionData } from '@/components/AddTransactionModal.vue'
import { portfolioService } from '@/services/portfolioService'
import type { Portfolio, PortfolioCreateRequest } from '@/types/portfolio'
import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  // STATE
  const portfolios = ref<Portfolio[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPortfolio = ref<Portfolio | null>(null)
  const transactionError = ref<string | null>(null)

  // ACTIONS
  async function fetchPortfolios() {
    isLoading.value = true
    error.value = null

    try {
      portfolios.value = await portfolioService.getPortfoliosForCurrentUser()
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
        console.error('Fehler beim Abrufen der Portfolios:', e)
      } else {
        error.value = 'Ein unbekannter Fehler ist aufgetreten.'
        console.error('Fehler beim Abrufen der Portfolios:', e)
      }
    } finally {
      isLoading.value = false
    }
  }

  async function handleCreatePortfolio(name: string, description: string) {
    const request: PortfolioCreateRequest = { name, description }
    try {
      const response = await portfolioService.createPortfolio(request)
      portfolios.value.push(response)
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
        console.error('Fehler beim Erstellen des Portfolios:', e)
      } else {
        error.value = 'Ein unbekannter Fehler ist aufgetreten.'
        console.error('Fehler beim Erstellen des Portfolios:', e)
      }
    }
  }

  async function handleDeletePortfolio(portfolioId: string) {
    try {
      await portfolioService.deletePortfolio(portfolioId)
      portfolios.value = portfolios.value.filter((portfolio) => portfolio.id !== portfolioId)
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
        console.error('Fehler beim Löschen des Portfolios:', e)
      } else {
        error.value = 'Ein unbekannter Fehler ist aufgetreten.'
        console.error('Fehler beim Löschen des Portfolios:', e)
      }
    }
  }

  async function fetchPortfolio(portfolioId: string) {
    isLoading.value = true
    error.value = null

    try {
      currentPortfolio.value = await portfolioService.getPortfolio(portfolioId)
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
        console.error('Fehler beim Abrufen des Portfolios:', e)
      } else {
        error.value = 'Ein unbekannter Fehler ist aufgetreten.'
        console.error('Fehler beim Abrufen des Portfolios:', e)
      }
    } finally {
      isLoading.value = false
    }
  }

  async function handleCreateTransaction(portfolioId: string, data: NewTransactionData) {
    transactionError.value = null
    try {
      console.log('handleCreateTransaction store', portfolioId, data)
      if (!currentPortfolio.value) {
        throw new Error('Portfolio not found')
      }

      const transactionData = {
        portfolioId: portfolioId,
        stockSymbol: data.ticker,
        transactionType: data.type,
        quantity: data.quantity,
        pricePerShare: data.price,
        transactionDate: new Date(data.date).toISOString(),
      }

      await portfolioService.createTransaction(portfolioId, transactionData)
      // Optimistic update - this might need adjustment based on what the API returns
      // Assuming the backend doesn't return the full transaction object immediately
      // For now, we refresh the whole portfolio to get the updated transaction list
      await fetchPortfolio(portfolioId)
    } catch (err: unknown) {
      console.error('Fehler beim Erstellen der Transaktion:', err)

      if (isAxiosError<{ error?: string }>(err)) {
        const backendError = err.response?.data?.error
        if (backendError) {
          transactionError.value = backendError
        } else {
          transactionError.value = 'Ein unbekannter Fehler ist aufgetreten.'
        }
      } else if (err instanceof Error) {
        transactionError.value = 'Fehler beim Erstellen der Transaktion: ' + err.message
      } else {
        transactionError.value = 'Ein unbekannter Fehler ist aufgetreten.'
      }
    }
  }

  async function handleDeleteTransaction(portfolioId: string, transactionId: string) {
    try {
      await portfolioService.deleteTransaction(portfolioId, transactionId)
      await fetchPortfolio(portfolioId)
    } catch (e) {
      if (e instanceof Error) {
        transactionError.value = 'Fehler beim Löschen der Transaktion: ' + e.message
        console.error('Fehler beim Löschen der Transaktion:', e)
      } else {
        transactionError.value = 'Ein unbekannter Fehler ist aufgetreten.'
        console.error('Fehler beim Löschen der Transaktion:', e)
      }
    }
  }
  return {
    portfolios,
    isLoading,
    error,
    fetchPortfolios,
    handleCreatePortfolio,
    handleDeletePortfolio,
    currentPortfolio,
    fetchPortfolio,
    handleCreateTransaction,
    handleDeleteTransaction,
    transactionError,
  }
})
