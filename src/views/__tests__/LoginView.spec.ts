import { describe, it, expect, vi, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing' // Speziell für Tests!
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/authStore'

// Mocken des Routers
const mockRouter = {
  push: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

describe('LoginView.vue', () => {
  it('sollte authStore.login aufrufen, wenn das Formular abgeschickt wird', async () => {
    // Arrange
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })], // Erstellt einen gemockten Pinia-Store
        stubs: {
          RouterLink: true,
        },
      },
    })

    const authStore = useAuthStore()

    // Act
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password')
    await wrapper.find('form').trigger('submit.prevent')

    // Assert
    expect(authStore.login).toHaveBeenCalledOnce()
    expect(authStore.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
    })
  })

  it('sollte eine Fehlermeldung anzeigen, wenn der Login fehlschlägt', async () => {
    // Arrange
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const authStore = useAuthStore()
    // Simuliere einen Fehler
    ;(authStore.login as Mock).mockRejectedValue(new Error('Falsche Anmeldedaten'))

    // Act
    await wrapper.find('form').trigger('submit.prevent')

    // Assert
    // Warten, bis das DOM aktualisiert wurde
    await wrapper.vm.$nextTick()

    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain('Falsche Anmeldedaten')
  })

  it('sollte einen unbekannten Fehler anzeigen, wenn der Login fehlschlägt', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          RouterLink: true,
        },
      },
    })

    const authStore = useAuthStore()
    ;(authStore.login as Mock).mockRejectedValue('Some weird error') // Not an Error instance

    await wrapper.find('#email').setValue('test@test.com')
    await wrapper.find('#password').setValue('password')
    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick() // Wait for DOM update after error

    expect(authStore.login).toHaveBeenCalledOnce()
    expect(wrapper.find('.error-message').text()).toBe('Ein unbekannter Fehler ist aufgetreten.')
  })
})
