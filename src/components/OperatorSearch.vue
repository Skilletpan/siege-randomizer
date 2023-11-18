<template>
  <v-autocomplete
    ref="search"
    v-bind="$props"
    :items="operators"
    item-title="name"
    item-value="id"
    placeholder="Search..."
    @update:model-value="pickOperator($event)"
  >
    <template v-slot:item="{ item, props }">
      <v-list-item
        v-bind="props"
        :prepend-avatar="Operator[item.value].emblem"
      />
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref } from 'vue';

import { Operator } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  operators: {
    default: () => Operator.LIST,
    type: Array
  }
});

// eslint-disable-next-line
const emit = defineEmits(['pick']);

const search = ref(null);

function pickOperator(operatorKey) {
  if (!operatorKey) return;

  search.value.reset();
  emit('pick', operatorKey);
}
</script>