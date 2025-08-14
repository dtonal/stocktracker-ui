import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { usePortfolioStore } from '@/stores/portfolioStore'
import PortfolioDetailView from '../PortfolioDetailView.vue'
import type { Portfolio } from '@/types/portfolio'
import { TransactionType } from '@/types/transaction'

// Mocking vue-router
const mockRouter = {
  currentRoute: {
    value: {
      params: {
        id: '1',
      },
    },
  },
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

// Stubbing child components for isolation
const PortfolioDetailHeader = { template: '<div>PortfolioDetailHeader</div>' }
const PortfolioPositionList = { template: '<div>PortfolioPositionList</div>' }
const TransactionHistory = {
  template: '<div>TransactionHistory</div>',
  props: ['portfolio'],
  emits: ['openCreateTransactionModal', 'delete'],
}
const AddTransactionModal = {
  template: '<div v-if="visible">AddTransactionModal</div>',
  props: ['visible'],
  emits: ['close', 'save'],
}

describe('PortfolioDetailView.vue', () => {
  const mockPortfolio: Portfolio = {
    id: '1',
    name: 'Test Portfolio',
    description: 'A test portfolio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user1',
    transactions: [
      {
        id: 't1',
        stock: {
          id: 's1',
          symbol: 'AAPL',
          name: 'Apple',
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        transactionDate: new Date().toISOString(),
        quantity: 10,
        pricePerShare: 150,
        transactionType: TransactionType.BUY,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  }

  let portfolioStore: ReturnType<typeof usePortfolioStore>

  const createWrapper = (pinia: any) => {
    return mount(PortfolioDetailView, {
      global: {
        plugins: [pinia],
        stubs: {
          PortfolioDetailHeader,
          PortfolioPositionList,
          TransactionHistory,
          AddTransactionModal,
        },
      },
    })
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    const pinia = createTestingPinia({ createSpy: vi.fn })
    portfolioStore = usePortfolioStore(pinia)
  })

  it('zeigt den Ladezustand an, während das Portfolio geladen wird', () => {
    portfolioStore.isLoading = true
    const wrapper = createWrapper(portfolioStore)
    expect(wrapper.text()).toContain('Lade Portfolio...')
    expect(portfolioStore.fetchPortfolio).toHaveBeenCalledWith('1')
  })

  it('zeigt eine Fehlermeldung an, wenn das Laden fehlschlägt', () => {
    portfolioStore.isLoading = false
    portfolioStore.error = 'Netzwerkfehler'
    const wrapper = createWrapper(portfolioStore)
    expect(wrapper.text()).toContain('Fehler beim Laden: Netzwerkfehler')
  })

  it('rendert die Portfolio-Details, wenn das Laden erfolgreich war', () => {
    portfolioStore.isLoading = false
    portfolioStore.error = null
    portfolioStore.currentPortfolio = mockPortfolio
    const wrapper = createWrapper(portfolioStore)

    expect(wrapper.text()).toContain('Portfolio: Test Portfolio')
    expect(wrapper.findComponent(PortfolioDetailHeader).exists()).toBe(true)
    expect(wrapper.findComponent(PortfolioPositionList).exists()).toBe(true)
    expect(wrapper.findComponent(TransactionHistory).exists()).toBe(true)
  })

  it('öffnet und schließt das AddTransactionModal', async () => {
    portfolioStore.isLoading = false
    portfolioStore.currentPortfolio = mockPortfolio
    const wrapper = createWrapper(portfolioStore)

    // Modal ist anfangs nicht sichtbar
    expect(wrapper.findComponent(AddTransactionModal).props('visible')).toBe(false)

    // Öffnen des Modals simulieren
    const transactionHistory = wrapper.findComponent(TransactionHistory)
    await transactionHistory.vm.$emit('openCreateTransactionModal')

    expect(wrapper.findComponent(AddTransactionModal).props('visible')).toBe(true)

    // Schließen des Modals simulieren
    const modal = wrapper.findComponent(AddTransactionModal)
    await modal.vm.$emit('close')

    expect(wrapper.findComponent(AddTransactionModal).props('visible')).toBe(false)
  })

  it('ruft handleCreateTransaction im Store auf, wenn das Modal speichert', async () => {
    portfolioStore.isLoading = false
    portfolioStore.currentPortfolio = mockPortfolio
    const wrapper = createWrapper(portfolioStore)

    const newTransactionData = {
      type: TransactionType.SELL,
      ticker: 'AAPL',
      quantity: 5,
      price: 160,
      date: '2023-10-27',
    }

    const modal = wrapper.findComponent(AddTransactionModal)
    await modal.vm.$emit('save', newTransactionData)

    expect(portfolioStore.handleCreateTransaction).toHaveBeenCalledWith('1', newTransactionData)
  })

  it('ruft handleDeleteTransaction im Store auf, wenn das delete-Event ausgelöst wird', async () => {
    portfolioStore.isLoading = false
    portfolioStore.currentPortfolio = mockPortfolio
    const wrapper = createWrapper(portfolioStore)

    const transactionIdToDelete = 't1'

    const transactionHistory = wrapper.findComponent(TransactionHistory)
    await transactionHistory.vm.$emit('delete', transactionIdToDelete)

    expect(portfolioStore.handleDeleteTransaction).toHaveBeenCalledWith('1', transactionIdToDelete)
  })

  it('zeigt einen Transaktionsfehler an, wenn er im Store vorhanden ist', () => {
    portfolioStore.isLoading = false
    portfolioStore.currentPortfolio = mockPortfolio
    portfolioStore.transactionError = 'Nicht genügend Anteile zum Verkaufen'
    const wrapper = createWrapper(portfolioStore)

    expect(wrapper.text()).toContain('Nicht genügend Anteile zum Verkaufen')
  })
})
