<template>
  <v-container class="py-6" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- Card Principal -->
        <v-card elevation="2" rounded="lg">
          <!-- Título -->
          <v-card-title class="pb-0">
            <span class="text-h5 text-primary">Extrato Bancário</span>
          </v-card-title>

          <!-- Card de Filtros -->
          <v-card-text class="pt-2 pb-0">
            <v-form @submit.prevent>
              <v-row dense>
                <!-- Data Início -->
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    v-model="menuStart"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="dateStart"
                        label="Data Início"
                        prepend-icon="mdi-calendar"
                        readonly
                        dense
                        outlined
                        clearable
                      />
                    </template>
                    <v-date-picker
                      v-model="dateStart"
                      @update:model-value="menuStart = false"
                      locale="pt-br"
                      no-title
                      scrollable
                    />
                  </v-menu>
                </v-col>

                <!-- Data Fim -->
                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    v-model="menuEnd"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="dateEnd"
                        label="Data Fim"
                        prepend-icon="mdi-calendar"
                        readonly
                        dense
                        outlined
                        clearable
                      />
                    </template>
                    <v-date-picker
                      v-model="dateEnd"
                      @update:model-value="menuEnd = false"
                      locale="pt-br"
                      no-title
                      scrollable
                    />
                  </v-menu>
                </v-col>

                <!-- Valor Mínimo -->
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="minValue"
                    label="Valor Mínimo (R$)"
                    type="text"
                    dense
                    outlined
                    hide-details
                    :rules="[rulePositive]"
                    placeholder="0,00"
                    clearable
                  />
                </v-col>

                <!-- Valor Máximo -->
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="maxValue"
                    label="Valor Máximo (R$)"
                    type="text"
                    dense
                    outlined
                    hide-details
                    :rules="[rulePositive]"
                    placeholder="0,00"
                    clearable
                  />
                </v-col>

                <!-- Por Página -->
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="perPage"
                    label="Por Página"
                    type="number"
                    dense
                    outlined
                    hide-details
                    :rules="[rulePerPage]"
                    placeholder="10"
                    clearable
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <!-- Loading Overlay -->
          <v-overlay :value="loading" absolute>
            <v-progress-circular
              indeterminate
              color="primary"
              size="48"
              width="4"
            />
          </v-overlay>

          <!-- Tabela de Transações -->
          <v-card-text class="pt-0">
            <v-simple-table dense class="statement-table">
              <!-- Define proporção das colunas -->
              <colgroup>
                <col style="width: 15%" />
                <col style="width: 15%" />
                <col style="width: 15%" />
                <col style="width: 25%" />
                <col style="width: 25%" />
                <col style="width: 15%" />
              </colgroup>

              <thead>
                <tr>
                  <th class="text-left">Data</th>
                  <th class="text-left">Tipo</th>
                  <th class="text-left">Valor (R$)</th>
                  <th class="text-left">Origem</th>
                  <th class="text-left">Destino</th>
                  <th class="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tx in transactions" :key="tx.id">
                  <td class="col-data">
                    {{ tx.created_at
                      ? new Date(tx.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-' }}
                  </td>
                  <td class="col-tipo">{{ tx.transfer_type_text || '-' }}</td>
                  <td class="col-valor">
                    {{ tx.amount_to_transfer != null
                      ? tx.amount_to_transfer.toFixed(2)
                      : '-' }}
                  </td>
                  <td class="col-origem">
                    <div v-if="tx.from_user_bank_account">
                      {{ tx.from_user_bank_account.bank_name }}<br />
                      {{ tx.from_user_bank_account.account_number }}-
                      {{ tx.from_user_bank_account.account_digit }}
                    </div>
                    <div v-else>-</div>
                  </td>
                  <td class="col-destino">
                    <div v-if="tx.to_bank_account">
                      {{ tx.to_bank_account.bank_name }}<br />
                      {{ tx.to_bank_account.account_number }}-
                      {{ tx.to_bank_account.account_digit }}
                    </div>
                    <div v-else>-</div>
                  </td>
                  <td class="col-status">
                    <v-chip
                      :color="tx.was_success ? 'green lighten-2' : 'red lighten-2'"
                      small
                      text-color="white"
                    >
                      {{ tx.was_success ? 'Sucesso' : 'Falha' }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>

          <!-- Paginação -->
          <v-card-actions class="justify-center pt-0">
            <v-btn
              color="primary"
              :disabled="page === 1"
              @click="prevPage"
              small
            >
              ← Anterior
            </v-btn>
            <span class="mx-4 text-subtitle-2">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <v-btn
              color="primary"
              :disabled="page === totalPages"
              @click="nextPage"
              small
            >
              Próxima →
            </v-btn>
          </v-card-actions>

          <!-- Mensagem de Erro -->
          <v-card-text v-if="error" class="py-2">
            <v-alert type="error" dense outlined>
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

// Dados calculados
const transactions = computed(() => transactionStore.statement);
const currentPage = computed(() => transactionStore.currentPage);
const totalPages = computed(() => transactionStore.totalPages);

// Regras de validação simples
const rulePositive = (v: string) => {
  if (v === '') return true;
  const num = parseFloat(v.replace(',', '.'));
  return (!isNaN(num) && num >= 0) || 'Valor deve ser ≥ 0';
};
const rulePerPage = (v: number | null) =>
  v === null || (v >= 1 && v <= 100) || 'Entre 1 e 100';

async function fetchTransactions(customPage?: number) {
  if (!authStore.token) return;
  loading.value = true;
  error.value = '';
  try {
    await transactionStore.fetchStatement(authStore.token, {
      dateStart: dateStart.value || undefined,
      dateEnd: dateEnd.value || undefined,
      minValue: minValue.value || undefined,
      maxValue: maxValue.value || undefined,
      page: customPage ?? page.value,
      perPage: perPage.value,
    });
    if (typeof customPage === 'number') {
      page.value = customPage;
    }
  } catch (e) {
    error.value = 'Erro ao buscar extrato';
  } finally {
    loading.value = false;
  }
}

onMounted(() => fetchTransactions());
useDebouncedWatch(
  [dateStart, dateEnd, minValue, maxValue, perPage],
  () => {
    fetchTransactions(1);
  }
);

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
/* Ajustes de estilo para colunas mais largas e legíveis */

.statement-table th,
.statement-table td {
  padding: 0.75rem 1rem;
  word-break: break-word;
}

.statement-table th {
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

/* As larguras em % no <colgroup> já equilibram proporcionalmente,
   mas pode-se ajustar ainda mais individualmente, se necessário: */

.col-data {
  /* Data - texto curto */
  min-width: 120px;
}

.col-tipo {
  /* Tipo - texto curto */
  min-width: 100px;
}

.col-valor {
  /* Valor - numérico */
  min-width: 100px;
  text-align: right;
}

.col-origem,
.col-destino {
  /* Origem e Destino - podem ter texto mais longo */
  min-width: 180px;
}

.col-status {
  /* Status (chip) */
  min-width: 100px;
  text-align: center;
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
