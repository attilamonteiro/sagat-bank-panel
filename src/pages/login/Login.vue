<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="onLogin">
      <div style="margin-bottom: 1rem">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          required
          style="width: 100%; padding: 8px"
        />
      </div>
      <div style="margin-bottom: 1rem">
        <label>Senha</label>
        <input
          v-model="password"
          type="password"
          required
          style="width: 100%; padding: 8px"
        />
      </div>
      <button type="submit" style="width: 100%; padding: 10px">Entrar</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
    <div style="text-align: center; margin-top: 1rem">
      <button
        type="button"
        style="
          width: 100%;
          padding: 10px;
          background-color: #ffffff;
          color: #8b2d2d;
          border: 1px solid #8b2d2d;
          border-radius: 4px;
          cursor: pointer;
        "
        @click="onRegister"
      >
        Registrar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

async function onLogin() {
  error.value = '';
  try {
    await authStore.login(email.value, password.value);
    await router.push('/painel/dashboard');
  } catch (e: any) {
    error.value = 'Usuário ou senha inválidos';
  }
}

function onRegister() {
  router.push('/register');
}
</script>

<style scoped>
body {
  background-color: #ffffff; 
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

div {
  margin: auto;
  max-width: 300px; 
  padding: 1rem; 
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  background: #ffffff; 
}

h2 {
  text-align: center;
  color: #8b2d2d; 
  margin-bottom: 1rem; 
}

button {
  width: 100%;
  padding: 8px; 
  background-color: #8b2d2d; 
  color: #ffffff; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #a33a3a;
}

label {
  color: #333333; 
}

input {
  width: 100%;
  padding: 6px; 
  border: 1px solid #d3d3d3; 
  border-radius: 4px;
}

.error {
  color: #8b2d2d;
  margin-top: 1rem;
}
</style>
