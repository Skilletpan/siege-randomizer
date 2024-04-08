<template>
  <v-card
    color="grey-darken-4"
    :width="big ? 500 : 300"
  >
    <!-- Map Image -->
    <v-img
      :alt="`${map.name} thumbnail`"
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
          v-for="playlist in map.playlists"
          :key="playlist.key"
          class="mb-2 mr-2"
          label
          :text="playlist.name"
        />
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

import { SiegeMap } from '@/models';

// Component props
const props = defineProps({
  /** Whether the card should be displayed bigger. */
  big: Boolean,

  /** Whether the card should be displayed as inactive. */
  inactive: Boolean,

  /** Whether map details should be displayed. */
  detailed: Boolean,

  /** The key of the map to display. */
  mapKey: {
    type: String,
    validator: (v) => Object.keys(SiegeMap).includes(v)
  },

  /** Whether the card should be displayed as a placeholder. */
  placeholder: Boolean
});

/**
 * The map to display.
 * 
 * If no map key is set in `props`, a random map is picked.
 * 
 * @type {import('vue').ComputedRef<SiegeMap>}
 */
const map = computed(() => {
  if (!props.mapKey) return SiegeMap.random();
  return SiegeMap[props.mapKey];
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
