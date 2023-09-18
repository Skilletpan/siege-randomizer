<template>
  <v-card
    :subtitle="strat.description"
    :title="strat.title"
    width="800"
  >
    <template v-slot:append>
      <v-icon :icon="SIDES[activeSide].icon" />
    </template>

    <!-- Required Operators -->
    <template v-if="requiredOperators.length">
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
    <template v-if="disallowedOperators.length">
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
          v-for="(rule, index) in strat.rules.filter((r) => r.side === activeSide || r.side === SIDES.ALL.key)"
          :key="index"
          class="pl-0"
          :title="rule.value"
        >
          <!-- Icon or Operator Icon -->
          <template v-slot:prepend>
            <v-avatar rounded="0">
              <v-img
                v-if="rule.operator"
                :src="loadEmblem(rule.operator)"
              />
              <v-icon
                v-else
                :icon="SIDES[rule.side].icon"
              />
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- Preview Actions -->
    <template v-if="preview && strat.side === SIDES.ALL.key">
      <v-divider />
      <v-card-actions>
        <v-spacer />

        <!-- Side Toggle -->
        <v-btn
          color="primary"
          :prepend-icon="activeSide === SIDES.ATT.key ? SIDES.DEF.icon : SIDES.ATT.icon"
          :text="`${activeSide === SIDES.ATT.key ? SIDES.DEF.name : SIDES.ATT.name} Version`"
          @click="togglePreviewSide"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue';

import { loadEmblem } from '@/composables/imageLoader';
import { OPERATORS, SIDES } from '@/data';

import OperatorLabel from './OperatorLabel';

// Define input properties
const props = defineProps({
  preview: {
    default: false,
    type: Boolean
  },

  side: {
    default: null,
    type: String,
    validator: (v) => ['ATT', 'DEF'].includes(v)
  },

  strat: {
    required: true,
    type: Object
  }
});

// Define dynamic properties
const previewSide = ref(null);

// Define computed properties
/**
 * Computes which side version of the card is rendered.
 */
const activeSide = computed(() => {
  if (props.preview) return previewSide.value;
  return props.side;
});

const disallowedOperators = computed(() => {
  if (!props.strat.disallowedOperators) return [];
  return props.strat.disallowedOperators.filter((o) => OPERATORS[o].side === activeSide.value);
});

const requiredOperators = computed(() => {
  if (!props.strat.requiredOperators) return [];
  return props.strat.requiredOperators.filter((o) => OPERATORS[o].side === activeSide.value);
});

// const rules = computed(() => {
  
// });

function togglePreviewSide() {
  previewSide.value = previewSide.value === SIDES.ATT.key ? SIDES.DEF.key : SIDES.ATT.key;
}

watch(
  props.strat,
  (strat) => {
    if (props.preview) previewSide.value = strat.side === SIDES.ALL.key ? SIDES.ATT.key : strat.side;
  },
  { immediate: true }
);
</script>
