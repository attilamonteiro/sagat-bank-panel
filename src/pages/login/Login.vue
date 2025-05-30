<template>
  <div
    style="
      max-width: 400px;
      margin: 80px auto;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px #0001;
      background: #fff;
    "
  >
    <h2 style="text-align: center">Login</h2>
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
      <div v-if="error" style="color: red; margin-top: 1rem">{{ error }}</div>
    </form>
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
</script>
