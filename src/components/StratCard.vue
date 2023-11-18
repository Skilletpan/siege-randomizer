<template>
  <v-card
    :append-icon="displaySide.icon"
    :subtitle="strategy.tagline"
    :title="strategy.title"
    width="800"
  >
    <!-- Required Operators -->
    <template v-if="strategy.getRequiredOperators(displaySide).length">
      <v-divider />
      <v-card-subtitle class="mt-3">Required Operators</v-card-subtitle>
      <v-card-text class="pb-2 pl-3 pt-1">
        <operator-label
          v-for="{ id } in strategy.getRequiredOperators(displaySide)"
          :key="id"
          class="ma-1"
          :operator-key="id"
        />
      </v-card-text>
    </template>

    <!-- Allowed Operators -->
    <template v-if="strategy.getAllowedOperators(displaySide).length">
      <v-divider />
      <v-card-subtitle class="mt-3">Allowed Operators</v-card-subtitle>
      <v-card-text class="pb-2 pl-3 pt-1">
        <operator-label
          v-for="{ id } in strategy.getAllowedOperators(displaySide)"
          :key="id"
          class="ma-1"
          :operator-key="id"
        />
      </v-card-text>
    </template>

    <!-- Disallowed Operators -->
    <template v-if="strategy.getDisallowedOperators(displaySide).length">
      <v-divider />
      <v-card-subtitle class="mt-3">Disallowed Operators</v-card-subtitle>
      <v-card-text class="pb-2 pl-3 pt-1">
        <operator-label
          v-for="{ id } in strategy.getDisallowedOperators(displaySide)"
          :key="id"
          class="ma-1"
          negative
          :operator-key="id"
        />
      </v-card-text>
    </template>

    <!-- Rules -->
    <v-divider />
    <v-card-subtitle class="mt-3">Rules</v-card-subtitle>
    <v-card-text class="px-3 pt-2">
      <v-list class="pa-0">
        <v-list-item
          v-for="({ text, operator }, index) in strategy.getRules(displaySide)"
          :key="index"
          class="pl-0"
          :title="text"
        >
          <!-- Icon or Operator Icon -->
          <template v-slot:prepend>
            <v-avatar rounded="0">
              <v-img
                v-if="operator"
                :src="operator.emblem"
              />
              <v-icon
                v-else
                icon="mdi-account"
              />
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- Preview Actions -->
    <template v-if="preview && strategy.side === Side.ALL">
      <v-divider />
      <v-card-actions>
        <v-spacer />

        <!-- Side Toggle -->
        <v-btn
          color="primary"
          :prepend-icon="displaySide.oppositeSide.icon"
          :text="`${displaySide.oppositeSide.title} Version`"
          @click="displayKey = displaySide.oppositeSide.key"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

import { Side, Strategy } from '@/models';

import OperatorLabel from './OperatorLabel';

// Define input properties
// eslint-disable-next-line
const props = defineProps({
  preview: {
    default: false,
    type: Boolean
  },

  sideKey: {
    default: Side.ATT.key,
    type: String,
    validator: (v) => [Side.ATT.key, Side.DEF.key].includes(v)
  },

  stratId: {
    required: true,
    type: Number
  }
});

/** @type {import('vue').Ref<String>} */
const displayKey = ref(Side.ATT.key);

/** @type {import('vue').ComputedRef<Side>} */
const displaySide = computed(() => Side[displayKey.value]);

// Define computed properties
/** @type {import('vue').ComputedRef<Strategy>} */
const strategy = computed(() => Strategy[props.stratId]);

watch(
  strategy,
  (s) => {
    if (props.preview) displayKey.value = s.side === Side.ALL ? Side.ATT.key : s.side.key;
    else displayKey.value = props.sideKey;
  },
  { immediate: true }
);
</script>
