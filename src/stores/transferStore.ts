import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useTransferStore = defineStore('transfer', () => {
  const transferResult = ref<any | null>(null);
  const transferError = ref<string | null>(null);
  const loading = ref(false);

  async function makeTransfer(token: string, transferData: any) {
    loading.value = true;
    transferError.value = null;
    try {
      const { data } = await axios.post(
        `${API_URL}/users/bank_account_transfers`,
        transferData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      transferResult.value = data;
      return data;
    } catch (e: any) {
      transferError.value = e?.response?.data?.message || 'Erro ao transferir';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    transferResult,
    transferError,
    loading,
    makeTransfer,
  };
});
