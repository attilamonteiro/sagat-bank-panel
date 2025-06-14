import { ref } from 'vue';
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import {
  apiLogin,
  apiRegister,
  apiGetUserInfo,
} from '../../services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null);
  const token = ref<string | null>(Cookies.get('auth_token') || null);
  const isAuthenticated = ref(!!token.value);

  async function login(email: string, password: string) {
    try {
      const data = await apiLogin(email, password);
      token.value = data.token || data.jwt || data.access_token;
      Cookies.set('auth_token', token.value!, { expires: 7, path: '/' }); // ✅ garante path
      await fetchUserInfo();
      isAuthenticated.value = true;
    } catch (error) {
      logout();
      throw error;
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const data = await apiRegister(name, email, password);
      token.value = data.token || data.jwt || data.access_token;
      Cookies.set('auth_token', token.value!, { expires: 7, path: '/' }); // ✅ garante path
      await fetchUserInfo();
      isAuthenticated.value = true;
    } catch (error) {
      logout();
      throw error;
    }
  }

  async function fetchUserInfo() {
    if (!token.value) return;
    try {
      const data = await apiGetUserInfo(token.value!);
      user.value = data;
    } catch (error) {
      logout();
      throw error;
    }
  }

async function logout() {

  Cookies.remove('auth_token', { path: '/' });
  user.value = null;
  token.value = null;
  isAuthenticated.value = false;
}

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    fetchUserInfo,
    logout,
  };
});
