import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AddTransactionModal, { type NewTransactionData } from '../AddTransactionModal.vue'
import { TransactionType } from '@/types/transaction'

describe('AddTransactionModal', () => {
  it('should not be visible when the visible prop is false', () => {
    const wrapper = mount(AddTransactionModal, {
      props: {
        visible: false,
      },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('should be visible when the visible prop is true', () => {
    const wrapper = mount(AddTransactionModal, {
      props: {
        visible: true,
      },
    })

    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.modal-title').text()).toBe('Transaktion hinzufügen')
  })

  it('should emit a close event when the cancel button is clicked', async () => {
    const wrapper = mount(AddTransactionModal, {
      props: {
        visible: true,
      },
    })

    await wrapper.find('button[type="button"]').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted().close).toHaveLength(1)
  })

  it('should emit a save event with the form data when the form is submitted', async () => {
    const wrapper = mount(AddTransactionModal, {
      props: {
        visible: true,
      },
    })

    const transactionData: NewTransactionData = {
      type: TransactionType.SELL,
      ticker: 'AAPL',
      quantity: 10,
      price: 150.5,
      date: '2023-10-27',
    }

    await wrapper.find('select').setValue(transactionData.type)
    await wrapper.find('input[type="text"]').setValue(transactionData.ticker)
    await wrapper.find('input[type="number"][min="1"]').setValue(transactionData.quantity)
    await wrapper.find('input[type="number"][step="0.01"]').setValue(transactionData.price)
    await wrapper.find('input[type="date"]').setValue(transactionData.date)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted()).toHaveProperty('save')
    expect(wrapper.emitted().save).toHaveLength(1)
    expect(wrapper.emitted().save[0][0]).toEqual(transactionData)
  })

  it('should emit a close event after a successful save', async () => {
    const wrapper = mount(AddTransactionModal, {
      props: {
        visible: true,
      },
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted()).toHaveProperty('save')
    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted().close).toHaveLength(1)
  })

  it('initial form values are set correctly', () => {
    const wrapper = mount(AddTransactionModal, {
      props: { visible: true },
    })

    const form = wrapper.vm.form
    expect(form.type).toBe(TransactionType.BUY)
    expect(form.ticker).toBe('')
    expect(form.quantity).toBe(0)
    expect(form.price).toBe(0)
    expect(form.date).toBe(new Date().toISOString().split('T')[0])
  })
})
