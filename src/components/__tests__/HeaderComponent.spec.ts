import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/authStore'
import HeaderComponent from '@/components/HeaderComponent.vue'
import type { UserResponse } from '@/types/user'

describe('HeaderComponent.vue', () => {
  // Helper function to mount the component with a specific auth state
  const createWrapper = (isLoggedIn = false, user: Partial<UserResponse> | null = null) => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const authStore = useAuthStore(pinia)

    // Set store state
    authStore.token = isLoggedIn ? 'fake-token' : null
    authStore.user = isLoggedIn ? (user as UserResponse) : null

    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })
    return { wrapper, authStore }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when user is not logged in', () => {
    it('shows login and register links', () => {
      const { wrapper } = createWrapper(false)
      expect(wrapper.find('a[to="/login"]').exists()).toBe(true)
      expect(wrapper.find('a[to="/register"]').exists()).toBe(true)
    })

    it('does not show user info or logout button', () => {
      const { wrapper } = createWrapper(false)
      expect(wrapper.find('.user-info').exists()).toBe(false)
      expect(wrapper.find('.logout-button').exists()).toBe(false)
    })
  })

  describe('when user is logged in', () => {
    it('shows user name when available', async () => {
      const { wrapper } = createWrapper(true, {
        id: '1',
        email: 'user@test.com',
        name: 'Test User',
      })
      expect(wrapper.find('.user-info').text()).toBe('Hallo, Test User')
    })

    it('shows fallback text when user name is not available', async () => {
      const { wrapper } = createWrapper(true, { id: '1', email: 'user@test.com' }) // No name property
      expect(wrapper.find('.user-info').text()).toBe('Hallo, Benutzer')
    })

    it('shows portfolio link and logout button', () => {
      const { wrapper } = createWrapper(true, { id: '1', name: 'Test' })
      expect(wrapper.find('a[to="/portfolio"]').exists()).toBe(true)
      expect(wrapper.find('.logout-button').exists()).toBe(true)
    })

    it('does not show login and register links', () => {
      const { wrapper } = createWrapper(true, { id: '1', name: 'Test' })
      expect(wrapper.find('a[to="/login"]').exists()).toBe(false)
      expect(wrapper.find('a[to="/register"]').exists()).toBe(false)
    })

    it('calls authStore.logout when logout button is clicked', async () => {
      const { wrapper, authStore } = createWrapper(true, { id: '1', name: 'Test' })
      await wrapper.find('.logout-button').trigger('click')
      expect(authStore.logout).toHaveBeenCalledOnce()
    })
  })
})
