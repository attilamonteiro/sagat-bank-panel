import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useBankAccountStore = defineStore('bankAccount', () => {
  const accounts = ref<any[]>([]);
  const myAccounts = ref<any[]>([]);

  async function fetchAccounts(token: string) {
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_API_URL + '/users/bank_accounts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      accounts.value = data;
    } catch (e) {
      accounts.value = [];
      throw e;
    }
  }

  async function fetchMyAccounts(token: string) {
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_API_URL + '/users/bank_accounts/my',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      myAccounts.value = data;
    } catch (e) {
      myAccounts.value = [];
      throw e;
    }
  }

  return {
    accounts,
    myAccounts,
    fetchAccounts,
    fetchMyAccounts,
  };
});
