<template>
  <v-card>
    <!-- Operator Portrait -->
    <v-hover :disabled="!onRepick">
      <template #default="{ isHovering, props: p }">
        <v-img
          alt="Operator portrait"
          :aspect-ratio="detailed ? 1 / 1.35 : 3 / 5"
          cover
          position="100% 0%"
          :src="portrait"
          :style="portraitBackground"
          v-bind="p"
        >
          <div
            v-if="!!operator"
            class="d-flex flex-column h-100"
          >
            <!-- Repick Button -->
            <v-btn
              v-show="isHovering"
              class="align-self-end mr-2 mt-2"
              color="red"
              density="comfortable"
              icon="mdi-refresh"
              @click.stop="$emit('repick')"
            />

            <v-spacer />

            <!-- Operator Emblem -->
            <v-avatar
              class="align-self-center portrait-emblem"
              :image="operator.emblem"
              rounded="0"
            />

            <v-card-item class="portrait-text py-2 text-center">
              <!-- Operator Name -->
              <v-card-title
                class="font-weight-black"
                :style="{ color: AppSettings.colors[operator.side.key] }"
              >
                {{ operator.name }}
              </v-card-title>

              <!-- Player Name -->
              <v-card-subtitle v-if="player">{{ player }}</v-card-subtitle>
            </v-card-item>
          </div>

          <!-- Randomize Icon -->
          <div
            v-else
            class="align-center d-flex flex-column h-100 justify-center portrait-randomize-icon-background"
          >
            <v-icon
              icon="$randomize"
              size="80"
            />
          </div>
        </v-img>
      </template>
    </v-hover>

    <!-- Operator Details -->
    <template v-if="detailed && !!operator">
      <v-divider />

      <!-- Operator Details Tabs -->
      <v-tabs
        v-model="detailTab"
        density="comfortable"
        grow
        :items="DETAIL_TABS"
      >
        <template #item="{ item }">
          <v-divider />

          <v-tabs-window-item :value="item.value">
            <!-- Operator Details -->
            <template v-if="item.value === DETAIL_TABS[0]">
              <!-- Speed and Health -->
              <v-card-item class="pb-3 pt-2 px-4">
                <v-label
                  class="d-block mb-1 text-caption"
                  text="Speed and Health"
                />
                <v-chip
                  v-for="value, index in [operator.speed, operator.health]"
                  :key="index"
                  class="justify-center"
                  :class="[`w-${value * 25}`, ['rounded-e-0', 'rounded-s-0'][index]]"
                  :color="['green-darken-2', 'blue-darken-2'][index]"
                  label
                  variant="flat"
                >
                  <v-icon :icon="['mdi-speedometer', 'mdi-hospital-box-outline'][index]" />
                </v-chip>
              </v-card-item>

              <!-- Roles -->
              <v-card-item class="pb-3 pt-0 px-4">
                <v-label
                  class="d-block mb-1 text-caption"
                  text="Roles"
                />
                <div class="ma-n1">
                  <v-chip
                    v-for="role in operator.roles"
                    :key="role.key"
                    class="ma-1"
                    label
                    size="small"
                    :text="role.name"
                  />
                </div>
              </v-card-item>

              <!-- Squad -->
              <v-card-item
                v-if="operator.squad"
                class="pb-3 pt-0 px-4"
              >
                <v-label
                  class="d-block text-caption"
                  text="Squad"
                />

                {{ operator.squad.name }}

                <template #append>
                  <v-avatar
                    :image="operator.squad.emblem"
                    rounded="0"
                    size="small"
                  />
                </template>
              </v-card-item>
            </template>

            <!-- Operator Loadout -->
            <template v-if="item.value === DETAIL_TABS[1]">
              <!-- Primary / Secondary Weapons -->
              <v-card-item
                v-for="label, index in ['Primary Weapons', 'Secondary Weapons']"
                :key="index"
                class="pb-3 px-4"
                :class="index === 0 ? 'pt-2' : 'pt-0'"
              >
                <v-label
                  class="d-block mb-1 text-caption"
                  :text="label"
                />
                <div class="ma-n1">
                  <v-chip
                    v-for="weapon in operator.loadout[['primaryWeapons', 'secondaryWeapons'][index]]"
                    :key="weapon.key"
                    class="ma-1"
                    label
                    size="small"
                    :text="weapon.name"
                  />
                </div>
              </v-card-item>

              <!-- Primary Gadget -->
              <v-card-item
                v-if="!!operator.ability"
                class="pb-3 pt-0 px-4"
              >
                <v-label
                  class="d-block mb-1 text-caption"
                  text="Primary Gadget"
                />
                <div class="ma-n1">
                  <v-chip
                    class="ma-1"
                    label
                    size="small"
                  >
                    {{ operator.ability.displayName }}

                    <ability-tooltip :ability="operator.ability" />
                  </v-chip>
                </div>
              </v-card-item>

              <!-- Secondary Gadgets -->
              <v-card-item class="pb-3 pt-0 px-4">
                <v-label
                  class="d-block mb-1 text-caption"
                  text="Secondary Gadgets"
                />
                <div class="ma-n1">
                  <v-chip
                    v-for="gadget in operator.loadout.gadgets"
                    :key="gadget.key"
                    class="ma-1"
                    label
                    size="small"
                    :text="gadget.displayName"
                  />
                </div>
              </v-card-item>
            </template>
          </v-tabs-window-item>
        </template>
      </v-tabs>
    </template>
  </v-card>
