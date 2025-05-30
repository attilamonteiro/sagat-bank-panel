import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<any[]>([]);

  async function fetchLastTransactions(token: string) {
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_API_URL +
          '/users/bank_account_transfers/statements?per_page=3&page=1',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      transactions.value = data.records || data.transactions || [];
    } catch (e) {
      transactions.value = [];
      throw e;
    }
  }

  return {
    transactions,
    fetchLastTransactions,
  };
});
