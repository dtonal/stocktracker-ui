<template>
  <div v-if="props.visible" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">Transaktion hinzufügen</h2>
      <form class="modal-form" @submit.prevent="submit">
        <label class="modal-form-label">
          Ticker:
          <input v-model="form.ticker" type="text" required disabled />
        </label>
        <div class="form-group">
          <label for="stock-search">Aktie</label>
          <div class="search-input-group">
            <input
              id="stock-search"
              type="text"
              v-model="searchQuery"
              placeholder="Name oder Symbol suchen..."
              autocomplete="off"
            />
            <button
              @click.prevent="handleSearch"
              :disabled="isLoading"
              type="button"
              class="search-button"
            >
              {{ isLoading ? 'Lädt...' : 'Suchen' }}
            </button>
          </div>

          <p v-if="searchStockStatusMessage" class="search-status-message">
            {{ searchStockStatusMessage }}
          </p>
          <ul v-if="searchResults && searchResults.count > 0" class="search-results">
            <li
              v-for="stock in searchResults.result"
              :key="stock.symbol"
              @click="selectStock(stock)"
            >
              <strong>{{ stock.symbol }}</strong> - {{ stock.description }}
              <span v-if="stock.isSavedInDb" class="tag-saved">(gespeichert)</span>
            </li>
          </ul>
        </div>

        <label class="modal-form-label">
          Typ:
          <select v-model="form.type" required>
            <option value="BUY">Kauf</option>
            <option value="SELL">Verkauf</option>
          </select>
        </label>

        <label class="modal-form-label">
          Anzahl:
          <input v-model.number="form.quantity" type="number" min="1" required />
        </label>

        <label class="modal-form-label">
          Preis:
          <input v-model.number="form.price" type="number" step="0.01" min="0" required />
        </label>

        <label class="modal-form-label">
          Datum:
          <input v-model="form.date" type="date" required />
        </label>

        <div class="modal-buttons">
          <button type="submit" class="save-button">Speichern</button>
          <button type="button" @click="close" class="cancel-button">Abbrechen</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { TransactionType } from '@/types/transaction'
import { portfolioService } from '@/services/portfolioService'
import type { StockSearchResult, StockSearchItem } from '@/types/stock'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: NewTransactionData): void
}>()

export type NewTransactionData = {
  type: TransactionType
  ticker: string
  quantity: number
  price: number
  date: string
}

const form = reactive<NewTransactionData>({
  type: TransactionType.BUY,
  ticker: '',
  quantity: 0,
  price: 0,
  date: new Date().toISOString().split('T')[0],
})

const searchQuery = ref('')
const searchResults = ref<StockSearchResult>({
  count: 0,
  result: [],
})
const isLoading = ref(false)
const searchStockStatusMessage = ref('')

const handleSearch = async () => {
  isLoading.value = true
  searchStockStatusMessage.value = ''
  searchResults.value = {
    count: 0,
    result: [],
  }

  if (searchQuery.value.length < 3) {
    searchStockStatusMessage.value = 'Bitte geben Sie mindestens 3 Zeichen ein.'
    isLoading.value = false
    return
  }

  try {
    searchResults.value = await portfolioService.searchStocks(searchQuery.value)
    if (searchResults.value.count === 0) {
      searchStockStatusMessage.value = 'Keine Aktien gefunden.'
    }
    console.log('searchResults', searchResults.value)
  } catch (error) {
    searchStockStatusMessage.value = 'Fehler bei der Aktiensuche.'
    console.error('Fehler bei der Aktiensuche:', error)
    // Optional: Benutzerfeedback für Fehler
  } finally {
    isLoading.value = false
  }
}

const selectStock = (stock: StockSearchItem) => {
  form.ticker = stock.symbol
  searchQuery.value = `${stock.symbol} ${stock.description}`
  searchResults.value = {
    count: 0,
    result: [],
  }
  searchStockStatusMessage.value = ''
}

function submit() {
  if (!form.ticker) {
    alert('Bitte wählen Sie eine Aktie aus.')
    return
  }
  console.log('submit', form)
  emit('save', { ...form })
  close()
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.modal-buttons button {
  margin-left: 0.5rem;
}

.modal-buttons button:first-child {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
}

.modal-buttons button:last-child {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-form-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.search-results {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: absolute;
  width: 30%;
  z-index: 1000;
  overflow-y: auto;
  margin-top: 0.5rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.search-results li {
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-results li:hover {
  background-color: #f0f0f0;
}

.tag-saved {
  background-color: #007bff;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.search-input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

label {
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-status-message {
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
