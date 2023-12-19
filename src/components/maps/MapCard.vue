<template>
  <v-card>
    <!-- Prominent Thumbnail -->
    <v-img
      v-if="!cardVariant.default"
      :class="{ 'align-end': !cardVariant.placeholder }"
      cover
      :src="{ src: map.thumbnail, aspect: 16 / 9 }"
    >
      <!-- Name -->
      <v-card-title
        v-if="!cardVariant.placeholder"
        class="font-weight-medium map-name text-center text-uppercase"
      >
        {{ map.name }}
      </v-card-title>

      <!-- Randomize Icon -->
      <v-icon
        v-else
        class="align-center h-100 justify-center randomize-icon w-100"
        icon="mdi-dice-multiple-outline"
        size="70"
      />
    </v-img>

    <!-- Background Thumbnail -->
    <template
      v-slot:image
      v-if="cardVariant.default"
    >
      <v-img
        cover
        :src="map.thumbnail"
      />
    </template>

    <!-- Name -->
    <v-card-title
      v-if="cardVariant.default"
      class="map-name"
    >
      {{ map.name }}
    </v-card-title>

    <!-- Details -->
    <template v-if="cardVariant.detailed">
      <v-divider />

      <!-- Playlists -->
      <v-card-text class="pa-4 pt-3">
        <field-label>Playlists</field-label>
        <label-row>
          <v-chip
            v-for="playlist in map.playlists"
            :key="playlist.key"
            :text="playlist.name"
          />
        </label-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

import { Map } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The key of the map to display. */
  mapKey: {
    type: String,
    validator: (v) => Map.KEYS.includes(v)
  },

  /** The variant of the card to display. */
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'detailed', 'placeholder', 'prominent'].includes(v)
  }
});

/**
 * The map to display on the card.
 * 
 * A random map will be drawn for placeholder cards.
 * 
 * @type {import('vue').ComputedRef<Map>}
 */
const map = computed(() => {
  if (props.variant === 'placeholder') return Map.pickRandom();
  return Map.valueOf(props.mapKey);
});

/**
 * Maps the card variant into an object for easier access.
 * @type {import('vue').ComputedRef<{ [variant: String]: Boolean }>}
 */
const cardVariant = computed(() => ({ [props.variant]: true }));
</script>

<style scoped>
.map-name {
  backdrop-filter: brightness(50%);
  -webkit-backdrop-filter: brightness(50%);
}

.randomize-icon {
  backdrop-filter: brightness(30%) grayscale(100%);
  -webkit-backdrop-filter: brightness(30%) grayscale(100%);
}
</style>
