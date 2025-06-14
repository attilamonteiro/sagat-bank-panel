<template>
  <div class="dashboard">
    <v-overlay :value="isLoading" absolute>
      <v-progress-circular color="red" indeterminate size="48" width="4" />
    </v-overlay>
    <section v-if="!isLoading" class="user-info">
      <h2>Painel</h2>
      <div v-if="user">
        <div class="info-grid">
          <div><strong>Nome:</strong> {{ user.user?.name || user.name || '---' }}</div>
        </div>

        <div v-if="myAccounts.length" class="accounts-card">
          <h3>Contas</h3>
          <table class="accounts-table">
            <thead>
              <tr>
                <th>Banco</th>
                <th>Agência</th>
                <th>Conta</th>
                <th>Tipo</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acc in myAccounts" :key="acc.id">
                <td>{{ acc.bank_code || '---' }}</td>
                <td>{{ acc.agency_number }}-{{ acc.agency_digit }}</td>
                <td>{{ acc.account_number }}-{{ acc.account_digit }}</td>
                <td>{{ acc.account_type }}</td>
                <td>R$ {{ acc.amount?.toFixed(2) || '---' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="transactions-card">
        <h3>Últimas Transações</h3>
        <ul v-if="lastTransactions.length > 0" class="transactions-list">
          <li v-for="tx in lastTransactions.slice(0, 3)" :key="tx.id">
            <span>{{ formatDate(tx.date) }}</span>
            <span>{{ tx.description || tx.type }}</span>
            <span>R$ {{ tx.amount.toFixed(2) }}</span>
          </li>
        </ul>
        <div v-if="lastTransactions.length == 0" class="empty">Sem transações</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '../../stores/auth/authStore';
import { useUserStore } from '../../stores/userStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { useBankAccountStore } from '../../stores/bankAccountStore';
import type { UserBankAccount } from '@/types/UserBankAccount';

const isLoading = ref(true);

const authStore = useAuthStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const bankAccountStore = useBankAccountStore();

const user = computed(() => userStore.user);
const myAccounts = computed(() => {
  const accs = bankAccountStore.myAccounts as
    | UserBankAccount[]
    | { user_bank_accounts: UserBankAccount[] }
    | null
    | undefined;

  if (Array.isArray(accs)) return accs;
  if (accs && Array.isArray((accs as any).user_bank_accounts)) {
    return (accs as any).user_bank_accounts;
  }
  return [];
});
const lastTransactions = computed(() => transactionStore.transactions);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

onMounted(async () => {
  try {
    if (authStore.token) {
      await userStore.fetchUserInfo(authStore.token);
      await transactionStore.fetchLastTransactions(authStore.token);
      await bankAccountStore.fetchMyAccounts(authStore.token);
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.dashboard {
  max-width: 760px;
  margin: 0 auto;
  padding: 1rem;
  font-size: 14px;
  background-color: #FFFFFF; 
}

.user-info {
  background: #FFFFFF; 
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); 
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-left: 4px solid #8B2D2D; 
}

.info-grid {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.accounts-card,
.transactions-card {
  background: #F9F9F9; 
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid #E0E0E0;
}

.accounts-card h3,
.transactions-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #8B2D2D;
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.accounts-table th {
  background-color: #F2D7D7; 
  color: #8B2D2D;
}

.accounts-table td {
  border: 1px solid #DDD;
  padding: 0.25rem;
  text-align: left;
}

.transactions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}

.transactions-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid #EEE;
  color: #333333;
}

.loading,
.empty {
  text-align: center;
  color: #888888;
  font-size: 14px;
}
</style>
