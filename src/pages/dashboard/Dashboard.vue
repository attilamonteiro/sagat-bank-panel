<template>
  <div class="dashboard-container">
    <h2>Painel da Conta</h2>
    <!-- Navegação removida, agora está apenas no LeftMenu -->
    <div v-if="user">
      <p><strong>Nome do titular:</strong> {{ user.name }}</p>
      <template v-if="myAccounts && myAccounts.length > 0">
        <table class="accounts-table">
          <thead>
            <tr>
              <th>Banco</th>
              <th>Agência</th>
              <th>Conta</th>
              <th>Tipo</th>
              <th>Saldo (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acc in myAccounts" :key="acc.id">
              <td>
                {{ acc.bank_name || '---' }}<br /><small
                  >({{ acc.bank_code || '---' }})</small
                >
              </td>
              <td>
                {{ acc.agency_number || '---' }}-{{ acc.agency_digit || '' }}
              </td>
              <td>
                {{ acc.account_number || '---' }}-{{ acc.account_digit || '' }}
              </td>
              <td>{{ acc.account_type || '---' }}</td>
              <td>{{ acc.amount != null ? acc.amount.toFixed(2) : '---' }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <p><strong>Nenhuma conta encontrada.</strong></p>
      </template>
      <p>
        <strong>Saldo disponível:</strong> R$
        {{ user.balance != null ? user.balance.toFixed(2) : '---' }}
      </p>
      <h3>Últimas 3 transações</h3>
      <ul v-if="lastTransactions.length > 0">
        <li v-for="tx in lastTransactions" :key="tx.id">
          <span>
            {{ tx.date }} - {{ tx.description || tx.type }}: R$
            {{ tx.amount.toFixed(2) }}
          </span>
        </li>
      </ul>
      <div v-else>
        <p>Nenhuma transação encontrada.</p>
      </div>
    </div>
    <div v-else>
      <p>Carregando informações...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth/authStore';
import { useUserStore } from '../../stores/userStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { useBankAccountStore } from '../../stores/bankAccountStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const bankAccountStore = useBankAccountStore();
const router = useRouter();

const user = computed(() => userStore.user);
type UserBankAccount = {
  id: number;
  bank_name?: string;
  bank_code?: string;
  agency_number?: string;
  agency_digit?: string;
  account_number?: string;
  account_digit?: string;
  account_type?: string;
  amount?: number;
};

type MyAccountsType =
  | UserBankAccount[]
  | { user_bank_accounts: UserBankAccount[] }
  | null
  | undefined;

const myAccounts = computed<UserBankAccount[]>(() => {
  // Garante compatibilidade com resposta { user_bank_accounts: [...] }
  const accs = bankAccountStore.myAccounts as MyAccountsType;
  if (Array.isArray(accs)) return accs;
  if (
    accs &&
    Array.isArray(
      (accs as { user_bank_accounts?: UserBankAccount[] }).user_bank_accounts
    )
  )
    return (accs as { user_bank_accounts: UserBankAccount[] })
      .user_bank_accounts;
  return [];
});
const lastTransactions = computed(() =>
  transactionStore.transactions.slice(0, 3)
);

onMounted(async () => {
  // Busca informações do usuário pela store dedicada
  if (authStore.token) {
    await userStore.fetchUserInfo(authStore.token);
    await transactionStore.fetchLastTransactions(authStore.token);
    await bankAccountStore.fetchMyAccounts(authStore.token);
  }
});
</script>

<style scoped>
.dashboard-container {
  max-width: 500px;
  margin: 40px auto;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  padding: 2rem;
  color: #222;
}
h2,
h3,
p,
strong,
span,
li {
  color: #222;
}
ul {
  padding-left: 1.2em;
}
.account-info {
  margin-bottom: 1rem;
}
.accounts-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}
.accounts-table th,
.accounts-table td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.98em;
}
.accounts-table th {
  background: #eaeaea;
  color: #222;
}
.accounts-table td small {
  color: #666;
}
</style>
