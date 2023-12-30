<template>
  <v-card>
    <!-- Default Thumbnail -->
    <template
      v-if="cardVariant.default"
      #image
    >
      <v-img
        cover
        :src="displayMap.thumbnail"
      />
    </template>

    <!-- Prominent Thumbnail -->
    <v-img
      v-if="cardVariant.prominent || cardVariant.detailed"
      :aspect-ratio="16 / 9"
      class="mb-n12"
      cover
      :src="displayMap.thumbnail"
    />

    <!-- Placeholder Thumbnail Loop -->
    <template v-else-if="cardVariant.placeholder">
      <v-fade-transition
        disabled
        group
        leave-absolute
      >
        <!-- Thumbnail -->
        <v-img
          v-for="m in SiegeMap.LIST"
          v-show="toRaw(placholderMap) === m"
          :key="m.key"
          :aspect-ratio="16 / 9"
          cover
          :src="m.thumbnail"
        />
      </v-fade-transition>

      <!-- Randomize Icon -->
      <v-icon
        class="h-100 randomize-icon w-100"
        icon="mdi-dice-multiple-outline"
        size="70"
      />
    </template>

    <!-- Name -->
    <v-card-title
      v-if="!cardVariant.placeholder"
      class="map-name"
      :class="{ 'font-weight-bold text-center text-uppercase': !cardVariant.default }"
    >
      {{ displayMap.name }}
    </v-card-title>

    <!-- Details -->
    <template v-if="cardVariant.detailed">
      <v-divider />

      <!-- Playlists -->
      <v-card-text class="pa-4 pt-3">
        <field-label class="mb-1">Playlists</field-label>
        <label-row>
          <v-chip
            v-for="playlist in displayMap.playlists"
            :key="playlist.key"
            :text="playlist.name"
          />
        </label-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed, toRaw } from 'vue';

import { usePlaceholderShuffler } from '@/composables/placeholderShuffler';
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
  // if (cardVariant.value.placeholder) return null;

  // Get display map from `props`
  if (typeof props.map === 'string') return SiegeMap.valueOf(props.map);
  return toRaw(props.map);
});

/**
 * Maps the card variant into an object for easier access.
 * @type {import('vue').ComputedRef<{ [variant: String]: Boolean }>}
 */
const cardVariant = computed(() => ({ [props.variant]: true }));

/**
 * Shuffles a new placeholder map every 5 seconds.
 * @type {import('vue').Ref<SiegeMap>}
 */
const placholderMap = usePlaceholderShuffler(
  SiegeMap.LIST,
  () => cardVariant.value.placeholder
);
</script>

<style scoped>
.map-name {
  backdrop-filter: brightness(60%);
  -webkit-backdrop-filter: brightness(60%);
}
</style>
