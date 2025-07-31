import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Portfolio, PortfolioCreateRequest } from '@/types/portfolio'
import {
  getPortfoliosForCurrentUser,
  createPortfolio,
  deletePortfolio,
} from '@/services/portfolioService'

export const usePortfolioStore = defineStore('portfolio', () => {
  // STATE
  const portfolios = ref<Portfolio[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ACTIONS

  async function fetchPortfolios() {
    isLoading.value = true
    error.value = null

    try {
      portfolios.value = await getPortfoliosForCurrentUser()
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
    const response = await createPortfolio(request)
    portfolios.value.push(response)
  }

  async function handleDeletePortfolio(portfolioId: string) {
    await deletePortfolio(portfolioId)
    portfolios.value = portfolios.value.filter((portfolio) => portfolio.id !== portfolioId)
  }

  return {
    portfolios,
    isLoading,
    error,
    fetchPortfolios,
    handleCreatePortfolio,
    handleDeletePortfolio,
  }
})
