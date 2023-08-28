<template>
  <v-chip class="font-weight-bold" label :prepend-avatar="icon" :text="operator.name" />
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { OPERATORS } from '@/data';

const props = defineProps({
  value: {
    required: true,
    type: [Object, String],
    validator: (value) => {
      if (typeof value === 'object') return true;
      return OPERATORS.map((o) => o.key).includes(value);
    }
  }
});

const icon = computed(() => require(`@/assets/icons/${operator.value.key}.png`));

const operator = computed(() => {
  if (typeof props.value === 'object') return props.value;
  return OPERATORS.find((o) => o.key === props.value);
});
</script>

<style scoped>
.operator-label {
  width: 120px;
}
</style>
