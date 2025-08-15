<template>
  <div class="transaction-history">
    <div class="transaction-history-container">
      <div v-if="props.portfolio.transactions.length === 0" class="empty-state-container">
        <p>Keine Transaktionen</p>
      </div>
      <div v-else class="state-container">
        <h2>Transaktionen</h2>
        <div class="table-container">
          <table class="transaction-table">
            <thead>
              <tr>
                <th>Typ</th>
                <th>Symbol</th>
                <th>Menge</th>
                <th>Preis pro Aktie</th>
                <th>Gesamtwert</th>
                <th>Datum</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in props.portfolio.transactions"
                :key="transaction.id"
                class="transaction-row"
              >
                <td>
                  <span :class="['transaction-type', transaction.transactionType.toLowerCase()]">
                    {{ transaction.transactionType === 'BUY' ? 'Kauf' : 'Verkauf' }}
                  </span>
                </td>
                <td class="symbol">{{ transaction.stockSymbol }}</td>
                <td class="quantity">{{ transaction.quantity }}</td>
                <td class="price">{{ formatCurrency(transaction.pricePerShare) }}</td>
                <td class="total-value">
                  {{ formatCurrency(transaction.quantity * transaction.pricePerShare) }}
                </td>
                <td class="date">{{ formatDate(transaction.transactionDate) }}</td>
                <td class="actions">
                  <button
                    class="btn btn-delete"
                    @click="openConfirmationModal(transaction.id)"
                    title="Transaktion löschen"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button class="btn btn-primary" @click="emit('openCreateTransactionModal')">
        <PlusIcon />Transaktion hinzufügen
      </button>
    </div>
    <ConfirmationModal
      :visible="isConfirmationModalVisible"
      title="Transaktion löschen"
      message="Bist du sicher, dass du diese Transaktion endgültig löschen möchtest?"
      @confirm="handleDeleteConfirm"
      @cancel="closeConfirmationModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Portfolio } from '@/types/portfolio'
import PlusIcon from 'vue-material-design-icons/Plus.vue'
import TrashIcon from 'vue-material-design-icons/TrashCan.vue'
import ConfirmationModal from './ConfirmationModal.vue'

const props = defineProps<{
  portfolio: Portfolio
}>()

const emit = defineEmits(['openCreateTransactionModal', 'delete'])

const isConfirmationModalVisible = ref(false)
const transactionIdToDelete = ref<string | null>(null)

function openConfirmationModal(transactionId: string) {
  transactionIdToDelete.value = transactionId
  isConfirmationModalVisible.value = true
}

function closeConfirmationModal() {
  isConfirmationModalVisible.value = false
  transactionIdToDelete.value = null
}

function handleDeleteConfirm() {
  if (transactionIdToDelete.value) {
    emit('delete', transactionIdToDelete.value)
  }
  closeConfirmationModal()
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<style scoped>
.transaction-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.transaction-history-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.empty-state-container p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  margin: 1rem 0;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.transaction-table thead {
  background-color: #f8f9fa;
}

.transaction-table th {
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.transaction-table tbody tr {
  transition: background-color 0.15s ease;
}

.transaction-table tbody tr:hover {
  background-color: #f8f9fa;
}

.transaction-table tbody tr:not(:last-child) {
  border-bottom: 1px solid #dee2e6;
}

.transaction-table td {
  padding: 1rem 0.75rem;
  vertical-align: middle;
}

.transaction-type {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
}

.transaction-type.buy {
  background-color: #d4edda;
  color: #155724;
}

.transaction-type.sell {
  background-color: #f8d7da;
  color: #721c24;
}

.symbol {
  font-weight: 600;
  color: #495057;
}

.quantity,
.price,
.total-value {
  text-align: right;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.date {
  color: #6c757d;
  font-size: 0.875rem;
}

.actions {
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 0.375rem;
}

.btn-delete:hover {
  background-color: #c82333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .transaction-table {
    font-size: 0.875rem;
  }

  .transaction-table th,
  .transaction-table td {
    padding: 0.5rem 0.375rem;
  }

  .table-container {
    margin: 0.5rem 0;
  }
}

/* Sehr kleine Bildschirme - Stack Layout */
@media (max-width: 576px) {
  .transaction-table,
  .transaction-table thead,
  .transaction-table tbody,
  .transaction-table th,
  .transaction-table td,
  .transaction-table tr {
    display: block;
  }

  .transaction-table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .transaction-table tr {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .transaction-table td {
    border: none;
    padding: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .transaction-table td:before {
    content: attr(data-label);
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
}
</style>
