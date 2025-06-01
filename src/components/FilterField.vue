<template>
  <v-col cols="12" sm="3" md="3">
    <v-menu
      v-if="type === 'date'"
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
          :value="modelValue"
          @input="$emit('update:modelValue', $event)"
          :label="label"
          :prepend-icon="icon"
          readonly
          dense
          outlined
          clearable
        />
      </template>
      <v-date-picker
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event); menu = false"
        locale="pt-br"
        no-title
        scrollable
      />
    </v-menu>
    <v-text-field
      v-else
      :value="modelValue"
      @input="$emit('update:modelValue', $event)"
      :label="label"
      :placeholder="placeholder"
      :rules="rules"
      dense
      outlined
      clearable
    />
  </v-col>
</template>

<script setup lang="ts">
import { ref, defineProps, PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rules: {
    type: Array as PropType<
      readonly (
        | string
        | boolean
        | ((value: any) => boolean | string)
        | ((value: any) => Promise<boolean | string>)
      )[]
    >,
    default: () => [],
  },
  type: {
    type: String,
    default: 'text',
  },
});

// Manage menu state locally
const menu = ref(false);
</script>

<style scoped>
/* Add any specific styles for the FilterField component here */
</style>
