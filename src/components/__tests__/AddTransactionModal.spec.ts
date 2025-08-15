import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AddTransactionModal from '../AddTransactionModal.vue'
import { TransactionType } from '@/types/transaction'
import type { NewTransactionData } from '@/types/transaction'
import { portfolioService } from '@/services/portfolioService'
import type { StockSearchItem, StockSearchResult } from '@/types/stock'

// Helper to ensure all promises are settled
const flushPromises = () => new Promise(setImmediate)

vi.mock('@/services/portfolioService', () => ({
  portfolioService: {
    searchStocks: vi.fn(),
    createTransaction: vi.fn(),
    // Add other methods if they are called inside the component
  },
}))

describe('AddTransactionModal', () => {
  const mockStock: StockSearchItem = {
    symbol: 'AAPL',
    description: 'Apple Inc. - Tech company',
    displaySymbol: 'AAPL',
    type: 'Common Stock',
    isSavedInDb: false,
  }

  const mockSearchResult: StockSearchResult = {
    count: 1,
    result: [mockStock],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(portfolioService.searchStocks).mockResolvedValue(mockSearchResult)
  })

  it('should not be visible when the visible prop is false', async () => {
    const wrapper = mount(AddTransactionModal, { props: { visible: false } })
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('should be visible when the visible prop is true', async () => {
    const wrapper = mount(AddTransactionModal, { props: { visible: true } })
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
  })

  it('should emit a close event when the cancel button is clicked', async () => {
    const wrapper = mount(AddTransactionModal, { props: { visible: true } })
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Abbrechen'))
      ?.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should emit a save event with the form data when the form is submitted', async () => {
    const wrapper = mount(AddTransactionModal, { props: { visible: true } })

    const transactionData = {
      type: TransactionType.SELL,
      ticker: 'AAPL',
      quantity: 10,
      price: 150.5,
      date: '2023-10-27',
    }

    // Search for stock
    await wrapper.find('#stock-search').setValue('Apple')
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Suchen'))
      ?.trigger('click')

    // Wait for async operations to complete
    await flushPromises()
    await wrapper.vm.$nextTick()

    // Select stock from search results
    await wrapper.find('.search-results li').trigger('click')
    await wrapper.vm.$nextTick()

    // Fill form fields - using more specific selectors
    await wrapper.find('select').setValue(transactionData.type)

    // Find quantity input (first number input)
    const quantityInput = wrapper.findAll('input[type="number"]')[0]
    await quantityInput.setValue(transactionData.quantity)

    // Find price input (second number input)
    const priceInput = wrapper.findAll('input[type="number"]')[1]
    await priceInput.setValue(transactionData.price)

    await wrapper.find('input[type="date"]').setValue(transactionData.date)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted()).toHaveProperty('save')
    const saveEvents = wrapper.emitted('save') as NewTransactionData[][]
    expect(saveEvents[0][0]).toEqual(transactionData)
  })

  it('should emit a close event after a successful save', async () => {
    const wrapper = mount(AddTransactionModal, { props: { visible: true } })

    // Search for stock
    await wrapper.find('#stock-search').setValue('Any Stock')
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Suchen'))
      ?.trigger('click')

    await flushPromises()
    await wrapper.vm.$nextTick()

    // Select stock from search results
    await wrapper.find('.search-results li').trigger('click')
    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted()).toHaveProperty('save')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('shows a message if search query is less than 3 characters', async () => {
    const wrapper = mount(AddTransactionModal, { props: { visible: true } })
    await wrapper.find('#stock-search').setValue('Ap')
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Suchen'))
      ?.trigger('click')

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.search-status-message').text()).toContain('mindestens 3 Zeichen')
    expect(portfolioService.searchStocks).not.toHaveBeenCalled()
  })

  it('shows a message if no stocks are found', async () => {
    vi.mocked(portfolioService.searchStocks).mockResolvedValue({ count: 0, result: [] })
    const wrapper = mount(AddTransactionModal, { props: { visible: true } })

    await wrapper.find('#stock-search').setValue('NonExistent')
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('Suchen'))
      ?.trigger('click')

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.search-status-message').text()).toContain('Keine Aktien gefunden')
  })
})
