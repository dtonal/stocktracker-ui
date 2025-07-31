import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import PortfolioView from '../PortfolioView.vue'
import { usePortfolioStore } from '@/stores/portfolioStore'

describe('PortfolioView.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof PortfolioView>>
  let portfolioStore: ReturnType<typeof usePortfolioStore>

  // beforeEach sorgt für einen sauberen Start für jeden einzelnen Test
  beforeEach(() => {
    wrapper = mount(PortfolioView, {
      global: {
        plugins: [
          createTestingPinia({
            // createSpy ersetzt Store-Aktionen automatisch mit Mocks (Spies)
            createSpy: vi.fn,
          }),
        ],
      },
    })
    portfolioStore = usePortfolioStore()
  })

  it('sollte Portfolios anzeigen, wenn sie im Store vorhanden sind', async () => {
    // Arrange: Setze den Store-Zustand direkt
    portfolioStore.portfolios = [
      {
        id: '1',
        name: 'ETF Depot',
        description: 'Langfristig',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
      },
    ]

    // Act: Warte, bis Vue die Ansicht aktualisiert hat
    await wrapper.vm.$nextTick()

    // Assert: Prüfe, ob die Elemente gerendert wurden
    const cards = wrapper.findAll('.portfolio-card')
    expect(cards.length).toBe(1)
    expect(cards[0].text()).toContain('ETF Depot')
    expect(cards[0].text()).toContain('Langfristig')
  })

  it('sollte bei Klick auf "Speichern" die Store-Aktion aufrufen', async () => {
    // Arrange: Zeige das Formular an und fülle es aus
    await wrapper.find('button.btn-primary').trigger('click')
    const newPortfolioName = 'Neues Depot'
    const newPortfolioDescription = 'Testbeschreibung'
    await wrapper.find('input[id="portfolio-name"]').setValue(newPortfolioName)
    await wrapper.find('textarea[id="portfolio-description"]').setValue(newPortfolioDescription)

    // Act: Sende das Formular ab
    await wrapper.find('form.create-form').trigger('submit')

    // Assert: Prüfe, ob die richtige Store-Aktion mit den richtigen Daten aufgerufen wurde
    expect(portfolioStore.handleCreatePortfolio).toHaveBeenCalledTimes(1)
    expect(portfolioStore.handleCreatePortfolio).toHaveBeenCalledWith(
      newPortfolioName,
      newPortfolioDescription,
    )
  })

  it('sollte bei Klick auf den Löschen-Button die Store-Aktion aufrufen', async () => {
    // Arrange: Erstelle ein Portfolio, das wir löschen können
    const portfolioIdToDelete = 'p1'
    portfolioStore.portfolios = [
      {
        id: portfolioIdToDelete,
        name: 'Zum Löschen',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1',
      },
    ]
    await wrapper.vm.$nextTick()

    // Act: Klicke auf den Löschen-Button
    await wrapper.find('.btn-delete').trigger('click')

    // Assert: Prüfe, ob die richtige Store-Aktion aufgerufen wurde
    expect(portfolioStore.handleDeletePortfolio).toHaveBeenCalledTimes(1)
    expect(portfolioStore.handleDeletePortfolio).toHaveBeenCalledWith(portfolioIdToDelete)
  })

  it('wenn keine Portfolios vorhanden sind, sollte ein leerer State angezeigt werden', async () => {
    // Arrange: Leere Portfolios im Store
    portfolioStore.portfolios = []

    // Act: Warte, bis Vue die Ansicht aktualisiert hat
    await wrapper.vm.$nextTick()

    // Assert: Prüfe, ob der leere State angezeigt wird
    const stateContainer = wrapper.find('.state-container')
    expect(stateContainer.exists()).toBe(true)
    expect(stateContainer.text()).toContain('Noch keine Portfolios')
  })

  it('nach dem hinzufügen eines Portfolios, ist das formular nach erneutem aufruf leer', async () => {
    // Arrange: Zeige das Formular an und fülle es aus
    await wrapper.find('button.btn-primary').trigger('click')
    const newPortfolioName = 'Neues Depot'
    const newPortfolioDescription = 'Testbeschreibung'
    await wrapper.find('input[id="portfolio-name"]').setValue(newPortfolioName)
    await wrapper.find('textarea[id="portfolio-description"]').setValue(newPortfolioDescription)

    // Act: Sende das Formular ab
    await wrapper.find('form.create-form').trigger('submit')

    await wrapper.vm.$nextTick()

    await wrapper.find('button.btn-primary').trigger('click')

    // Assert: Prüfe, ob das Formular leer ist
    const nameInput = wrapper.find('input[id="portfolio-name"]').element as HTMLInputElement
    const descriptionInput = wrapper.find('textarea[id="portfolio-description"]')
      .element as HTMLTextAreaElement

    expect(nameInput.value).toBe('')
    expect(descriptionInput.value).toBe('')
  })

  it('sollte eine Ladeanzeige anzeigen, während Portfolios geladen werden', async () => {
    // Arrange: Setze den Store-Zustand auf "loading"
    portfolioStore.isLoading = true

    // Act: Warte, bis Vue die Ansicht aktualisiert hat
    await wrapper.vm.$nextTick()

    // Assert: Prüfe, ob die Ladeanzeige angezeigt wird
    const stateContainer = wrapper.find('.state-container')
    expect(stateContainer.exists()).toBe(true)
    expect(stateContainer.text()).toContain('Lade Portfolios...')
  })

  it('sollte eine Fehlermeldung anzeigen, wenn das Laden fehlschlägt', async () => {
    // Arrange: Setze den Store-Zustand auf "error"
    portfolioStore.error = 'Fehler beim Laden der Portfolios'

    // Act: Warte, bis Vue die Ansicht aktualisiert hat
    await wrapper.vm.$nextTick()

    // Assert: Prüfe, ob die Fehlermeldung angezeigt wird
    const stateContainer = wrapper.find('.state-container.error')
    expect(stateContainer.exists()).toBe(true)
    expect(stateContainer.text()).toContain('Fehler beim Laden der Portfolios')
  })
})
