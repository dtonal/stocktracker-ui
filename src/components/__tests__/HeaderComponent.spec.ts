import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/authStore'
import HeaderComponent from '@/components/HeaderComponent.vue'

describe('HeaderComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('if user is logged in, the component should render the user info', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const authStore = useAuthStore()

    // Act
    authStore.token = '1234567890'
    authStore.user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    }

    // HIER IST DER SCHLÜSSEL: Warte auf das nächste "DOM Update Tick"
    await wrapper.vm.$nextTick()

    const userInfo = wrapper.find('.user-info')
    expect(userInfo.text()).toContain('John Doe')
  })

  it('if user is logged in, the component should show logout button', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const authStore = useAuthStore()

    // Act
    authStore.token = '1234567890'
    authStore.user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    }
    await wrapper.vm.$nextTick()

    const logoutButton = wrapper.find('.logout-button')
    expect(logoutButton.exists()).toBe(true)
  })

  it('if user is not logged in, the component should show login and register buttons', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const loginButton = wrapper.find('RouterLink[to="/login"]')
    const registerButton = wrapper.find('RouterLink[to="/register"]')
    expect(loginButton.exists()).toBe(true)
    expect(registerButton.exists()).toBe(true)
  })

  it('if user is logged in and logout button is clicked, the user should be logged out', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const authStore = useAuthStore()

    // Act
    authStore.token = '1234567890'
    authStore.user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    }

    await wrapper.vm.$nextTick()

    const logoutButton = wrapper.find('.logout-button')
    await logoutButton.trigger('click')

    expect(authStore.logout).toHaveBeenCalled()
  })

  it('if user is logged in, login and register buttons should not be shown', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const authStore = useAuthStore()

    // Act
    authStore.token = '1234567890'
    authStore.user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    }

    await wrapper.vm.$nextTick()

    const loginButton = wrapper.find('RouterLink[to="/login"]')
    const registerButton = wrapper.find('RouterLink[to="/register"]')
    expect(loginButton.exists()).toBe(false)
    expect(registerButton.exists()).toBe(false)
  })
})
