<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const router = useRouter()

async function handleRegister() {
  error.value = null
  successMessage.value = null

  try {
    await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    successMessage.value = 'Registrierung erfolgreich! Du wirst zum Login weitergeleitet...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (e: any) {
    error.value = e.message || 'Ein Fehler ist aufgetreten.'
  }
}
</script>

<template>
  <div class="register-container">
    <h1>Registrieren</h1>
    <form @submit.prevent="handleRegister">
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">E-Mail</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Konto erstellen</button>
    </form>
  </div>
</template>

<style scoped>
/* Stile sind sehr ähnlich zum Login, wir können sie hier einfach kopieren */
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: hsla(160, 100%, 37%, 0.8);
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}
.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
