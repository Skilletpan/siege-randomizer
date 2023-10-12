<template>
  <v-card
    color="grey-darken-4"
    :width="big ? 500 : 300"
  >
    <!-- Map Image -->
    <v-img
      :alt="map.name"
      :aspect-ratio="16 / 9"
      :class="{ inactive, placeholder }"
      cover
      :src="loadMapPreview(placeholder ? map.key : mapKey)"
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
          v-for="p in playlists"
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
import { computed, defineProps } from 'vue';

import { loadMapPreview } from '@/composables/imageLoader';
import { MAPS, MAP_LIST, PLAYLIST_LIST } from '@/data';

// Define input properties
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
    validator: (v) => Object.keys(MAPS).includes(v)
  },

  placeholder: {
    default: false,
    type: Boolean
  }
});

// Define computed properties
const map = computed(() => {
  if (!props.mapKey) return MAP_LIST[Math.floor(Math.random() * MAP_LIST.length)];
  return MAPS[props.mapKey];
});

const playlists = computed(() => PLAYLIST_LIST.filter((p) => p.maps.includes(props.mapKey)));
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
