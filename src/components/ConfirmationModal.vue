<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-buttons">
        <button @click="handleCancel" class="btn btn-secondary">Abbrechen</button>
        <button @click="handleConfirm" class="btn btn-danger">Bestätigen</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  visible: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}

.modal-message {
  margin-bottom: 2rem;
  color: #555;
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background-color: #c53030;
}
</style>
