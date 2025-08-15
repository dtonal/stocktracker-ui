import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmationModal from '../ConfirmationModal.vue'

describe('ConfirmationModal.vue', () => {
  const mountComponent = (visible = true) => {
    return mount(ConfirmationModal, {
      props: {
        visible,
        title: 'Test Title',
        message: 'Test Message',
      },
    })
  }

  it('renders nothing when not visible', () => {
    const wrapper = mountComponent(false)
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('renders correctly when visible', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Message')
  })

  it('emits "confirm" event when confirm button is clicked', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.btn-danger').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('confirm')
  })

  it('emits "cancel" event when cancel button is clicked', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.btn-secondary').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('cancel')
  })

  it('emits "cancel" event when overlay is clicked', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.modal-overlay').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('cancel')
  })
})
