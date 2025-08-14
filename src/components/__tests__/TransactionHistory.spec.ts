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
      } as any, // Wir verwenden 'as any' wegen der Diskrepanz zwischen den Types und der tatsächlichen API
      {
        id: 't2',
        stockSymbol: 'GOOGL',
        transactionDate: new Date().toISOString(),
        quantity: 5,
        pricePerShare: 2800.0,
        transactionType: TransactionType.BUY,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any,
    ],
  }

  it('renders empty state when no transactions are available', () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithoutTransactions,
      },
      global: {
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

  it('renders transaction table when transactions are available', () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithTransactions,
      },
      global: {
        stubs: {
          ConfirmationModal: true,
          TrashIcon: true,
          PlusIcon: true,
        },
      },
    })

    // Überprüfen, ob die Tabelle existiert
    expect(wrapper.find('.transaction-table').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(true)

    // Überprüfen, ob Header vorhanden sind
    const headers = wrapper.findAll('th')
    expect(headers.length).toBe(7) // Typ, Symbol, Menge, Preis pro Aktie, Gesamtwert, Datum, Aktionen
    expect(headers[0].text()).toContain('Typ')
    expect(headers[1].text()).toContain('Symbol')
    expect(headers[2].text()).toContain('Menge')
    expect(headers[3].text()).toContain('Preis pro Aktie')
    expect(headers[4].text()).toContain('Gesamtwert')
    expect(headers[5].text()).toContain('Datum')
    expect(headers[6].text()).toContain('Aktionen')

    // Überprüfen, ob Transaktionszeilen vorhanden sind
    const transactionRows = wrapper.findAll('tbody tr')
    expect(transactionRows.length).toBe(2)

    // Überprüfen des Inhalts der ersten Transaktion
    const firstRow = transactionRows[0]
    const firstRowCells = firstRow.findAll('td')

    // Spezifische Zellen überprüfen
    expect(firstRowCells[0].text()).toContain('Kauf') // Transaktionstyp
    expect(firstRowCells[1].text()).toBe('AAPL') // Symbol
    expect(firstRowCells[2].text()).toBe('10') // Menge
    expect(firstRowCells[3].text()).toContain('150') // Preis (formatiert)

    // Überprüfen des Inhalts der zweiten Transaktion
    const secondRow = transactionRows[1]
    const secondRowCells = secondRow.findAll('td')

    expect(secondRowCells[0].text()).toContain('Kauf')
    expect(secondRowCells[1].text()).toBe('GOOGL')
    expect(secondRowCells[2].text()).toBe('5')
    expect(secondRowCells[3].text()).toContain('2.800,00 €')
  })

  it('displays formatted currency and dates correctly', () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithTransactions,
      },
      global: {
        stubs: {
          ConfirmationModal: true,
          TrashIcon: true,
          PlusIcon: true,
        },
      },
    })

    // Überprüfen, ob Währungsformatierung funktioniert (sollte EUR-Format haben)
    const priceCell = wrapper.find('.price')
    expect(priceCell.exists()).toBe(true)

    // Überprüfen, ob Gesamtwert berechnet wird
    const totalValueCell = wrapper.find('.total-value')
    expect(totalValueCell.exists()).toBe(true)

    // Überprüfen, ob Datumsformatierung vorhanden ist
    const dateCell = wrapper.find('.date')
    expect(dateCell.exists()).toBe(true)
  })

  it('displays transaction type badges with correct styling', () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithTransactions,
      },
      global: {
        stubs: {
          ConfirmationModal: true,
          TrashIcon: true,
          PlusIcon: true,
        },
      },
    })

    const transactionTypes = wrapper.findAll('.transaction-type')
    expect(transactionTypes.length).toBe(2)

    // Beide Transaktionen sind BUY, sollten also 'buy' Klasse haben
    transactionTypes.forEach((typeElement) => {
      expect(typeElement.classes()).toContain('buy')
      expect(typeElement.text()).toBe('Kauf')
    })
  })

  it('emits openCreateTransactionModal when "Transaktion hinzufügen" is clicked', async () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithoutTransactions,
      },
      global: {
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

    // Das 'confirm'-Ereignis vom Modal auslösen
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

  it('shows correct number of table columns', () => {
    const wrapper = mount(TransactionHistory, {
      props: {
        portfolio: mockPortfolioWithTransactions,
      },
      global: {
        stubs: {
          ConfirmationModal: true,
          TrashIcon: true,
          PlusIcon: true,
        },
      },
    })

    // Überprüfen, ob jede Transaktionszeile die richtige Anzahl von Zellen hat
    const firstRow = wrapper.find('tbody tr')
    const cells = firstRow.findAll('td')
    expect(cells.length).toBe(7) // Typ, Symbol, Menge, Preis, Gesamtwert, Datum, Aktionen
  })
})
