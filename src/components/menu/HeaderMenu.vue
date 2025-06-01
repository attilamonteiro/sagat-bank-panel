<template>
  <header class="header-menu">
    <div class="header-toolbar">
      <span class="logo">Sagat Bank</span>
      <div class="header-actions">
        <img
          src="https://randomuser.me/api/portraits/men/85.jpg"
          alt="Avatar"
          class="header-avatar"
        />
        <span class="header-username">{{ userName }}</span>
        <button class="header-logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/auth/authStore';

const userStore = useUserStore();
const authStore = useAuthStore();

const userName = computed(() => {
  // Garante compatibilidade com resposta { user: { name: ... } }
  if (userStore.user && userStore.user.user && userStore.user.user.name) {
    return userStore.user.user.name;
  }
  if (userStore.user && userStore.user.name) {
    return userStore.user.name;
  }
  return 'Usuário';
});

async function logout() {
  await authStore.logout();
  window.location.href = '/login';
}
</script>

<style scoped>
.header-menu {
  background: #8b2d2d; 
  color: #fff;
  width: 100%;
  box-shadow: 0 2px 8px #0001;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1100;
}
.header-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}
.logo {
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 1px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff2;
}
.header-username {
  font-size: 1em;
  font-weight: 500;
}
.header-logout-btn {
  background: #0d6abf;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1rem;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
.header-logout-btn:hover {
  background: #09549c;
}
</style>
