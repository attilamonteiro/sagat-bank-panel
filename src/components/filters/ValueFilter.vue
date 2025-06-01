<template>
  <v-col cols="12" sm="3" md="3">
    <v-text-field
      v-model="internalValue"
      :label="label"
      :placeholder="placeholder"
      :rules="[rulePositive]"
      dense
      outlined
      clearable
    />
  </v-col>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue ?? '');

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});

const rulePositive = (v: string) => {
  if (v === '') return true;
  const num = parseFloat(v.replace(',', '.'));
  return (!isNaN(num) && num >= 0) || 'Valor deve ser ≥ 0';
};
</script>

<style scoped>
</style>
