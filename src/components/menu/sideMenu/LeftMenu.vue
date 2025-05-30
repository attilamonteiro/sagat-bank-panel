<template>
  <aside class="sidebar sidebar-compact">
    <div class="header-logo">
      <img
        src="/vite.svg"
        width="32"
        height="32"
        style="margin-top: 8px"
        alt="Logo"
      />
    </div>
    <nav>
      <ul>
        <li
          :class="{ active: isActive('/painel/dashboard') }"
          @click="router.push('/painel/dashboard')"
          title="Contas Bancárias"
        >
          🏦
        </li>
        <li
          :class="{ active: isActive('/painel/transfer') }"
          @click="router.push('/painel/transfer')"
          title="Transferências Bancárias"
        >
          💸
        </li>
        <li
          :class="{ active: isActive('/painel/statement') }"
          @click="router.push('/painel/statement')"
          title="Extrato de Transferências"
        >
          📄
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
function isActive(path: string) {
  return route.path === path;
}
</script>

<style scoped>
.sidebar-compact {
  width: 64px;
  background: #222;
  color: #fff;
  padding: 1rem 0.5rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  box-shadow: 2px 0 8px #0001;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}
.header-logo {
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.sidebar nav li {
  padding: 0.6rem 0.2rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1.5em;
  text-align: center;
}
.sidebar nav li.active,
.sidebar nav li:hover {
  background: #444;
}

.main-content {
  margin-left: 64px;
}
</style>
