<template>
  <div class="statement-container">
    <h2>Extrato Bancário</h2>
    <form class="filters" @submit.prevent>
      <label>
        Data início:
        <input type="date" v-model="dateStart" />
      </label>
      <label>
        Data fim:
        <input type="date" v-model="dateEnd" />
      </label>
      <label>
        Valor mínimo:
        <input type="number" v-model="minValue" min="0" step="0.01" />
      </label>
      <label>
        Valor máximo:
        <input type="number" v-model="maxValue" min="0" step="0.01" />
      </label>
      <label>
        Por página:
        <input type="number" v-model.number="perPage" min="1" max="100" />
      </label>
    </form>
    <div v-if="loading" class="table-loading-overlay">
      <v-progress-circular indeterminate color="#0d6abf" size="40" width="4" />
    </div>
    <div v-else>
      <div style="position: relative">
        <table class="statement-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Valor (R$)</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id">
              <td>
                {{
                  tx.created_at ? new Date(tx.created_at).toLocaleString() : '-'
                }}
              </td>
              <td>{{ tx.transfer_type_text || '-' }}</td>
              <td>
                {{
                  tx.amount_to_transfer != null
                    ? tx.amount_to_transfer.toFixed(2)
                    : '-'
                }}
              </td>
              <td>
                <div v-if="tx.from_user_bank_account">
                  {{ tx.from_user_bank_account.bank_name }}<br />
                  {{ tx.from_user_bank_account.account_number }}-{{
                    tx.from_user_bank_account.account_digit
                  }}
                </div>
                <div v-else>-</div>
              </td>
              <td>
                <div v-if="tx.to_bank_account">
                  {{ tx.to_bank_account.bank_name }}<br />
                  {{ tx.to_bank_account.account_number }}-{{
                    tx.to_bank_account.account_digit
                  }}
                </div>
                <div v-else>-</div>
              </td>
              <td>
                <span
                  :style="{ color: tx.was_success ? '#388e3c' : '#b71c1c' }"
                >
                  {{ tx.was_success ? 'Sucesso' : 'Falha' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">
          Próxima
        </button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/auth/authStore';
import { useTransactionStore } from '@/stores/transactionStore';

function useDebouncedWatch(sources: any[], callback: () => void, delay = 400) {
  let timeout: ReturnType<typeof setTimeout>;
  watch(sources, () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  });
}

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

const loading = ref(false);
const error = ref('');

// Filtros
const dateStart = ref('');
const dateEnd = ref('');
const minValue = ref('');
const maxValue = ref('');
const page = ref(1);
const perPage = ref(10);

const transactions = computed(() => transactionStore.statement);
const currentPage = computed(() => transactionStore.currentPage);
const totalPages = computed(() => transactionStore.totalPages);
const totalRecords = computed(() => transactionStore.totalRecords);

async function fetchTransactions(customPage?: number) {
  if (!authStore.token) return;
  loading.value = true;
  error.value = '';
  try {
    await transactionStore.fetchStatement(authStore.token, {
      dateStart: dateStart.value,
      dateEnd: dateEnd.value,
      minValue: minValue.value,
      maxValue: maxValue.value,
      page: customPage ?? page.value,
      perPage: perPage.value,
    });
    if (typeof customPage === 'number') page.value = customPage;
  } catch (e) {
    error.value = 'Erro ao buscar extrato';
  } finally {
    loading.value = false;
  }
}

onMounted(() => fetchTransactions());
useDebouncedWatch([dateStart, dateEnd, minValue, maxValue, perPage], () => {
  fetchTransactions(1);
});

function nextPage() {
  if (page.value < totalPages.value) {
    fetchTransactions(page.value + 1);
  }
}
function prevPage() {
  if (page.value > 1) {
    fetchTransactions(page.value - 1);
  }
}
</script>

<style scoped>
.statement-container {
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  padding: 2rem;
  color: #222;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.filters label {
  display: flex;
  flex-direction: column;
  font-size: 0.98em;
  color: #222;
}
.statement-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.statement-table th,
.statement-table td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.98em;
}
.statement-table th {
  background: #eaeaea;
  color: #222;
}
.pagination {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}
button {
  background: #0d6abf;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  background: #888;
  cursor: not-allowed;
}
.error {
  color: #b71c1c;
  font-weight: bold;
  margin-top: 1rem;
}
input[type='number'],
input[type='date'] {
  color: #222 !important;
  background: #fff !important;
  border: 1px solid #ccc !important;
  box-shadow: none !important;
}
input[type='number']:focus,
input[type='date']:focus {
  border: 1.5px solid #0d6abf !important;
  outline: none !important;
  box-shadow: 0 0 0 2px #0d6abf22;
}
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(0.2);
}
</style>
