import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import RegisterView from '../RegisterView.vue'

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

// Nach dem Mock können wir den gemockten authService importieren
import { authService } from '@/services/authService'
import { afterEach } from 'vitest'

const mockRouter = {
  push: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

describe('RegisterView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sollte authStore.register aufrufen, wenn das Formular abgeschickt wird', async () => {
    vi.useFakeTimers()
    // Arrange
    vi.mocked(authService.register).mockResolvedValue({
      id: 'id',
      name: 'myName',
      email: 'test@test.com',
    })

    const wrapper = mount(RegisterView)

    // Act
    await wrapper.find('input[type="text"]').setValue('myName')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password')
    await wrapper.find('form').trigger('submit.prevent')

    // Assert
    expect(authService.register).toHaveBeenCalledOnce()
    expect(authService.register).toHaveBeenCalledWith({
      name: 'myName',
      email: 'test@test.com',
      password: 'password',
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.success-message').exists()).toBe(true)
    expect(wrapper.find('.success-message').text()).toContain('Registrierung erfolgreich')
    expect(wrapper.find('.error-message').exists()).toBe(false)

    await vi.runAllTimers()
    expect(mockRouter.push).toHaveBeenCalledOnce()
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })

  it('sollte eine Fehlermeldung anzeigen, wenn die Registrierung fehlschlägt', async () => {
    vi.useFakeTimers()

    vi.mocked(authService.register).mockRejectedValue(new Error('Registrierung fehlgeschlagen'))

    const wrapper = mount(RegisterView)

    await wrapper.find('input[type="text"]').setValue('myName')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password')
    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toContain('Registrierung fehlgeschlagen')
    expect(wrapper.find('.success-message').exists()).toBe(false)

    await vi.runAllTimers()
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('sollte eine Fehlermeldung anzeigen, wenn Registrierung unbekannte Fehler', async () => {
    vi.useFakeTimers()

    vi.mocked(authService.register).mockRejectedValue({ msg: 'unbekannter Fehler' })

    const wrapper = mount(RegisterView)

    await wrapper.find('input[type="text"]').setValue('myName')
    await wrapper.find('input[type="email"]').setValue('test@test.com')
    await wrapper.find('input[type="password"]').setValue('password')
    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toContain(
      'Ein unbekannter Fehler ist aufgetreten.',
    )
    expect(wrapper.find('.success-message').exists()).toBe(false)

    await vi.runAllTimers()
    expect(mockRouter.push).not.toHaveBeenCalled()
  })
})
