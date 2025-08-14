<template>
  <div v-if="props.visible" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">Transaktion hinzufügen</h2>
      <form class="modal-form" @submit.prevent="submit">
        <label class="modal-form-label">
          Typ:
          <select v-model="form.type" required>
            <option value="BUY">Kauf</option>
            <option value="SELL">Verkauf</option>
          </select>
        </label>

        <label class="modal-form-label">
          Ticker:
          <input v-model="form.ticker" type="text" required />
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
          <button type="submit">Speichern</button>
          <button type="button" @click="close">Abbrechen</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { TransactionType } from '@/types/transaction'

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

function submit() {
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
</style>
