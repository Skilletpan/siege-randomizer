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
import { computed } from 'vue';

import { Operator } from '@/models';

// Component props
const props = defineProps({
  /** Whether the label should be displayed in red. */
  negative: Boolean,

  /** The key of the operator to display. */
  operatorKey: {
    required: true,
    type: String,
    validator: (v) => Object.keys(Operator).includes(v)
  }
});

/**
 * The operator to display.
 * @type {import('vue').ComputedRef<Operator>}
 */
const operator = computed(() => Operator[props.operatorKey]);
</script>
