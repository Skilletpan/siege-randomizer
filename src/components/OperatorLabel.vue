<template>
  <v-chip
    class="font-weight-bold"
    :color="negative ? 'error' : null"
    label
    :prepend-avatar="loadEmblem(operator.key)"
    :text="operator.name"
  />
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { loadEmblem } from '@/composables/imageLoader';
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
    validator: (v) => Object.keys(OPERATORS).includes(v)
  }
});

// Define dynamic properties
/**
 * Fetches the operator data.
 */
const operator = computed(() => OPERATORS[props.operatorKey]);
</script>
