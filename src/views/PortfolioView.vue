<script setup lang="ts">
import { usePortfolioStore } from '@/stores/portfolioStore'
import { onMounted, ref } from 'vue'

import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import PencilIcon from 'vue-material-design-icons/Pencil.vue'

const portfolioStore = usePortfolioStore()
const isCreateFormVisible = ref(false)
const newPortfolioName = ref('')
const newPortfolioDescription = ref('')

onMounted(() => {
  portfolioStore.fetchPortfolios()
})

function showCreateForm() {
  console.log('showCreateForm')
  isCreateFormVisible.value = true
}

async function handleCreatePortfolio() {
  console.log('createPortfolio')
  await portfolioStore.handleCreatePortfolio(newPortfolioName.value, newPortfolioDescription.value)
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
      <form @submit.prevent="handleCreatePortfolio" class="create-form">
        <h3>Neues Portfolio erstellen</h3>
        <div class="form-group">
          <label for="portfolio-name">Name</label>
          <input
            id="portfolio-name"
            v-model="newPortfolioName"
            placeholder="z.B. Mein ETF-Depot"
            required
          />
        </div>
        <div class="form-group">
          <label for="portfolio-description">Beschreibung (optional)</label>
          <textarea
            id="portfolio-description"
            v-model="newPortfolioDescription"
            placeholder="Langfristige Anlagen"
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-success">Speichern</button>
          <button type="button" @click="isCreateFormVisible = false" class="btn btn-secondary">
            Abbrechen
          </button>
        </div>
      </form>
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
      <div
        v-for="portfolio in portfolioStore.portfolios"
        :key="portfolio.id"
        class="portfolio-card"
      >
        <div class="card-header">
          <h3>{{ portfolio.name }}</h3>
          <button class="btn btn-secondary btn-delete" @click="handleDeletePortfolio(portfolio.id)">
            <DeleteIcon />
          </button>
        </div>
        <div class="card-body">
          <p v-if="portfolio.description">{{ portfolio.description }}</p>
          <p v-else class="empty-description">Keine Beschreibung</p>
        </div>
        <div class="card-footer">
          <
          <span>Erstellt am: {{ new Date(portfolio.createdAt).toLocaleDateString() }}</span>
        </div>
      </div>
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
  max-width: 1200px;
  margin: 0 auto;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.35rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.btn-delete:hover {
  background-color: #c82333;
}

/* --- Create Form --- */
.create-form-container {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
}
.create-form h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* --- Portfolio Grid & Cards --- */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.portfolio-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.portfolio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: hsla(160, 100%, 37%, 1);
}

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
  color: #555;
}
.empty-description {
  color: #999;
  font-style: italic;
}

.card-footer {
  padding: 1rem 1.5rem;
  background-color: #f9f9f9;
  border-top: 1px solid #f0f0f0;
  color: #777;
  font-size: 0.875rem;
  text-align: right;
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