</template>

<script setup>
import { computed, shallowReadonly, shallowRef } from 'vue';

import { AbilityTooltip } from '@/components';
import { Operator, SiegeMap } from '@/models';
import { useAppSettings } from '@/stores';

// Register composables
const AppSettings = useAppSettings();

/**
 * The operator to display.
 * @type {import('vue').ModelRef<Operator>}
 */
const operator = defineModel({
  get: (operatorKey) => Operator[operatorKey] || null,
  type: String,
  validator: (v) => Object.keys(Operator).includes(v)
});

/**
 * The props of the component.
 * @type {{ readonly detailed: boolean, readonly player: string, readonly onRepick: Function }}
 */
const props = defineProps({
  /** Whether to display the operator details. */
  detailed: { type: Boolean },

  /** The player the operator is assigned to. */
  player: { type: String },

  /** The function to run when the repick button is pressed. */
  onRepick: { type: Function }
});

/**
 * The operator portrait to display.
 * @type {import('vue').ComputedRef<String>}
 */
const portrait = computed(() => {
  // Return picked operator (easter egg) portrait
  if (operator.value) return operator.value.easterEggPortrait();

  // Return random operator portrait as placeholder
  return Operator.random().portrait;
});

/**
 * The style properties for the background image.
 * @type {import('vue').ComputedRef<Object>}
 */
const portraitBackground = computed(() => {
  // Don't bind any styles for placeholder cards
  if (!operator.value) return null;

  // Set a random map thumbnail as portrait background
  return {
    backgroundImage: `url(${SiegeMap.random().thumbnail})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  };
});

/**
 * The available detail tabs.
 * @type {readonly string[]}
 */
const DETAIL_TABS = shallowReadonly(['DETAILS', 'LOADOUT']);

/**
 * The detail tab to display on the card.
 * @type {import('vue').ShallowRef<String>}
 */
const detailTab = shallowRef(DETAIL_TABS[0]);
</script>

<style scoped>
.portrait-emblem {
  height: auto;
  width: 30%;
}

.portrait-text {
  backdrop-filter: brightness(30%) grayscale(50%);
  -webkit-backdrop-filter: brightness(30%) grayscale(50%);
}

.portrait-randomize-icon-background {
  backdrop-filter: brightness(20%) grayscale(90%);
  -webkit-backdrop-filter: brightness(20%) grayscale(90%);
}
</style>
