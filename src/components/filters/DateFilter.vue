<template>
  <v-col cols="12" sm="3" md="3">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="250px"
      min-width="250px"
    >
      <template #activator="{ props }">
        <v-text-field
          v-bind="props"
          :value="internalValue"
          @input="updateValue($event)"
          :label="label"
          prepend-icon="mdi-calendar"
          readonly
          dense
          outlined
          clearable
        />
      </template>
      <v-date-picker
        v-model="internalValue"
        @update:model-value="updateValue"
        @change="menu = false"
        locale="pt-br"
        no-title
        scrollable
      />
    </v-menu>
  </v-col>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const menu = ref(false);
const internalValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString('pt-BR');
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
}

function updateValue(value: string | Date) {
  const formattedValue = value instanceof Date ? value.toISOString().split('T')[0] : value;
  internalValue.value = formattedValue;
  emit('update:modelValue', formattedValue);
}

watch(() => internalValue.value, (newValue) => {
  console.log('DateFilter internalValue updated (ISO):', newValue);
  emit('update:modelValue', newValue);
});
</script>

<style scoped>
</style>
