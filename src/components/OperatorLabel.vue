<template>
  <v-chip
    class="font-weight-bold"
    :color="negative ? 'error' : null"
    label
    :prepend-avatar="icon"
    :text="operator.name"
  />
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { OPERATORS } from '@/data';

// Define input properties
const props = defineProps({
  negative: {
    default: false,
    type: Boolean
  },

  operatorKey: {
    required: true,
    type: String,
    validator: (value) => OPERATORS.map((o) => o.key).includes(value)
  }
});

// Define dynamic properties
/**
 * Fetches the operator icon.
 */
const icon = computed(() => require(`@/assets/icons/${props.operatorKey}.png`));

/**
 * Fetches the operator data.
 */
const operator = computed(() => OPERATORS.find((o) => o.key === props.operatorKey));
</script>
