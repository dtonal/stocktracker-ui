<template>
  <div class="create-form-container">
    <form
      @submit.prevent="emit('create', newPortfolioName, newPortfolioDescription)"
      class="create-form"
    >
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
        <button type="button" @click="emit('cancel')" class="btn btn-secondary">Abbrechen</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const newPortfolioName = ref('')
const newPortfolioDescription = ref('')

const emit = defineEmits<{
  (e: 'create', name: string, description: string): void
  (e: 'cancel'): void
}>()
</script>

<style scoped>
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

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
</style>
