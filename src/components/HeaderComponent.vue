<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <RouterLink to="/" class="brand">
        <!-- Optional: Hier könnte ein Logo hin -->
        <h2>Stocktracker</h2>
      </RouterLink>

      <nav class="navigation" v-if="authStore.isLoggedIn">
        <span class="user-info">Hallo, {{ authStore.user?.name || 'Benutzer' }}</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </nav>
      <nav class="navigation" v-else>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: #ffffff;
  padding: 0 2rem;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px; /* Eine feste Höhe für den Header */
  max-width: 1280px;
  margin: 0 auto;
}

.brand {
  text-decoration: none;
  color: #2d3748;
  font-weight: bold;
}

.brand h2 {
  margin: 0;
  font-size: 1.5rem;
  color: hsla(160, 100%, 37%, 1); /* Das Vue-Grün für den Akzent */
}

.navigation {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Abstand zwischen den Elementen */
}

.user-info {
  font-weight: 500;
  color: #4a5568;
}

.logout-button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #718096;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.logout-button:hover {
  color: #2d3748;
  background-color: #edf2f7;
  border-color: #e2e8f0;
}
</style>
