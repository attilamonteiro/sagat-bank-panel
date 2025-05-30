import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<any[]>([]);
  const statement = ref<any[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalRecords = ref(0);

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

  async function fetchStatement(
    token: string,
    filters: {
      type?: string;
      dateStart?: string;
      dateEnd?: string;
      minValue?: string;
      maxValue?: string;
      page?: number;
      perPage?: number;
    }
  ) {
    try {
      let params: string[] = [];
      params.push(`per_page=${filters.perPage || 10}`);
      params.push(`page=${filters.page || 1}`);
      if (filters.type === 'sent') params.push('direction=sent');
      if (filters.type === 'received') params.push('direction=received');
      if (filters.dateStart) params.push(`date_start=${filters.dateStart}`);
      if (filters.dateEnd) params.push(`date_end=${filters.dateEnd}`);
      if (filters.minValue) params.push(`min_value=${filters.minValue}`);
      if (filters.maxValue) params.push(`max_value=${filters.maxValue}`);
      const query = params.join('&');
      const url = `${
        import.meta.env.VITE_API_URL
      }/users/bank_account_transfers/statements?${query}`;
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      statement.value = data.bank_account_transfers || [];
      currentPage.value = data.current_page || 1;
      totalPages.value = data.total_pages || 1;
      totalRecords.value = data.total_records || 0;
    } catch (e) {
      statement.value = [];
      currentPage.value = 1;
      totalPages.value = 1;
      totalRecords.value = 0;
      throw e;
    }
  }

  return {
    transactions,
    fetchLastTransactions,
    statement,
    currentPage,
    totalPages,
    totalRecords,
    fetchStatement,
  };
});
