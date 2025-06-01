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
/* Ajustando o layout para caber na tela sem rolagem */
body {
  background-color: #ffffff; /* Fundo principal branco */
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Altura total da tela */
}

/* Container do login */
div {
  margin: auto;
  max-width: 300px; /* Reduzindo ainda mais a largura máxima */
  padding: 1rem; /* Reduzindo o padding interno */
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  background: #ffffff; /* Fundo branco para destacar o conteúdo */
}

/* Título */
h2 {
  text-align: center;
  color: #8b2d2d; /* Vermelho escuro */
  margin-bottom: 1rem; /* Espaçamento inferior para o título */
}

/* Botão de login */
button {
  width: 100%;
  padding: 8px; /* Reduzindo o padding do botão */
  background-color: #8b2d2d; /* Vermelho escuro */
  color: #ffffff; /* Texto branco */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #a33a3a; /* Tom mais claro de vermelho escuro para hover */
}

/* Texto comum */
label {
  color: #333333; /* Preto ou cinza escuro */
}

/* Texto de apoio */
input {
  width: 100%;
  padding: 6px; /* Reduzindo o padding dos inputs */
  border: 1px solid #d3d3d3; /* Cinza claro */
  border-radius: 4px;
}

/* Mensagem de erro */
.error {
  color: #8b2d2d; /* Vermelho escuro */
  margin-top: 1rem;
}
</style>
