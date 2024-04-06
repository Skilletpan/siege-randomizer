<template>
  <v-navigation-drawer
    v-bind="$attrs"
    location="right"
    order="1"
    temporary
    width="350"
  >
    <v-list>
      <!-- Picker Settings -->
      <v-list-subheader title="Picker Settings" />

      <!-- Match Settings Toggle -->
      <v-list-item
        title="Use Match Settings"
        @click="enableMatchSettings = !enableMatchSettings"
      >
        <template #prepend>
          <v-list-item-action start>
            <v-switch
              v-model="enableMatchSettings"
              density="comfortable"
            />
          </v-list-item-action>
        </template>
      </v-list-item>

      <!-- Randomizer Settings -->
      <v-list-subheader>Randomizer Settings</v-list-subheader>

      <!-- Pick Amount Picker -->
      <filter-drawer-item
        :disabled="playerList.length > 0"
        label="Pick Amount"
        reason="Set by Match Settings"
      >
        <template #default="{ disabled }">
          <v-row
            class="border rounded"
            no-gutters
          >
            <template
              v-for="i in 5"
              :key="i"
            >
              <v-col class="pa-0">
                <!-- Amount Button -->
                <v-btn
                  block
                  :color="settings.pickAmount === i ? 'primary' : 'grey-lighten-1'"
                  :disabled="disabled"
                  rounded="0"
                  size="large"
                  :text="String(i)"
                  :variant="settings.pickAmount === i ? 'tonal' : 'text'"
                  @click="localSettings.pickAmount = i;"
                />
              </v-col>

              <!-- Divider -->
              <v-divider
                v-if="i < 5"
                vertical
              />
            </template>
          </v-row>
        </template>
      </filter-drawer-item>

      <!-- Duplicate Operators Toggle -->
      <filter-drawer-item
        :disabled="!!playlist"
        label="Pick Duplicates"
        reason="Set by Match Settings"
      >
        <template #default="{ disabled }">
          <v-checkbox-btn
            v-model="localSettings.pickDuplicates"
            :disabled="disabled"
            label="Allow duplicate operator picks?"
          />
        </template>
      </filter-drawer-item>

      <v-divider class="my-1" />

      <!-- Operator Filters -->
      <v-list-subheader>Operator Filters</v-list-subheader>

      <!-- Speed & Health -->
      <v-list-item class="mb-1">
        <v-label
          class="d-block mb-1 mt-n1 text-caption"
          text="Speed & Health"
        />
        <v-row
          class="border rounded"
          no-gutters
        >
          <template
            v-for="{ color, icon, value } in SPEED_PICKS"
            :key="value"
          >
            <v-col class="pa-0">
              <v-btn
                block
                :color="filters.speed.includes(value) ? color : 'grey-lighten-1'"
                rounded="0"
                size="large"
                :variant="filters.speed.includes(value) ? 'tonal' : 'text'"
                @click="pickSpeed(value)"
              >
                {{ value }}
                <v-icon
                  class="mx-2"
                  :icon="icon"
                  size="small"
                />
                {{ 4 - value }}
              </v-btn>
            </v-col>

            <v-divider
              v-if="value < 3"
              vertical
            />
          </template>
        </v-row>
      </v-list-item>

      <!-- Roles -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.roles"
          :items="Role.LIST"
          label="Roles"
          multiple
          :readonly="filters.roles.length >= 2"
        />
      </v-list-item>

      <!-- Squad -->
      <v-list-item class="mb-1">
        <squad-picker v-model="filters.squad" />
      </v-list-item>

      <v-list-subheader class="mt-2">Loadout</v-list-subheader>

      <!-- Primary Weapons -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.primaries"
          :items="Weapon.LIST.filter((w) => w.isPrimary)"
          label="Primary Weapons"
          multiple
        />
      </v-list-item>

      <!-- Secondary Weapons -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.secondaries"
          :items="Weapon.LIST.filter((w) => w.isSecondary)"
          label="Secondary Weapons"
          multiple
        />
      </v-list-item>

      <!-- Gadgets -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.gadgets"
          :items="Gadget.LIST"
          label="Gadgets"
          multiple
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';

import { FilterDrawerItem, SquadPicker } from '@/components';
import { Gadget, Operator, Role, Weapon } from '@/models';
import { useMatchSettings } from '@/store';
import { shallowRef } from 'vue';

// The values for the speed picker
const SPEED_PICKS = Object.freeze([
  { color: 'blue', icon: '$operator-health', value: 1 },
  { color: 'yellow', icon: 'mdi-scale-balance', value: 2 },
  { color: 'green', icon: '$operator-speed', value: 3 }
]);

// Extract refs from MatchSettings
const { playlist, playerList } = storeToRefs(useMatchSettings());

// eslint-disable-next-line
const emit = defineEmits([
  'update:operators',
  'update:settings'
]);

const enableMatchSettings = shallowRef(true);

/** The setting values. */
const localSettings = ref({
  pickAmount: 5,
  pickDuplicates: false
});

const settings = computed(() => {
  const { pickAmount, pickDuplicates } = localSettings.value;

  return {
    pickAmount: playerList.value.length || pickAmount,
    pickDuplicates: playlist.value ? playlist.value.features.duplicateOperators : pickDuplicates
  }
});

/** The filter values. */
const filters = ref({
  // Operator filters
  speed: [],
  roles: [],
  squad: null,

  // Loadout filters
  primaries: [],
  secondaries: [],
  gadgets: []
});

/**
 * Adds or removes the picked speed value from the filters.
 * 
 * @param {number} speedValue The speed value to toggle.
 */
function pickSpeed(speedValue) {
  const index = filters.value.speed.indexOf(speedValue);

  if (index === -1) filters.value.speed.push(speedValue);
  else filters.value.speed.splice(index, 1);
}

// Emit settings and filter updates
watchEffect(() => { emit('update:settings', settings.value); });

// Build and emit operator pool
watchEffect(() => {
  // Extract filter values
  const { speed, roles, squad, primaries, secondaries, gadgets } = filters.value;

  const operatorFilters = {};

  if (speed.length) operatorFilters.speed = Array.from(speed);
  if (roles.length) operatorFilters.role = Array.from(roles);
  if (squad) operatorFilters.squad = squad;

  if (primaries.length || secondaries.length || gadgets.length) {
    const loadoutFilter = { method: 'every' };

    if (primaries.length) loadoutFilter.primary = Array.from(primaries);
    if (secondaries.length) loadoutFilter.secondary = Array.from(secondaries);
    if (gadgets.length) loadoutFilter.gadgets = Array.from(gadgets);

    operatorFilters.loadoutFilters = [loadoutFilter];
  }

  emit('update:operators', Operator.getOperators(operatorFilters));
});
</script>
