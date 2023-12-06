<template>
  <v-card :width="big ? 500 : 300">
    <!-- Map Image -->
    <v-img
      :alt="map.name"
      :aspect-ratio="16 / 9"
      :class="{ inactive, placeholder }"
      cover
      :src="map.thumbnail"
    />

    <!-- Map Name -->
    <v-card-title class="text-center">{{ placeholder ? '?' : map.name }}</v-card-title>

    <!-- Map Details -->
    <template v-if="!placeholder && detailed">
      <v-divider />
      <v-card-text>
        <!-- Playlists -->
        <v-label
          class="d-block mb-1 text-caption"
          text="Playlists"
        />
        <v-chip
          v-for="p in map.playlists"
          class="mb-2 mr-2"
          :key="p.key"
          label
          :text="p.name"
        />
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

import { Map } from '@/models';

// Define input properties
// eslint-disable-next-line
const props = defineProps({
  big: {
    type: Boolean
  },

  inactive: {
    type: Boolean
  },

  detailed: {
    default: false,
    type: Boolean
  },

  mapKey: {
    default: null,
    type: String,
    validator: (v) => !!Map[v]
  },

  placeholder: {
    default: false,
    type: Boolean
  }
});

// Define computed properties
/** @type {import('vue').ComputedRef<Map>} */
const map = computed(() => {
  if (!props.mapKey) return Map.LIST[Math.floor(Math.random() * Map.LIST.length)];
  return Map[props.mapKey];
});
</script>

<style scoped>
.inactive {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.placeholder {
  filter: brightness(10%) grayscale(100%);
  -webkit-filter: brightness(10%) grayscale(100%);
}
</style>
