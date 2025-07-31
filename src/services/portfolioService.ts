import axios from 'axios'
import type { Portfolio } from '@/types/portfolio'
import { useAuthStore } from '@/stores/authStore'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
// public ResponseEntity<List<PortfolioResponse>> getPortfoliosForCurrentUser() {
//     List<PortfolioResponse> portfolios = portfolioService.findPortfoliosForCurrentUser().stream()
//             .map(PortfolioResponse::new)
//             .collect(Collectors.toList());
//     return ResponseEntity.ok(portfolios);
// }
export async function getPortfoliosForCurrentUser(): Promise<Portfolio[]> {
  try {
    const response = await apiClient.get<Portfolio[]>('/portfolios')
    return response.data
  } catch (error) {
    console.error('Fehler beim Abrufen der Portfolios:', error)
    throw error
  }
}
