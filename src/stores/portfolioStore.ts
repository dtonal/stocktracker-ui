import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Portfolio, PortfolioCreateRequest } from '@/types/portfolio'
import { portfolioService } from '@/services/portfolioService'

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

  return {
    portfolios,
    isLoading,
    error,
    fetchPortfolios,
    handleCreatePortfolio,
    handleDeletePortfolio,
  }
})
