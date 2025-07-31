import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Portfolio } from '@/types/portfolio'
import { getPortfoliosForCurrentUser } from '@/services/portfolioService'

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

  return {
    portfolios,
    isLoading,
    error,
    fetchPortfolios,
  }
})
