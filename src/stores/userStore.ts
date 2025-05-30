import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiGetUserInfo } from '../services/authService';

export const useUserStore = defineStore('user', () => {
  const user = ref<any | null>(null);

  async function fetchUserInfo(token: string) {
    try {
      const data = await apiGetUserInfo(token);
      user.value = data;
    } catch (error) {
      user.value = null;
      throw error;
    }
  }

  return {
    user,
    fetchUserInfo,
  };
});
