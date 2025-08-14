<template>
  <div class="transaction-history">
    <div class="transaction-history-container">
      <div v-if="props.portfolio.transactions.length === 0" class="empty-state-container">
        <p>Keine Transaktionen</p>
      </div>
      <div v-else class="state-container">
        <h2>Transaktionen</h2>
        <div class="transaction-list">
          <div
            class="transaction-item"
            v-for="transaction in props.portfolio.transactions"
            :key="transaction.id"
          >
            <p>{{ transaction.transactionType }}</p>
            <p>{{ transaction.stockSymbol }}</p>
            <p>{{ transaction.quantity }}</p>
            <p>{{ transaction.pricePerShare }}</p>
            <p>{{ transaction.transactionDate }}</p>
            <button class="btn btn-delete" @click="openConfirmationModal(transaction.id)">
              <TrashIcon />
            </button>
          </div>
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
.empty-state-container button {
  margin-top: 1rem;
}

.btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.transaction-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}
.transaction-item p {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  width: 100%;
}
</style>
