<template>
  <v-chip
    v-bind="$props"
    class="font-weight-bold"
    :class="{ 'text-decoration-line-through': banned }"
    :color="labelColor"
    label
    :prepend-avatar="operator.emblem"
    :text="operator.name"
  />
</template>

<script setup>
import { computed } from 'vue';

import { Operator } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The key of the operator to display in the label. */
  operatorKey: {
    required: true,
    type: String,
    validator: (v) => Operator.KEYS.includes(v)
  },

  /** Whether to apply the side color of the operator to the label. */
  colored: {
    type: Boolean
  },

  /** Whether the label should indicate a banned operator. */
  banned: {
    type: Boolean
  }
});

/**
 * The operator to display in the label.
 * @type {import('vue').ComputedRef<Operator>}
 */
const operator = computed(() => Operator[props.operatorKey]);

/** The color the label should be. */
const labelColor = computed(() => {
  if (props.banned) return 'error';
  if (props.colored) return operator.value.side.color;
  return null;
});
</script>
