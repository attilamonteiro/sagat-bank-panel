<template>
  <div class="transfer-container">
    <h2>Efetuar Transferência</h2>
    <form @submit.prevent="submitTransfer">
      <div class="form-group">
        <label for="fromAccount">Conta de origem</label>
        <select v-model="fromAccount" id="fromAccount" required>
          <option value="" disabled>Selecione</option>
          <option v-for="acc in myAccounts" :key="acc.id" :value="acc.id">
            {{ acc.bank_name }} - {{ acc.account_number }}-{{
              acc.account_digit
            }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="toAccount">Conta de destino</label>
        <select v-model="toAccount" id="toAccount" required>
          <option value="" disabled>Selecione</option>
          <option v-for="acc in myAccounts" :key="acc.id" :value="acc.id">
            {{ acc.bank_name }} - {{ acc.account_number }}-{{ acc.account_digit }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="amount">Valor</label>
        <input
          v-model.number="amount"
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          placeholder="Valor da transferência"
        />
      </div>
      <div class="form-group">
        <label for="description">Descrição</label>
        <input
          v-model="description"
          id="description"
          type="text"
          maxlength="100"
          placeholder="Descrição (opcional)"
        />
      </div>
      <div class="form-group">
        <label for="transferType">Tipo de transferência</label>
        <select v-model="transferType" id="transferType" required>
          <option :value="1">PIX</option>
          <option :value="2">TED</option>
        </select>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="makeSuccess" /> Forçar sucesso (teste)
        </label>
      </div>
      <button type="submit" :disabled="loading">Transferir</button>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">
        Transferência realizada com sucesso!
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth/authStore';
import { useBankAccountStore } from '@/stores/bankAccountStore';
import { useTransferStore } from '@/stores/transferStore';

const authStore = useAuthStore();
const bankAccountStore = useBankAccountStore();
const transferStore = useTransferStore();

const fromAccount = ref('');
const toAccount = ref('');
const amount = ref<number | null>(null);
const description = ref('');
const transferType = ref(1);
const makeSuccess = ref(true);
const error = ref('');
const success = ref(false);
const loading = ref(false);

const myAccounts = computed(() => {
  const accs = bankAccountStore.myAccounts as any;
  if (Array.isArray(accs)) return accs;
  if (accs && Array.isArray(accs.user_bank_accounts))
    return accs.user_bank_accounts;
  return [];
});

onMounted(async () => {
  if (authStore.token) {
    await bankAccountStore.fetchMyAccounts(authStore.token);
  }
});

async function submitTransfer() {
  error.value = '';
  success.value = false;
  loading.value = true;
  try {
    await transferStore.makeTransfer(authStore.token!, {
      bank_account_transfer: {
        to_user_bank_account_id: Number(toAccount.value),
        from_user_bank_account_id: Number(fromAccount.value),
        transfer_type: transferType.value,
        amount_to_transfer: amount.value,
        description: description.value,
      },
      make_success: makeSuccess.value,
    });
    success.value = true;
    fromAccount.value = '';
    toAccount.value = '';
    amount.value = null;
    description.value = '';
  } catch (e: any) {
    error.value =
      e?.response?.data?.message || 'Erro ao realizar transferência';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.transfer-container {
  max-width: 400px;
  margin: 40px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  padding: 2rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
input,
select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  background: #0d6abf;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.7rem 1.2rem;
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
}
.success {
  color: #388e3c;
  font-weight: bold;
}
.form-group label {
  color: #222;
}
.form-group input[type='checkbox'] {
  accent-color: #0d6abf;
}
</style>
