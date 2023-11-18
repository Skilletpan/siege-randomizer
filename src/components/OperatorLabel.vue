<template>
  <v-chip
    v-bind="$props"
    class="font-weight-bold"
    :color="negative ? 'error' : null"
    label
    :prepend-avatar="operator.emblem"
    :text="operator.name"
  />
</template>

<script setup>
import { computed } from 'vue';

import { Operator } from '@/models';

// Define input properties
// eslint-disable-next-line
const props = defineProps({
  negative: {
    default: false,
    type: Boolean
  },

  operatorKey: {
    required: true,
    type: String,
    validator: (v) => Object.keys(Operator).includes(v)
  }
});

// Define dynamic properties
/** @type {import('vue').ComputedRef<Operator>} */
const operator = computed(() => Operator[props.operatorKey]);
</script>
