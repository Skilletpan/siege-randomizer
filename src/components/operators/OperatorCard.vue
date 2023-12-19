<template>
  <v-card :color="cardVariant.default ? operator.side.color : null">
    <!-- Portrait -->
    <v-img
      v-if="!cardVariant.default"
      :aspect-ratio="3 / 5"
      cover
      v-bind="imageProperties"
    >
      <template v-if="!cardVariant.placeholder">
        <!-- Emblem -->
        <operator-emblem
          class="mb-1"
          :image="operator.emblem"
          size="70"
        />

        <v-card-item class="operator-name">
          <!-- Name -->
          <v-card-title
            class="font-weight-bold text-center text-uppercase"
            :class="`text-${operator.side.color}`"
          >
            {{ operator.name }}
          </v-card-title>

          <!-- Player Name -->
          <v-card-subtitle v-if="playerName">{{ playerName }}</v-card-subtitle>
        </v-card-item>
      </template>

      <!-- Randomize Icon -->
      <v-icon
        v-else
        class="align-center h-100 justify-center randomize-icon w-100"
        icon="mdi-dice-multiple-outline"
        size="70"
      />
    </v-img>

    <v-card-item v-if="cardVariant.default">
      <!-- Emblem -->
      <template v-slot:prepend>
        <operator-emblem :image="operator.emblem" />
      </template>

      <!-- Name -->
      <v-card-title>{{ operator.name }}</v-card-title>
    </v-card-item>

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
          v-for="t, i in TABS"
          :key="t"
          :value="t"
        >
          <v-card-text class="pa-4 pt-3">
            <!-- Details -->
            <template v-if="i === 0">
              <!-- Speed and Health -->
              <field-label class="mb-1">Speed and Health</field-label>
              <v-input
                append-icon="mdi-hospital-box-outline"
                hide-details
                prepend-icon="mdi-speedometer"
              >
                <v-row
                  class="align-center justify-space-around"
                  no-gutters
                >
                  <v-radio
                    v-for="r in 4"
                    :key="r"
                    :color="r <= operator.speed ? 'green' : 'blue'"
                    density="compact"
                    inline
                    :model-value="true"
                    readonly
                    :ripple="false"
                  />
                </v-row>
              </v-input>

              <!-- Roles -->
              <field-label class="mb-1 mt-3">Roles</field-label>
              <label-row>
                <v-chip
                  v-for="r in operator.roles"
                  :key="r.key"
                  size="small"
                  :text="r.name"
                />
              </label-row>

              <!-- Squad -->
              <v-row
                v-if="operator.squad"
                class="align-center mt-3"
                no-gutters
              >
                <v-col class="pa-0">
                  <field-label>Squad</field-label>
                  <span class="text-body-2">{{ operator.squad.name }}</span>
                </v-col>

                <v-col cols="auto">
                  <v-avatar
                    :image="operator.squad.emblem"
                    rounded="0"
                    size="small"
                  />
                </v-col>
              </v-row>
            </template>

            <!-- Loadout -->
            <template v-if="i === 1">
              <!-- Primary Weapons -->
              <field-label class="mb-1">Primary Weapons</field-label>
              <label-row>
                <v-chip
                  v-for="p in operator.loadout.primaryWeapons"
                  :key="p.key"
                  size="small"
                  :text="p.name"
                />
              </label-row>

              <!-- Secondary Weapons -->
              <field-label class="mb-1 mt-3">Secondary Weapons</field-label>
              <label-row>
                <v-chip
                  v-for="s in operator.loadout.secondaryWeapons"
                  :key="s.key"
                  size="small"
                  :text="s.name"
                />
              </label-row>

              <!-- Gadgets -->
              <field-label class="mb-1 mt-3">Gadgets</field-label>
              <label-row>
                <v-chip
                  v-for="g in operator.loadout.gadgets"
                  :key="g.key"
                  size="small"
                  :text="g.name"
                />
              </label-row>
            </template>
          </v-card-text>
        </v-window-item>
      </v-window>
    </template>
  </v-card>
</template>

<script setup>
import { computed, readonly, ref } from 'vue';

import { Map, Operator } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The ID of the operator to show in the card. */
  operatorKey: {
    type: String,
    validator: (v) => Operator.KEYS.includes(v)
  },

  /** The variant of the card to display. */
  variant: {
    default: 'default',
    type: String,
    validator: (v) => ['default', 'detailed', 'prominent', 'placeholder'].includes(v)
  },

  /** An optional player name to display along with the operator name. */
  playerName: String
});

/** The tab names on the detailed operator card. */
const TABS = readonly(['Details', 'Loadout']);

/** Which tab of the operator details to show. */
const tab = ref(TABS[0]);

/**
 * The operator to display on the card.
 * 
 * A random operator will be drawn for placeholder cards.
 * 
 * @type {import('vue').ComputedRef<Operator>}
 */
const operator = computed(() => {
  if (cardVariant.value.placeholder) return Operator.pickRandom();
  return Operator.valueOf(props.operatorKey);
});

/**
 * Maps the card variant into an object for easier access.
 * @type {import('vue').ComputedRef<{ [variant: String]: Boolean }>}
 */
const cardVariant = computed(() => ({ [props.variant]: true }));

/** Builds the properties for the portrait image. */
const imageProperties = computed(() => {
  // Return placeholder portrait properties
  if (cardVariant.value.placeholder) return { src: operator.value.portrait };

  // Return normal portrait properties
  return {
    class: 'align-end portrait text-center',
    src: operator.value.easterEggPortrait,
    style: { backgroundImage: `url(${Map.pickRandom().thumbnail})` }
  }
});
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

.randomize-icon {
  backdrop-filter: brightness(30%) grayscale(100%);
  -webkit-backdrop-filter: brightness(30%) grayscale(100%);
}
</style>
