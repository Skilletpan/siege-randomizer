<template>
  <v-card>
    <v-card-item
      class="px-4 py-3"
      :append-icon="displaySide.icon"
      :title="strat.title"
      :subtitle="strat.tagline"
    />

    <v-divider />

    <v-card-text class="pa-4">
      <!-- Required Operators -->
      <label-row-display
        v-if="strat.requiredOperators[displaySide.key].length"
        class="mb-3"
        :items="strat.requiredOperators[displaySide.key]"
        label="Required Operators"
      >
        <template #default="{ items }">
          <operator-label
            v-for="operator in items"
            :key="operator.key"
            class="ma-1"
            :operator-key="operator.key"
          />
        </template>
      </label-row-display>

      <!-- Allowed / Banned Operators -->
      <label-row-display
        v-if="showAllowedOperators"
        class="mb-3"
        :items="strat.allowedOperators[displaySide.key]"
        label="Allowed Operators"
      >
        <template #default="{ items }">
          <operator-label
            v-for="operator in items"
            :key="operator.key"
            class="ma-1"
            :operator-key="operator.key"
          />
        </template>
      </label-row-display>

      <label-row-display
        v-if="showDisallowedOperators"
        class="mb-3"
        :items="strat.disallowedOperators[displaySide.key]"
        label="Banned Operators"
      >
        <template #default="{ items }">
          <operator-label
            v-for="operator in items"
            :key="operator.key"
            banned
            class="ma-1"
            :operator-key="operator.key"
          />
        </template>
      </label-row-display>

      <v-label class="d-block text-caption">Rules</v-label>
      <v-row
        v-for="(rule, index) in strat.rules[displaySide.key]"
        :key="index"
        class="align-center px-0 text-body-1"
        no-gutters
      >
        <v-col
          class="mr-2 pa-0"
          cols="auto"
        >
          <operator-emblem
            icon="$operator"
            :image="rule.operator?.emblem"
          />
        </v-col>

        <v-col tag="span">{{ rule.text }}</v-col>
      </v-row>

      <label-row-display
        class="mt-3"
        :items="strat.tags"
        label="Tags"
      />
    </v-card-text>

    <template v-if="props.preview && strat.side === Side.ALL">
      <v-divider />

      <v-card-actions
        v-if="props.preview && strat.side === Side.ALL"
        class="pa-3"
      >
        <v-spacer />
        <v-btn
          :append-icon="displaySide.opposite.icon"
          :color="displaySide.opposite.color"
          :text="`${displaySide.opposite.name} version`"
          @click="sideKey = displaySide.opposite.key"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import { computed, watchEffect } from 'vue';

import { LabelRowDisplay, OperatorLabel } from '@/components';
import { Side, Strategy } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The ID of the strat to display. */
  stratId: {
    required: true,
    type: Number
  },

  /** Whether the card is a preview card (allows for side switching). */
  preview: Boolean
});

// eslint-disable-next-line
const sideKey = defineModel('sideKey', { type: String });

/**
 * The strat to display.
 * @type {import('vue').ComputedRef<Strategy>}
 */
const strat = computed(() => Strategy.get(props.stratId));

const showAllowedOperators = computed(() => {
  const { allowedOperators, disallowedOperators } = strat.value;

  return allowedOperators[sideKey.value].length && allowedOperators[sideKey.value].length <= disallowedOperators[sideKey.value].length;
});

const showDisallowedOperators = computed(() => {
  const { allowedOperators, disallowedOperators } = strat.value;

  return disallowedOperators[sideKey.value].length && disallowedOperators[sideKey.value].length < allowedOperators[sideKey.value].length;
});

/**
 * The side to display the version of.
 * @type {import('vue').ComputedRef<Side>}
 */
const displaySide = computed(() => Side.valueOf(sideKey.value));

watchEffect(() => {
  if (props.preview && !sideKey.value) sideKey.value = strat.value.side.included[0].key;
  console.log(sideKey.value);
});
</script>
