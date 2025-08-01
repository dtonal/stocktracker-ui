<script setup lang="ts">
import { usePortfolioStore } from '@/stores/portfolioStore'
import { onMounted, ref } from 'vue'

import PortfolioCard from '@/components/PortfolioCard.vue'
import CreatePortfolioForm from '@/components/CreatePortfolioForm.vue'

const portfolioStore = usePortfolioStore()
const isCreateFormVisible = ref(false)

onMounted(() => {
  portfolioStore.fetchPortfolios()
})

function showCreateForm() {
  console.log('showCreateForm')
  isCreateFormVisible.value = true
}

async function handleCreatePortfolio(name: string, description: string) {
  console.log('createPortfolio')
  await portfolioStore.handleCreatePortfolio(name, description)
  isCreateFormVisible.value = false
}

async function handleDeletePortfolio(portfolioId: string) {
  console.log('deletePortfolio', portfolioId)
  await portfolioStore.handleDeletePortfolio(portfolioId)
}
</script>

<template>
  <div class="portfolio-view">
    <header class="view-header">
      <h1>Portfolio Overview</h1>
    </header>

    <div class="actions-bar">
      <button @click="showCreateForm" v-if="!isCreateFormVisible" class="btn btn-primary">
        Neues Portfolio
      </button>
    </div>

    <!-- Inline Create Form -->
    <div v-if="isCreateFormVisible" class="create-form-container">
      <CreatePortfolioForm @create="handleCreatePortfolio" @cancel="isCreateFormVisible = false" />
    </div>

    <!-- Loading State -->
    <div v-if="portfolioStore.isLoading" class="state-container">
      <p>Lade Portfolios...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="portfolioStore.error" class="state-container error">
      <p>Fehler beim Laden: {{ portfolioStore.error }}</p>
    </div>

    <!-- Portfolio List -->
    <div v-else-if="portfolioStore.portfolios.length > 0" class="portfolio-grid">
      <PortfolioCard
        v-for="portfolio in portfolioStore.portfolios"
        :key="portfolio.id"
        :portfolio="portfolio"
        @delete="handleDeletePortfolio"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="state-container empty-state">
      <h3>Noch keine Portfolios</h3>
      <p>Klicke auf "+ Neues Portfolio", um dein erstes anzulegen.</p>
    </div>
  </div>
</template>

<style scoped>
.portfolio-view {
  margin: 0 auto;
  width: 80%;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Angepasster Header: nur noch für den Titel zuständig */
.view-header {
  margin-bottom: 1rem; /* Etwas weniger Abstand, da die Action-Bar folgt */
}

.view-header h1 {
  color: #2c3e50;
}

/* NEU: Die Actions-Bar */
.actions-bar {
  display: flex;
  justify-content: flex-end; /* <-- Das schiebt den Button nach rechts */
  margin-bottom: 2rem;
}

/* --- Buttons --- */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-primary {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
}
.btn-primary:hover {
  background-color: hsla(160, 100%, 30%, 1);
}

.btn-success {
  background-color: #28a745;
  color: white;
}
.btn-success:hover {
  background-color: #218838;
}

/* --- Portfolio Grid & Cards --- */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* --- State Containers (Loading, Error, Empty) --- */
.state-container {
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
}
.state-container.error {
  background-color: #fff0f0;
  color: #d00;
}
</style>
