<script setup lang="ts">
import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  portfolio: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const router = useRouter()

function navigateToDetail() {
  router.push({ name: 'portfolio-detail', params: { id: props.portfolio.id } })
}
</script>

<template>
  <div class="portfolio-card" @dblclick="navigateToDetail">
    <div class="card-header">
      <h3>{{ portfolio.name }}</h3>
      <button class="btn btn-secondary btn-delete" @click.stop="emit('delete', portfolio.id)">
        <DeleteIcon />
      </button>
    </div>
    <div class="card-body">
      <p v-if="portfolio.description">{{ portfolio.description }}</p>
      <p v-else class="empty-description">Keine Beschreibung</p>
    </div>
    <div class="card-footer">
      <span>Erstellt am: {{ new Date(portfolio.createdAt).toLocaleDateString() }}</span>
      <button class="btn btn-secondary" @click="navigateToDetail">Zum Portfolio</button>
    </div>
  </div>
</template>

<style scoped>
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

/* --- Buttons --- */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
</style>
