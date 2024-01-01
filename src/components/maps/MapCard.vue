<template>
  <!-- Default Variant -->
  <v-card
    v-if="cardVariant.default"
    v-bind="$attrs"
    :image="displayMap.thumbnail"
  >
    <!-- Name -->
    <v-card-item
      class="map-name"
      :title="displayMap.name"
    />
  </v-card>

  <!-- Other Variants -->
  <v-card
    v-else
    v-bind="$attrs"
  >
    <!-- Thumbnail -->
    <v-img
      :aspect-ratio="16 / 9"
      class="align-end"
      cover
      :src="displayMap.thumbnail"
    >
      <!-- Name -->
      <v-card-item
        v-if="!cardVariant.placeholder"
        class="map-name text-center"
      >
        <v-card-title class="font-weight-bold text-uppercase">{{ displayMap.name }}</v-card-title>
      </v-card-item>

      <!-- Randomize Icon -->
      <v-icon
        v-else
        class="h-100 randomize-icon w-100"
        icon="mdi-dice-multiple-outline"
        size="70"
      />
    </v-img>

    <!-- Details -->
    <template v-if="cardVariant.detailed">
      <v-divider />

      <!-- Playlists -->
      <v-card-text class="px-4 py-3">
        <label-row-display
          :items="displayMap.playlists"
          label="Playlists"
        />
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed, toRaw } from 'vue';

import { LabelRowDisplay } from '@/components';
import { SiegeMap } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The map to display. */
  map: {
    default: null,
    type: [SiegeMap, String],
    validator: (v) => typeof v === 'string' ? SiegeMap.KEYS.includes(v) : true
  },

  /** The variant of the card to display. */
  variant: {
    default: 'default',
    type: String,
    validator: (v) => ['default', 'detailed', 'placeholder', 'prominent'].includes(v)
  }
});

/**
 * The map to display on the card.
 * @type {import('vue').ComputedRef<SiegeMap>}
 */
const displayMap = computed(() => {
  // Pick random map for placeholder cards
  if (cardVariant.value.placeholder) return SiegeMap.pickRandom();

  // Get display map from `props`
  if (typeof props.map === 'string') return SiegeMap.valueOf(props.map);
  return toRaw(props.map);
});

/**
 * Maps the card variant into an object for easier access.
 * @type {import('vue').ComputedRef<{ [variant: String]: Boolean }>}
 */
const cardVariant = computed(() => ({ [props.variant]: true }));
</script>

<style scoped>
.map-name {
  backdrop-filter: brightness(60%);
  -webkit-backdrop-filter: brightness(60%);
}
</style>
