<template>
  <div class="portfolio-position-list">
    <div class="portfolio-position-list-container">
      <p>Keine Positionen</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Portfolio } from '@/types/portfolio'

defineProps<{
  portfolio: Portfolio
}>()
</script>

<style scoped>
.portfolio-position-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.portfolio-position-list-container {
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
</style>
