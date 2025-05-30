<template>
  <div class="main-layout">
    <HeaderMenu />
    <LeftMenu />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderMenu from '@/components/menu/HeaderMenu.vue';
import LeftMenu from '@/components/menu/sideMenu/LeftMenu.vue';
</script>

<style scoped>

</style>
