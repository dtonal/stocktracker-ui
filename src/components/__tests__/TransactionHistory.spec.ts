import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TransactionHistory from '../TransactionHistory.vue'
import type { Portfolio } from '@/types/portfolio'
import { TransactionType } from '@/types/transaction'

// Mock ConfirmationModal, da wir nicht dessen Funktionalität testen wollen
const ConfirmationModal = {
  template: '<div v-if="visible" class="confirmation-modal"></div>',
  props: ['visible'],
}

describe('TransactionHistory.vue', () => {
  const mockPortfolioWithoutTransactions: Portfolio = {
    id: '1',
    name: 'Empty Portfolio',
    description: 'An empty portfolio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1',
    transactions: [],
  }

  const mockPortfolioWithTransactions: Portfolio = {
    id: '2',
    name: 'My Portfolio',
    description: 'My portfolio description',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1',
    transactions: [
      {
        id: 't1',
        stockSymbol: 'AAPL',
        transactionDate: new Date().toISOString(),
        quantity: 10,
        pricePerShare: 150.0,
        transactionType: TransactionType.BUY,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 't2',
        stockSymbol: 'GOOGL',
        transactionDate: new Date().toISOString(),
        quantity: 5,
        pricePerShare: 2800.0,
        transactionType: TransactionType.BUY,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  }

  it('renders empty state when no transactions are available', () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithoutTransactions,
      },
      globals: {
        stubs: {
          ConfirmationModal: true,
          TrashIcon: true,
          PlusIcon: true,
        },
      },
    })
    expect(wrapper.find('.empty-state-container').exists()).toBe(true)
    expect(wrapper.text()).toContain('Keine Transaktionen')
  })

  it('renders transaction list when transactions are available', () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithTransactions,
      },
      globals: {
        stubs: {
          ConfirmationModal: true,
          TrashIcon: true,
          PlusIcon: true,
        },
      },
    })
    expect(wrapper.find('.transaction-list').exists()).toBe(true)
    const transactions = wrapper.findAll('.transaction-item')
    expect(transactions.length).toBe(2)
    expect(transactions[0].text()).toContain('BUY')
    expect(transactions[0].text()).toContain('AAPL')
    expect(transactions[1].text()).toContain('BUY')
    expect(transactions[1].text()).toContain('GOOGL')
  })

  it('emits openCreateTransactionModal when "Transaktion hinzufügen" is clicked', async () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithoutTransactions,
      },
      globals: {
        stubs: {
          ConfirmationModal: true,
          TrashIcon: true,
          PlusIcon: true,
        },
      },
    })
    await wrapper.find('.btn-primary').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('openCreateTransactionModal')
  })

  it('opens and closes confirmation modal for delete without confirming', async () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithTransactions,
      },
      // Wir müssen den ConfirmationModal hier richtig "stubben", damit wir seine Props kontrollieren können
      global: {
        stubs: {
          ConfirmationModal,
          TrashIcon: { template: '<svg></svg>' },
          PlusIcon: { template: '<svg></svg>' },
        },
      },
    })

    // Sicherstellen, dass das Modal anfangs nicht sichtbar ist
    expect(wrapper.findComponent(ConfirmationModal).props('visible')).toBe(false)

    // Klick auf den Löschen-Button der ersten Transaktion
    await wrapper.find('.btn-delete').trigger('click')

    // Sicherstellen, dass das Modal jetzt sichtbar ist
    expect(wrapper.findComponent(ConfirmationModal).props('visible')).toBe(true)

    // Das 'cancel'-Ereignis vom Modal auslösen
    await wrapper.findComponent(ConfirmationModal).vm.$emit('cancel')

    // Sicherstellen, dass das Modal wieder unsichtbar ist
    expect(wrapper.findComponent(ConfirmationModal).props('visible')).toBe(false)

    // Sicherstellen, dass kein 'delete'-Ereignis ausgelöst wurde
    expect(wrapper.emitted('delete')).toBeUndefined()
  })

  it('emits delete event with transactionId on delete confirmation', async () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithTransactions,
      },
      global: {
        stubs: {
          ConfirmationModal,
          TrashIcon: { template: '<svg></svg>' },
          PlusIcon: { template: '<svg></svg>' },
        },
      },
    })

    // Klick auf den Löschen-Button der ersten Transaktion
    await wrapper.find('.btn-delete').trigger('click')

    // Sicherstellen, dass das Modal sichtbar ist
    expect(wrapper.findComponent(ConfirmationModal).props('visible')).toBe(true)

    // Das 'confirm'-Ereignis vom Modal auslöfen
    await wrapper.findComponent(ConfirmationModal).vm.$emit('confirm')

    // Sicherstellen, dass das 'delete'-Ereignis ausgelöst wurde
    expect(wrapper.emitted()).toHaveProperty('delete')
    expect(wrapper.emitted('delete')).toHaveLength(1)
    expect(wrapper.emitted('delete')?.[0]).toEqual([
      mockPortfolioWithTransactions.transactions[0].id,
    ])

    // Sicherstellen, dass das Modal danach wieder geschlossen ist
    expect(wrapper.findComponent(ConfirmationModal).props('visible')).toBe(false)
  })
})
