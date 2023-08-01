<template>
  <v-card variant="tonal" :width="big ? 500 : 300">
    <v-img />
    <v-card-title class="text-center">{{ operator.name }}</v-card-title>
    <v-card-subtitle class="pb-2 text-center">
      {{ operator.squad }}
      •
      {{ operator.roles.join(', ') }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { OPERATORS_MAP } from '@/data';

// Define input properties
const props = defineProps({
  big: {
    type: Boolean
  },
  value: {
    required: true,
    type: String
  }
});

// Define computed properties
const operator = computed(() => OPERATORS_MAP[props.value]);
</script>
