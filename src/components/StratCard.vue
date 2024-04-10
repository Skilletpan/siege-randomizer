<template>
  <v-card
    :append-icon="displaySide.icon"
    :subtitle="strat.tagline"
    :title="strat.title"
    width="800"
  >
    <!-- Required Operators -->
    <template v-if="strat.requiredOperators[displaySide.key]?.length">
      <v-divider />
      <v-card-subtitle class="mt-3">Required Operators</v-card-subtitle>
      <v-card-text class="pb-2 pl-3 pt-1">
        <operator-label
          v-for="operator in strat.requiredOperators[displaySide.key]"
          :key="operator.key"
          class="ma-1"
          :operator-key="operator.key"
        />
      </v-card-text>
    </template>

    <!-- Disallowed Operators -->
    <template v-if="strat.bannedOperators[displaySide.key]?.length">
      <v-divider />
      <v-card-subtitle class="mt-3">Disallowed Operators</v-card-subtitle>
      <v-card-text class="pb-2 pl-3 pt-1">
        <operator-label
          v-for="operator in strat.bannedOperators[displaySide.key]"
          :key="operator.key"
          class="ma-1"
          negative
          :operator-key="operator.key"
        />
      </v-card-text>
    </template>

    <!-- Rules -->
    <v-divider />
    <v-card-subtitle class="mt-3">Rules</v-card-subtitle>
    <v-card-text class="px-3 pt-2">
      <v-list class="pa-0">
        <v-list-item
          v-for="rule, index in strat.rules"
          :key="index"
          class="pl-0"
          :title="rule.text"
          v-show="!rule.side || rule.side === displaySide || rule.operator?.side === displaySide"
        >
          <!-- Icon or Operator Icon -->
          <template #prepend>
            <v-avatar
              icon="$siege-operators"
              :image="rule.operator?.emblem"
              rounded="0"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- Preview Actions -->
    <template v-if="preview && !strat.side">
      <v-divider />
      <v-card-actions>
        <v-spacer />

        <!-- Side Toggle -->
        <v-btn
          color="primary"
          :prepend-icon="displaySide === Side.ATT ? Side.DEF.icon : Side.ATT.icon"
          :text="`${displaySide === Side.ATT ? Side.DEF.name : Side.ATT.name} Version`"
          @click="togglePreviewSide"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';

import { Side, Strat } from '@/models';

import OperatorLabel from './OperatorLabel';

// Component props
const props = defineProps({
  preview: Boolean,

  /** The key of the side to display the strat for. */
  sideKey: {
    type: String,
    validator: (v) => Object.keys(Side).includes(v)
  },

  /** The ID of the strat to display. */
  stratId: {
    required: true,
    type: Number,
    validator: (v) => Object.keys(Strat).includes(String(v))
  }
});

/**
 * The key of the side to preview the strat for.
 * @type {import('vue').ComputedRef<String>}
 */
const previewSide = ref(null);

/**
 * The side to display the strat for.
 * @type {import('vue').ComputedRef<Side>}
 */
const displaySide = computed(() => {
  if (!props.preview) return Side[props.sideKey] || strat.value.side || Side.ATT;
  return Side[previewSide.value];
})

/**
 * The strat to display.
 * @type {import('vue').ComputedRef<Strat>}
 */
const strat = computed(() => Strat[props.stratId]);

/** Toggle the side to preview the strat for. */
function togglePreviewSide() {
  previewSide.value = previewSide.value === Side.ATT.key ? Side.DEF.key : Side.ATT.key;
}

// Reset preview side key on strat update
watchEffect(() => {
  if (strat.value) previewSide.value = strat.value.side?.key || Side.ATT.key;
});
</script>
