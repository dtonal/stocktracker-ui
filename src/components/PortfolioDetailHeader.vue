<template>
  <div class="portfolio-detail-header" v-if="props.portfolio">
    <div v-if="props.portfolio" class="portfolio-detail-header-info-container">
      <div class="portfolio-detail-header-info">
        <p>Beschreibung:</p>
        <p>{{ props.portfolio.description }}</p>
      </div>
      <div class="portfolio-detail-header-info">
        <p>Erstellt am:</p>
        <p>{{ new Date(props.portfolio.createdAt).toLocaleDateString() }}</p>
      </div>
      <div class="portfolio-detail-header-info">
        <p>Letzte Aktualisierung:</p>
        <p>{{ new Date(props.portfolio.updatedAt).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Portfolio } from '@/types/portfolio'

const props = defineProps<{
  portfolio: Portfolio | null
}>()
</script>

<style scoped>
.portfolio-detail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 0 auto;
}

.portfolio-detail-header-info-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
  width: 100%;
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 0 0 0.5rem 0.5rem;
}
.portfolio-detail-header-info {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.portfolio-detail-header-info p {
  margin: 0;
}
.portfolio-detail-header-info p:first-child {
  font-weight: bold;
}
.portfolio-detail-header-info p:last-child {
  font-style: italic;
}
</style>
