<script setup lang="ts">
import { usePortfolioStore } from '@/stores/portfolioStore'
import { onMounted } from 'vue'

const portfolioStore = usePortfolioStore()

onMounted(() => {
  portfolioStore.fetchPortfolios()
})
</script>

<template>
  <div class="portfolio-container">
    <h1>Portfolio Overview</h1>
  </div>
  <div v-if="portfolioStore.isLoading">Loading...</div>
  <div v-else-if="portfolioStore.error">Error: {{ portfolioStore.error }}</div>
  <div v-else-if="portfolioStore.portfolios.length > 0" class="portfolio-list">
    <ul>
      <li v-for="portfolio in portfolioStore.portfolios" :key="portfolio.id">
        {{ portfolio.name }}
      </li>
    </ul>
  </div>

  <div v-else class="empty-state">
    <p>No portfolios found. Create your first one to get started!</p>
  </div>
</template>
