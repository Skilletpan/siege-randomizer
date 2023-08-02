<template>
  <v-card width="700">
    <v-card-title class="text-center">{{ strat.title }}</v-card-title>
    <v-card-text class="text-center">{{ strat.description }}</v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  value: {
    type: Object,
  }
});

const strat = computed(() => props.value || { title: 'None', description: 'None' });
</script>
