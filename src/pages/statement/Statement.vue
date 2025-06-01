<template>
  <v-container class="py-4" fluid>
    <v-row justify="center">
      <v-col cols="12" md="12" lg="10">
        <!-- Título -->
        <div class="title-section mb-6">
          <v-card elevation="2" rounded="lg">
            <v-card-title>
              <span class="text-h5 text-primary">Extrato Bancário</span>
            </v-card-title>
          </v-card>
        </div>

        <!-- Card de Filtros -->
        <div class="filters-section mb-4">
          <v-card-text class="pt-3 pb-3">
            <v-form @submit.prevent>
              <v-row dense>
                <DateFilter v-model="dateStart" label="Data Início" />
                <DateFilter v-model="dateEnd" label="Data Fim" />
                <ValueFilter v-model="minValue" label="Valor Mínimo (R$)" placeholder="0,00" />
                <ValueFilter v-model="maxValue" label="Valor Máximo (R$)" placeholder="0,00" />
              </v-row>
            </v-form>
          </v-card-text>
        </div>

        <!-- Loading Overlay -->
        <v-overlay :value="loading" absolute>
          <v-progress-circular indeterminate color="primary" size="48" width="4" />
        </v-overlay>

        <!-- Tabela de Transações (v-data-table) -->
        <div class="table-section">
          <div class="table-wrapper">
            <v-data-table
              dense
              :headers="headers"
              :items="filteredTransactions"
              :page.sync="page"
              :items-per-page.sync="perPage"
              :server-items-length="totalRecords"
              :loading="loading"
              class="elevation-1 statement-table"
              :items-per-page-options="[1, 10, 20, 50]"
              show-first-last-page
              footer-props="{ showCurrentPage: true, showFirstLastPage: true }"
            >
              <!-- Slots para formatação -->
              <template #item.date="{ item }">
                {{ item.created_at
                  ? new Date(item.created_at).toLocaleDateString('pt-BR')
                  : '-' }}
              </template>
              <template #item.type="{ item }">
                {{ item.transfer_type_text || '-' }}
              </template>
              <template #item.value="{ item }">
                <div class="text-right">
                  {{ item.amount_to_transfer != null
                    ? item.amount_to_transfer.toFixed(2)
                    : '-' }}
                </div>
              </template>
              <template #item.origem="{ item }">
                {{ item.from_user_bank_account?.bank_name || '-' }}
              </template>
              <template #item.destino="{ item }">
                {{ item.to_bank_account?.bank_name || '-' }}
              </template>
            </v-data-table>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/auth/authStore';
import { useTransactionStore } from '@/stores/transactionStore';
import DateFilter from '@/components/filters/DateFilter.vue';
import ValueFilter from '@/components/filters/ValueFilter.vue';
import type { DataTableHeader } from 'vuetify';

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

// Filtros (todos iniciados como string vazia para compatibilidade com store)
const dateStart = ref<string>('');
const dateEnd = ref<string>('');
const minValue = ref<string>('');
const maxValue = ref<string>('');
const page = ref<number>(1);
const perPage = ref<number>(10);

// Controle dos menus de data
const menuStart = ref(false);
const menuEnd = ref(false);

// Definição CORRETA dos headers para v-data-table
const headers: DataTableHeader[] = [
  { title: 'Data', value: 'date', width: '20%' },
  { title: 'Tipo', value: 'type', width: '15%' },
  { title: 'Valor', value: 'value', width: '15%', align: 'end' },
  { title: 'Origem', value: 'origem', width: '25%' },
  { title: 'Destino', value: 'destino', width: '25%' },
];

// Dados calculados
const transactions = computed(() => transactionStore.statement);
const totalRecords = computed(() => transactionStore.totalRecords);

const filteredTransactions = computed(() => {
  return transactionStore.statement.filter((transaction) => {
    const transactionDate = new Date(transaction.created_at).toISOString().split('T')[0];
    const isWithinDateRange =
      (!dateStart.value || transactionDate >= dateStart.value) &&
      (!dateEnd.value || transactionDate <= dateEnd.value);
    const isAboveMinValue = !minValue.value || transaction.amount_to_transfer >= parseFloat(minValue.value);
    const isBelowMaxValue = !maxValue.value || transaction.amount_to_transfer <= parseFloat(maxValue.value);

    return isWithinDateRange && isAboveMinValue && isBelowMaxValue;
  });
});

// Regras de validação simples
const rulePositive = (v: string) => {
  if (v === '') return true;
  const num = parseFloat(v.replace(',', '.'));
  return (!isNaN(num) && num >= 0) || 'Valor deve ser ≥ 0';
};

async function fetchTransactions(customPage?: number) {
  if (!authStore.token) return;
  loading.value = true;
  error.value = '';
  try {
    await transactionStore.fetchStatement(authStore.token, {
      dateStart: dateStart.value ? new Date(dateStart.value).toISOString().split('T')[0] : undefined,
      dateEnd: dateEnd.value ? new Date(dateEnd.value).toISOString().split('T')[0] : undefined,
      minValue: minValue.value || undefined,
      maxValue: maxValue.value || undefined,
      page: customPage ?? page.value,
      perPage: perPage.value,
    });
    if (typeof customPage === 'number') {
      page.value = customPage;
    }
  } catch {
    error.value = 'Erro ao buscar extrato';
  } finally {
    loading.value = false;
  }
}

onMounted(() => fetchTransactions());
useDebouncedWatch(
  [dateStart, dateEnd, minValue, maxValue],
  () => {
    page.value = 1;
    fetchTransactions(1);
  },
  400
);

// Quando o usuário altera a página ou itens por página, busca novamente
watch([page, perPage], ([newPage, newPerPage], [oldPage, oldPerPage]) => {
  if (newPage !== oldPage || newPerPage !== oldPerPage) {
    fetchTransactions(newPage);
  }
});
</script>

<style scoped>
/* Ajustes de estilo para colunas mais largas e legíveis */
.statement-table {
  width: 100%; /* Garante que a tabela ocupe toda a largura do contêiner */
  max-width: 100%; /* Remove restrições de largura máxima */
  margin: 0; /* Remove margens extras */
}

.statement-table th,
.statement-table td {
  padding: 0.75rem 2rem; /* Aumenta o espaçamento horizontal */
  word-break: break-word;
}

.statement-table th {
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

/* Hover para linha */
.statement-table tbody tr:hover td {
  background-color: #f1f3f5;
}

/* Remove padding extra do container Vuetify, se houver */
.v-application--wrap {
  padding-bottom: 0 !important;
}
</style>
