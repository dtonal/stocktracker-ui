<script setup lang="ts">
import PortfolioDetailHeader from '@/components/PortfolioDetailHeader.vue'
import PortfolioPositionList from '@/components/PortfolioPositionList.vue'
import TransactionHistory from '@/components/TransactionHistory.vue'
import AddTransactionModal from '@/components/AddTransactionModal.vue'

import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { NewTransactionData } from '@/components/AddTransactionModal.vue'

const portfolioStore = usePortfolioStore()
const router = useRouter()

const portfolioId = router.currentRoute.value.params.id as string
const portfolio = computed(() => portfolioStore.currentPortfolio)
const isCreateTransactionModalVisible = ref(false)
onMounted(() => {
  portfolioStore.fetchPortfolio(portfolioId)
})

function openCreateTransactionModal() {
  console.log('openCreateTransactionModal')
  isCreateTransactionModalVisible.value = true
}

function handleCreateTransaction(data: NewTransactionData) {
  console.log('handleCreateTransaction', data)
  portfolioStore.handleCreateTransaction(portfolioId, data)
}

function handleDeleteTransaction(id: string) {
  console.log('handleDeleteTransaction', id)
  portfolioStore.handleDeleteTransaction(portfolioId, id)
}
</script>

<template>
  <div class="portfolio-detail-view">
    <div v-if="portfolioStore.isLoading" class="state-container">
      <p>Lade Portfolio...</p>
    </div>
    <div v-else-if="portfolioStore.error" class="state-container error">
      <p>Fehler beim Laden: {{ portfolioStore.error }}</p>
    </div>
    <div v-else-if="portfolio">
      <header class="view-header">
        <h1>Portfolio: {{ portfolio.name }}</h1>
      </header>
      <AddTransactionModal
        :visible="isCreateTransactionModalVisible"
        @close="isCreateTransactionModalVisible = false"
        @save="handleCreateTransaction"
      />
      <PortfolioDetailHeader :portfolio="portfolio" />
      <PortfolioPositionList :portfolio="portfolio" />
      <TransactionHistory
        :portfolio="portfolio"
        @openCreateTransactionModal="openCreateTransactionModal"
        @createTransaction="handleCreateTransaction"
        @delete="handleDeleteTransaction"
      />
      <div v-if="portfolioStore.transactionError" class="state-container error">
        <p>{{ portfolioStore.transactionError }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  width: 90%;
  background-color: #f0f0f0;
  padding: 1rem;
  margin: 0 auto;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  border-radius: 0.5rem 0.5rem 0 0;
}

.state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.state-container.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
