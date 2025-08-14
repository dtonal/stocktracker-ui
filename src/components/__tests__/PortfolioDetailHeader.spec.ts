import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioDetailHeader from '../PortfolioDetailHeader.vue'
import type { Portfolio } from '@/types/portfolio'

describe('PortfolioDetailHeader.vue', () => {
  const mockPortfolio: Portfolio = {
    id: '1',
    name: 'My Portfolio',
    description: 'My portfolio description',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1',
    transactions: [],
  }

  it('renders portfolio details when portfolio prop is provided', () => {
    const wrapper = mount(PortfolioDetailHeader, {
      props: {
        portfolio: mockPortfolio,
      },
    })

    expect(wrapper.find('.portfolio-detail-header').exists()).toBe(true)
    expect(wrapper.text()).toContain('Beschreibung:')
    expect(wrapper.text()).toContain(mockPortfolio.description)
    expect(wrapper.text()).toContain('Erstellt am:')
    expect(wrapper.text()).toContain(new Date(mockPortfolio.createdAt).toLocaleDateString())
    expect(wrapper.text()).toContain('Letzte Aktualisierung:')
    expect(wrapper.text()).toContain(new Date(mockPortfolio.updatedAt).toLocaleDateString())
  })

  it('does not render when portfolio prop is null', () => {
    const wrapper = mount(PortfolioDetailHeader, {
      props: {
        portfolio: null,
      },
    })

    expect(wrapper.find('.portfolio-detail-header').exists()).toBe(false)
  })
})
