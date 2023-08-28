<template>
  <v-list-item
    :prepend-avatar="emblem"
    :title="operator.name"
    :value="props.value"
  />
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { OPERATORS } from '@/data';

const props = defineProps({
  value: {
    required: true,
    type: String
  }
});

const operator = computed(() => OPERATORS.find((o) => o.key === props.value));

const emblem = computed(() => require(`@/assets/emblems/${props.value}.png`));

const roles = computed(() => operator.value.roles.join(' • ') || 'None');
</script>
