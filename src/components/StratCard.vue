<template>
  <v-card width="800">
    <!-- Strat Name and Description -->
    <v-card-title class="pb-0">{{ strat.title }}</v-card-title>
    <v-card-subtitle class="mb-2">{{ strat.description }}</v-card-subtitle>

    <!-- Required Operators -->
    <template v-if="requiredOperators">
      <v-divider />
      <v-card-subtitle class="mt-3">Required Operators</v-card-subtitle>
      <v-card-text class="pb-2 pl-3 pt-1">
        <operator-label
          v-for="o in requiredOperators"
          :key="o"
          class="ma-1"
          :operator-key="o"
        />
      </v-card-text>
    </template>

    <!-- Disallowed Operators -->
    <template v-if="disallowedOperators">
      <v-divider />
      <v-card-subtitle class="mt-3">Disallowed Operators</v-card-subtitle>
      <v-card-text class="pb-2 pl-3 pt-1">
        <operator-label
          v-for="o in disallowedOperators"
          :key="o"
          class="ma-1"
          negative
          :operator-key="o"
        />
      </v-card-text>
    </template>

    <!-- Rules -->
    <v-divider />
    <v-card-subtitle class="mt-3">Rules</v-card-subtitle>
    <v-card-text class="px-3 pt-2">
      <v-list class="pa-0">
        <v-list-item
          v-for="(r, index) in rules"
          :key="index"
          class="pl-0"
          :title="r.value"
        >
          <!-- Icon or Operator Icon -->
          <template v-slot:prepend>
            <v-avatar rounded="0">
              <v-img
                v-if="r.operator"
                :src="loadEmblem(r.operator)"
              />
              <v-icon
                v-else
                :icon="activeSide === 'ATT' ? 'mdi-sword-cross' : 'mdi-chess-rook'"
              />
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- Preview Actions -->
    <template v-if="preview && strat.sides.length > 1">
      <v-divider />
      <v-card-actions>
        <v-spacer />

        <!-- Side Toggle -->
        <v-btn
          v-if="strat.sides.length > 1"
          color="primary"
          :prepend-icon="activeSide === 'ATT' ? 'mdi-chess-rook' : 'mdi-sword-cross'"
          :text="`${activeSide === 'ATT' ? 'Defense' : 'Attack'} Version`"
          @click="sideOverride = activeSide === 'ATT' ? 'DEF' : 'ATT'"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue';

import { loadEmblem } from '@/composables/imageLoader';

import OperatorLabel from './OperatorLabel';

// Define input properties
const props = defineProps({
  preview: {
    default: false,
    type: Boolean
  },

  side: {
    default: 'ATT',
    type: String,
    validator: (value) => ['ATT', 'DEF'].includes(value)
  },

  strat: {
    required: true,
    type: Object
  }
});

// Define dynamic properties
const sideOverride = ref('ATT');

// Define computed properties
/**
 * Computes which side version of the card is rendered.
 */
const activeSide = computed(() => {
  if (props.strat.sides.length === 1) return props.strat.sides[0];
  return props.preview ? sideOverride.value : props.side;
});

/**
 * Reads the disallowed operators from the strat on the active side.
 */
const disallowedOperators = computed(() => {
  if (!props.strat.disallowedOperators || !props.strat.disallowedOperators[activeSide.value]) return null;
  return props.strat.disallowedOperators[activeSide.value];
});

/**
 * Reads the required operators from the strat on the active side.
 */
const requiredOperators = computed(() => {
  if (!props.strat.requiredOperators || !props.strat.requiredOperators[activeSide.value]) return null;
  return props.strat.requiredOperators[activeSide.value];
});

/**
 * Reads the rules from the strat on the active side.
 */
const rules = computed(() => props.strat.rules
  .filter((r) => typeof r === 'string' || r.side === activeSide.value)
  .map((r) => typeof r === 'string' ? { value: r } : r)
);
</script>
