<template>
  <v-card :subtitle="value.description || 'None'" :title="value.title || 'None'" width="1000">
    <template v-if="rules.length">
      <v-divider />

      <v-card-subtitle class="mt-4">Rules</v-card-subtitle>
      <v-card-text class="pt-2 px-2">
        <v-list class="py-0" density="compact">
          <v-list-item v-for="(r, index) in rules" :key="index" prepend-icon="mdi-chevron-right">
            <v-list-item-title>
              <operator-label v-if="r.operator" :value="r.operator" />
              {{ r.value }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <template v-if="requiredOperators.length">
        <v-card-subtitle class="mt-4">Required Operators</v-card-subtitle>
        <v-card-text class="pt-2">
          <operator-label v-for="o in requiredOperators" :key="o.key" class="mr-2" :value="o" />
        </v-card-text>
      </template>
    </template>

  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { OPERATORS } from '@/data';
import OperatorLabel from './OperatorLabel';

// Define input properties
const props = defineProps({
  side: {
    type: String,
    validator: (value) => ['ATT', 'DEF'].includes(value)
  },

  value: {
    default: () => ({}),
    type: Object
  }
});

// Define computed properties
const requiredOperators = computed(() => {
  if (!props.value.requiredOperators || !props.value.requiredOperators[props.side]) return [];
  return OPERATORS.filter((o) => props.value.requiredOperators[props.side].includes(o.key));
});

const rules = computed(() => {
  if (!props.value.rules) return [];

  return props.value.rules
    // Filter out rules for opposing side
    .filter((r) => typeof r === 'string' || r.side === props.side)

    // Map rule
    .map((r) => typeof r === 'string' ? { value: r } : r);
});
</script>
