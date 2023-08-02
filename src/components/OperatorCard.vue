<template>
  <v-card variant="tonal" :width="big ? 500 : 300">
    <v-img />
    <v-card-title class="text-center">{{ operator.name }}</v-card-title>
    <v-card-subtitle v-if="!!value" class="pb-2 text-center">{{ operator.roles.join(' • ') }}</v-card-subtitle>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

// Define input properties
const props = defineProps({
  big: {
    type: Boolean
  },
  value: {
    type: Object
  }
});

// Define computed properties
const operator = computed(() => props.value || { name: 'None' });
</script>
