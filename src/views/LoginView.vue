<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/authService'
import type { AuthenticationResponse } from '@/types/auth'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

async function handleLogin() {
  console.log('Login-Versuch mit:', email.value, password.value)
  try {
    const response: AuthenticationResponse = await authService.login({
      email: email.value,
      password: password.value,
    })

    if (response.token) {
      console.log('Login erfolgreich! Token: ', response.token)
      error.value = null
    } else if (response.error) {
      console.error('Login fehlgeschlagen: ', response.error)
      error.value = response.error
    } else {
      console.error('Login fehlgeschlagen: Unbekannter Fehler')
      error.value = 'Ein unerwarteter Fehler ist aufgetreten'
    }
  } catch (error) {
    console.error('Login fehlgeschlagen: ', error)
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div v-if="error" class="error-message">{{ error }}</div>
      <div class="form-group">
        <label for="email">E-Mail</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Einloggen</button>
    </form>
  </div>
</template>

<style scoped>
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}
.login-container {
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
</style>
