<template>
  <v-card variant="tonal" :width="big ? 500 : 300">
    <v-img :alt="map.name" :src="image" />
    <v-card-title class="text-center">{{ map.name }}</v-card-title>
    <v-card-text v-if="detailed && false">
      <p>
        <strong>Playlists:</strong>
        {{ map.playlists.join(' • ') }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { MAPS_MAP } from '@/data';

// Define input properties
const props = defineProps({
  big: {
    type: Boolean
  },
  detailed: {
    type: Boolean
  },
  value: {
    required: true,
    type: String
  }
});

// Define computed properties
const map = computed(() => MAPS_MAP[props.value]);
const image = computed(() => require(`@/assets/maps/${map.value.key}.jpg`));
</script>
