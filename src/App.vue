<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/HeaderComponent.vue'
</script>

<template>
  <div id="app-layout">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* Dieser Teil ist wichtig! */
  display: flex;
  flex-direction: column;
}
</style>
