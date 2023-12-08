<template>
  <v-card
    :color="!props.placeholder && props.colored ? operator.side.color : null"
    variant="elevated"
  >
    <!-- Portrait -->
    <v-img
      v-if="!props.placeholder && props.portrait"
      :alt="`${operator.name} portrait`"
      :aspect-ratio="3 / 5"
      class="align-end portrait text-center"
      cover
      :src="operator.easterEggPortrait"
      :style="{ backgroundImage: `url(${randomMap.thumbnail})` }"
    >
      <!-- Emblem -->
      <v-avatar
        class="mb-2"
        :image="operator.emblem"
        rounded="0"
        size="70"
      />
    </v-img>

    <!-- Placeholder Portrait -->
    <v-img
      v-else-if="props.placeholder"
      alt="Placeholder portrait"
      :aspect-ratio="3 / 5"
      class="placeholder"
      cover
      :src="operator.portrait"
    />

    <v-card-item>
      <!-- Emblem -->
      <template
        v-slot:prepend
        v-if="!props.placeholder && !props.portrait"
      >
        <v-avatar
          :image="operator.emblem"
          rounded="0"
        />
      </template>

      <!-- Name -->
      <v-card-title :class="{ 'font-weight-medium text-center text-uppercase': props.placeholder || props.portrait }">
        {{ props.placeholder ? '?' : operator.name }}
      </v-card-title>
    </v-card-item>

    <!-- Details -->
    <template v-if="props.detailed">
      <!-- Tabs -->
      <v-tabs
        v-model="tab"
        density="comfortable"
        fixed-tabs
        :items="TABS"
      />

      <v-divider />

      <v-window v-model="tab">
        <!-- Details -->
        <v-window-item :value="TABS[0]">
          <v-card-text>
            <!-- Speed and Health -->
            <v-label class="d-block mb-1 text-caption">Speed and Health</v-label>
            <v-radio-group
              append-icon="mdi-hospital-box-outline"
              class="d-flex justify-space-between"
              density="compact"
              hide-details
              inline
              :model-value="[1, 2, 3, 4]"
              multiple
              prepend-icon="mdi-speedometer"
              readonly
            >
              <v-radio
                v-for="i in 4"
                :key="i"
                :color="i <= operator.speed ? 'green' : 'blue'"
                :value="i"
              />
            </v-radio-group>

            <!-- Role -->
            <v-label class="d-block mt-3 text-caption">Roles</v-label>
            <v-chip-group>
              <v-chip
                v-for="role in operator.roles"
                :key="role.id"
                label
                :ripple="false"
                size="small"
                :text="role.name"
              />
            </v-chip-group>

            <!-- Squad -->
            <v-row
              v-if="operator.squad"
              class="align-center mt-3"
              no-gutters
            >
              <!-- Squad Name -->
              <v-col class="pa-0">
                <v-label class="d-block text-caption">Squad</v-label>
                {{ operator.squad.name }}
              </v-col>

              <!-- Squad Emblem -->
              <v-col
                class="pa-0"
                cols="auto"
              >
                <v-avatar
                  :image="operator.squad.emblem"
                  rounded="0"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>

        <!-- Loadout -->
        <v-window-item :value="TABS[1]">
          <v-card-text>
            <!-- Primary Weapons -->
            <v-label class="d-block text-caption">Primary Weapons</v-label>
            <v-chip-group>
              <v-chip
                v-for="weapon in operator.loadout.primaryWeapons"
                :key="weapon.id"
                label
                :ripple="false"
                size="small"
                :text="weapon.name"
              />
            </v-chip-group>

            <!-- Secondary Weapons -->
            <v-label class="d-block mt-3 text-caption">Secondary Weapons</v-label>
            <v-chip-group>
              <v-chip
                v-for="weapon in operator.loadout.secondaryWeapons"
                :key="weapon.id"
                label
                :ripple="false"
                size="small"
                :text="weapon.name"
              />
            </v-chip-group>

            <!-- Gadgets -->
            <v-label class="d-block mt-3 text-caption">Gadgets</v-label>
            <v-chip-group>
              <v-chip
                v-for="gadget in operator.loadout.gadgets"
                :key="gadget.id"
                label
                :ripple="false"
                size="small"
                :text="gadget.name"
              />
            </v-chip-group>
          </v-card-text>
        </v-window-item>
      </v-window>
    </template>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

import { Map, Operator } from '@/models';

const TABS = ['Details', 'Loadout'];

// eslint-disable-next-line
const props = defineProps({
  /** The ID of the operator to show in the card. */
  operatorKey: {
    type: String,
    validator: (v) => Operator.KEYS.includes(v)
  },

  /** Whether to apply the side color of the operator to the card. */
  colored: {
    type: Boolean
  },

  /** Whether to show detailed information about the operator. */
  detailed: {
    type: Boolean
  },

  /** Whether to show the portrait of the operator. */
  portrait: {
    type: Boolean
  },

  /**
   * Whether this is a placeholder card.
   * 
   * Placeholder cards consist of a darkened out portrait and a question mark for the name.
   */
  placeholder: {
    type: Boolean
  }
});

/**
 * Which tab of the operator details to show.
 * @type {import('vue').Ref<'detailed' | 'loadout'>}
 */
const tab = ref(TABS[0]);

/**
 * Fetches the given operator or picks a random one for placeholder cards.
 * @type {import('vue').ComputedRef<Operator>}
 */
const operator = computed(() => {
  if (props.operatorKey) return Operator[props.operatorKey];
  return Operator.pickRandom();
});

/**
 * Picks a random map for the card background.
 * @type {import('vue').ComputedRef<Map>}
 */
const randomMap = computed(() => Map.pickRandom());
</script>

<style scoped>
.placeholder {
  filter: brightness(10%) grayscale(100%);
  -webkit-filter: brightness(10%) grayscale(100%);
}

.portrait {
  background-position: center;
  background-size: cover;
}
</style>
