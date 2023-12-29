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
      class="align-end mb-n12"
      cover
      :src="displayMap.thumbnail"
    />

    <!-- Prominent and Placeholder Thumbnail -->
    <v-fade-transition
      v-if="cardVariant.placeholder"
      disabled
      group
      leave-absolute
    >
      <!-- Placeholder Thumbnail -->
      <v-img
        v-for="m, i in SiegeMap.LIST"
        v-show="cardVariant.placeholder && randomMap.index === i"
        :key="m.key"
        :aspect-ratio="16 / 9"
        cover
        :src="m.thumbnail"
      />

      <!-- Randomize Icon -->
      <v-icon
        v-if="cardVariant.placeholder"
        class="h-100 randomize-icon w-100"
        icon="mdi-dice-multiple-outline"
        size="70"
      />
    </v-fade-transition>

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
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, ref, toRaw, watchEffect } from 'vue';

import { SiegeMap } from '@/models';
import { useAppSettings } from '@/store';

// Extract refs from settings
const { animatePlaceholderCards } = storeToRefs(useAppSettings());

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
  // Get random map
  if (cardVariant.value.placeholder) return SiegeMap.LIST[randomMap.value.index];

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
 * The random map to display on placeholder cards and the timerId of the `setInterval`.
 * @type {import('vue').ComputedRef<{ index: Number, timerId: NodeJS.Timeout }>}
 */
const randomMap = ref({
  index: Math.floor(Math.random() * SiegeMap.LIST.length),
  timerId: null
});

// Starts and stops random placeholder map loop
watchEffect(() => {
  // Extract values
  const animate = animatePlaceholderCards.value;
  const { placeholder } = cardVariant.value;
  const { index, timerId } = randomMap.value;

  // Start random map loop
  if (placeholder && animate && !timerId) {
    randomMap.value.timerId = setInterval(
      () => {
        const pick = SiegeMap.pickRandom(null, SiegeMap.LIST[index]);
        randomMap.value.index = SiegeMap.LIST.indexOf(pick);
      },
      5000
    );
  }

  // Stop running random map loop
  if (timerId && !placeholder || !animate) {
    clearInterval(timerId);
    randomMap.value.timerId = null;
  }
});

// Stops the existing random map loop before unmounting the card.
onBeforeUnmount(() => { clearInterval(randomMap.value.timerId); });
</script>

<style scoped>
.map-name {
  backdrop-filter: brightness(60%);
  -webkit-backdrop-filter: brightness(60%);
}

.randomize-icon {
  position: absolute;
  top: 0;

  backdrop-filter: brightness(30%) grayscale(100%);
  -webkit-backdrop-filter: brightness(30%) grayscale(100%);
}
</style>
