<template>
  <v-chip
    class="font-weight-bold"
    :color="negative ? 'error' : null"
    label
    :prepend-avatar="operator.emblem"
    :text="operator.name"
  />
</template>

<script setup>
import { Operator } from '@/models';

/**
 * The operator to display.
 * @type {import('vue').ModelRef<Operator>}
 */
const operator = defineModel({
  get: (operatorKey) => Operator[operatorKey],
  required: true,
  type: String,
  validator: (v) => Object.keys(Operator).includes(v)
});

// Component props
const props = defineProps({
  /** Whether the label should be displayed in red. */
  negative: Boolean
});
</script>
