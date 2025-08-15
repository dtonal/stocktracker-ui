import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioCard from '@/components/PortfolioCard.vue'
import type { Portfolio } from '@/types/portfolio'

const mockRouter = {
  push: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

describe('PortfolioCard.vue', () => {
  const mockPortfolio = {
    id: 'portfolio-123',
    name: 'My Test Portfolio',
    description: 'This is a test description.',
    createdAt: new Date().toISOString(),
  }

  const mountComponent = (portfolio: Partial<Portfolio>) => {
    return mount(PortfolioCard, {
      props: {
        portfolio,
      },
      global: {
        stubs: {
          DeleteIcon: { template: '<span>DELETE</span>' },
        },
      },
    })
  }

  it('renders portfolio information correctly', () => {
    const wrapper = mountComponent(mockPortfolio)
    expect(wrapper.text()).toContain('My Test Portfolio')
    expect(wrapper.text()).toContain('This is a test description.')
    expect(wrapper.text()).toContain(
      `Erstellt am: ${new Date(mockPortfolio.createdAt).toLocaleDateString()}`,
    )
  })

  it('renders a fallback message if description is missing', () => {
    const portfolioWithoutDescription = { ...mockPortfolio, description: '' }
    const wrapper = mountComponent(portfolioWithoutDescription)
    expect(wrapper.text()).toContain('Keine Beschreibung')
  })

  it('emits a delete event with portfolio id when delete button is clicked', async () => {
    const wrapper = mountComponent(mockPortfolio)
    await wrapper.find('.btn-delete').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('delete')
    expect(wrapper.emitted('delete')?.[0]).toEqual(['portfolio-123'])
  })

  it('navigates to detail view on "Zum Portfolio" button click', async () => {
    const wrapper = mountComponent(mockPortfolio)
    await wrapper.find('.card-footer .btn-secondary').trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'portfolio-detail',
      params: { id: 'portfolio-123' },
    })
  })

  it('navigates to detail view on double click', async () => {
    const wrapper = mountComponent(mockPortfolio)
    await wrapper.trigger('dblclick')
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'portfolio-detail',
      params: { id: 'portfolio-123' },
    })
  })
})
