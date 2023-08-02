<template>
  <v-card variant="tonal" :width="big ? 500 : 300">
    <v-img :alt="map.name" :src="image">
      <v-skeleton-loader v-if="!value" type="image" />
    </v-img>
    <v-card-title class="text-center">{{ map.name }}</v-card-title>
    <v-card-text v-if="detailed && false">
      <strong>Playlists:</strong>
      {{ map.playlists.join(' • ') }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs';

// Define input properties
const props = defineProps({
  big: {
    type: Boolean
  },
  detailed: {
    type: Boolean
  },
  value: {
    type: Object
  }
});

// Define computed properties
const map = computed(() => props.value || { key: 'NONE', name: 'None' });
const image = computed(() => props.value ? require(`@/assets/maps/${map.value.key}.jpg`) : null);
</script>
