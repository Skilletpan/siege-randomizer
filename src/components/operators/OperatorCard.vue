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

  <!-- Other Variants -->
  <v-card
    v-else
    v-bind="$attrs"
  >
    <!-- Portrait -->
    <v-img
      v-bind="portraitProps"
      :aspect-ratio="3 / 5"
      class="align-end portrait"
      cover
    >
      <template v-if="!cardVariant.placeholder">
        <!-- Emblem -->
        <operator-emblem
          class="d-block mb-2 mx-auto"
          :image="displayOperator.emblem"
          size="70"
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
      </template>

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
                append-inner-icon="mdi-hospital-box-outline"
                class="mb-3"
                label="Speed and Health"
                prepend-inner-icon="mdi-speedometer"
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
                label="Gadgets Weapons"
              />
            </template>
          </v-card-text>
        </v-window-item>
      </v-window>
    </template>
  </v-card>
</template>

<script setup>
import { computed, shallowReadonly, shallowRef, toRaw } from 'vue';

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

  /** The variant of the card to display. */
  variant: {
    default: 'default',
    type: String,
    validator: (v) => ['default', 'detailed', 'prominent', 'placeholder'].includes(v)
  },
});

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
 * Maps the card variant into an object for easier access.
 * @type {import('vue').ComputedRef<{ [variant: String]: Boolean }>}
 */
const cardVariant = computed(() => ({ [props.variant]: true }));

const portraitProps = computed(() => {
  if (cardVariant.value.placeholder) return { src: displayOperator.value.portrait };
  return {
    src: displayOperator.value.easterEggPortrait,
    style: { backgroundImage: `url(${SiegeMap.pickRandom().thumbnail})` }
  };
});

/** The tab names on the detailed operator card. */
const TABS = shallowReadonly(['Details', 'Loadout']);

/** Which tab of the operator details to show. */
const tab = shallowRef(TABS[0]);
</script>

<style scoped>
.portrait {
  background-position: center;
  background-size: cover;
}

.operator-name {
  backdrop-filter: brightness(20%);
  -webkit-backdrop-filter: brightness(20%);
}
</style>
