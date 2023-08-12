<template>
  <v-card :variant="inactive ? 'elevated' : 'tonal'" :width="big ? 500 : 300">
    <!-- Map Image -->
    <v-img :alt="value.name" :aspect-ratio="16 / 9" :class="{ inactive }" :lazy-src="PLACEHOLDER_MAP" :src="image" />

    <!-- Map Name -->
    <v-card-title :class="['text-center', { 'text-button': isEmptyRandomize, 'text-primary': isEmptyRandomize }]">
      {{ value.name }}
    </v-card-title>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

// Define static properties
const PLACEHOLDER_MAP = require('@/assets/maps/OREGON.jpg');

// Define input properties
const props = defineProps({
  big: {
    type: Boolean
  },

  inactive: {
    type: Boolean
  },

  value: {
    default: () => ({ name: 'Randomize' }),
    type: Object
  }
});

// Define computed properties
const image = computed(() => props.value.key ? require(`@/assets/maps/${props.value.key}.jpg`) : null);
const isEmptyRandomize = computed(() => props.big && !props.value.key);
</script>

<style scoped>
.inactive {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
</style>
