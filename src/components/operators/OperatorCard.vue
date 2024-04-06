<template>
  <!-- Default Variant -->
  <v-card
    v-if="cardVariant.default"
    v-bind="$attrs"
    :color="displayOperator.side.color"
    :title="displayOperator.name"
  >
    <!-- Emblem -->
    <template #prepend>
      <operator-emblem :image="displayOperator.emblem" />
    </template>
  </v-card>

  <!-- Placeholder Variant -->
  <v-card
    v-else-if="cardVariant.placeholder"
    v-bind="$attrs"
  >
    <!-- Portrait -->
    <v-img
      :aspect-ratio="3 / 5"
      class="align-end"
      cover
      :src="displayOperator.portrait"
    >
      <!-- Randomize Icon -->
      <v-icon
        class="h-100 randomize-icon w-100"
        icon="$randomize"
        size="70"
      />

      <!-- Player Name -->
      <v-card-item
        v-if="playerName"
        class="text-center"
        :subtitle="playerName"
      />
    </v-img>
  </v-card>

  <!-- Complex Variants -->
  <v-card
    v-else
    v-bind="$attrs"
  >
    <!-- Portrait -->
    <v-img
      :aspect-ratio="3 / 5"
      class="align-end portrait"
      cover
      :src="displayPortrait"
      :style="{ backgroundImage: `url(${displayMap})` }"
    >
      <!-- Reroll Button -->
      <v-btn
        v-if="refreshable"
        class="mr-3 mt-3 reroll-button"
        color="primary"
        icon="$randomize"
        size="small"
        @click.stop="emit('reroll')"
      />

      <!-- Emblem -->
      <operator-emblem
        class="d-block emblem mb-2 mx-auto"
        :image="displayOperator.emblem"
      />

      <!-- Operator Name and Player Name -->
      <v-card-item class="operator-name text-center">
        <!-- Operator Name -->
        <v-card-title
          class="font-weight-bold text-uppercase"
          :class="`text-${displayOperator.side.color}`"
        >
          {{ displayOperator.name }}
        </v-card-title>

        <!-- Player Name -->
        <v-card-subtitle v-if="!!playerName">{{ playerName }}</v-card-subtitle>
      </v-card-item>
    </v-img>

    <!-- Details -->
    <template v-if="cardVariant.detailed">
      <v-divider />

      <!-- Tabs -->
      <v-tabs
        v-model="tab"
        density="comfortable"
        fixed-tabs
        :items="TABS"
      />
      <v-divider />

      <!-- Tab Windows -->
      <v-window v-model="tab">
        <v-window-item
          v-for="t in TABS"
          :key="t"
          :value="t"
        >
          <v-card-text class="pa-4">
            <!-- Details -->
            <template v-if="t === TABS[0]">
              <!-- Speed and Health -->
              <base-display
                append-inner-icon="$operator-health"
                class="mb-3"
                label="Speed and Health"
                prepend-inner-icon="$operator-speed"
              >
                <v-radio-group
                  density="compact"
                  hide-details
                  inline
                  :model-value="true"
                  readonly
                >
                  <v-radio
                    v-for="i in 4"
                    :key="i"
                    class="mx-auto"
                    :color="i <= displayOperator.speed ? 'green' : 'blue'"
                  />
                </v-radio-group>
              </base-display>

              <!-- Roles -->
              <label-row-display
                :class="{ 'mb-4': !!displayOperator.squad }"
                :items="displayOperator.roles"
                label="Roles"
              />

              <!-- Squad -->
              <base-display
                v-if="displayOperator.squad"
                :append-avatar="{ value: displayOperator.squad.emblem, props: { rounded: 0 } }"
                label="Squad"
              >
                {{ displayOperator.squad.name }}
              </base-display>
            </template>

            <!-- Loadout -->
            <template v-if="t === TABS[1]">
              <!-- Primary Weapons -->
              <label-row-display
                class="mb-4"
                :items="displayOperator.loadout.primaryWeapons"
                label="Primary Weapons"
              />

              <!-- Secondary Weapons -->
              <label-row-display
                class="mb-4"
                :items="displayOperator.loadout.secondaryWeapons"
                label="Secondary Weapons"
              />

              <!-- Gadgets -->
              <label-row-display
                :items="displayOperator.loadout.gadgets"
                label="Gadgets"
              />
            </template>
          </v-card-text>
        </v-window-item>
      </v-window>
    </template>
  </v-card>
</template>

<script setup>
import { computed, shallowReadonly, shallowRef, toRaw, watchEffect } from 'vue';

import { BaseDisplay, LabelRowDisplay } from '@/components';
import { Operator, SiegeMap } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The ID of the operator to show in the card. */
  operator: {
    default: null,
    type: [Operator, String],
    validator: (v) => typeof v === 'string' ? Operator.KEYS.includes(v) : true
  },

  /** An optional player name to display along with the operator name. */
  playerName: {
    default: null,
    type: String
  },

  /** Whether the operator can be re-rolled. */
  refreshable: Boolean,

  /** The variant of the card to display. */
  variant: {
    default: 'default',
    type: String,
    validator: (v) => ['default', 'detailed', 'prominent', 'placeholder'].includes(v)
  },
});

// eslint-disable-next-line
const emit = defineEmits(['refresh']);

/**
 * The operator to display on the card.
 * @type {import('vue').ComputedRef<Operator>}
 */
const displayOperator = computed(() => {
  // Pick random operator for placeholder cards
  if (cardVariant.value.placeholder) return Operator.pickRandom();

  // Get display operator from `props`
  if (typeof props.operator === 'string') return Operator.valueOf(props.operator);
  return toRaw(props.operator);
});

/**
 * The operator portrait to display on the card.
 * @type {import('vue').ShallowRef<String>}
 */
const displayPortrait = shallowRef(null);

/**
 * The map thumbnail to display on the card.
 * @type {import('vue').ShallowRef<String>}
 */
const displayMap = shallowRef(null);

/**
 * Maps the card variant into an object for easier access.
 * @type {import('vue').ComputedRef<{ [variant: String]: Boolean }>}
 */
const cardVariant = computed(() => ({ [props.variant]: true }));

/** The tab names on the detailed operator card. */
const TABS = shallowReadonly(['Details', 'Loadout']);

/** Which tab of the operator details to show. */
const tab = shallowRef(TABS[0]);

// Updates the operator portrait and map background image every time the operator changes
watchEffect(() => {
  displayPortrait.value = displayOperator.value.easterEggPortrait;
  displayMap.value = SiegeMap.pickRandom().thumbnail;
});
</script>

<style scoped>
.portrait {
  background-position: center;
  background-size: cover;
}

.emblem {
  height: auto;
  width: calc(100% / 3);
}

.operator-name {
  backdrop-filter: brightness(20%);
  -webkit-backdrop-filter: brightness(20%);
}

.reroll-button {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
