<template>
  <div>
    <h2>Criar Conta</h2>
    <form @submit.prevent="onRegister">
      <div style="margin-bottom: 1rem">
        <label>Nome</label>
        <input
          v-model="name"
          type="text"
          required
          style="width: 100%; padding: 8px"
        />
      </div>
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
      <button type="submit" style="width: 100%; padding: 10px">Registrar</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();

async function onRegister() {
  error.value = '';
  try {
    await authStore.register(name.value, email.value, password.value);
    await router.push('/login');
  } catch (e: any) {
    error.value = 'Erro ao criar conta. Tente novamente.';
  }
}
</script>

<style scoped>
body {
  background-color: #FFFFFF;
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
  background: #FFFFFF;
}

h2 {
  text-align: center;
  color: #8B2D2D;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 8px;
  background-color: #8B2D2D;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #A33A3A;
}

label {
  color: #333333;
}

input {
  width: 100%;
  padding: 6px;
  border: 1px solid #D3D3D3;
  border-radius: 4px;
}

.error {
  color: #8B2D2D;
  margin-top: 1rem;
}
</style>
