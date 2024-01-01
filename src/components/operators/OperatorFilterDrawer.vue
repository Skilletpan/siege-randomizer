<template>
  <v-navigation-drawer
    v-bind="$attrs"
    location="right"
    order="1"
    temporary
    width="350"
  >
    <v-list>
      <!-- Randomizer Settings -->
      <v-list-subheader>Randomizer Settings</v-list-subheader>

      <!-- Pick Amount Picker -->
      <field-label class="ml-4 mt-1">Pick Amount</field-label>
      <v-list-item class="mb-3">
        <v-btn-toggle
          v-model="settings.pickAmount"
          border
          color="primary"
          :disabled="playerList.length > 0"
          divided
          mandatory
          variant="text"
          v-bind="playerList.length > 0 ? { modelValue: playerList.length } : {}"
          @update:model-value="emit('update:pickAmount', $event)"
        >
          <v-btn
            v-for="i in 5"
            :key="i"
            :icon="`mdi-numeric-${i}`"
            :value="i"
          />
        </v-btn-toggle>

        <!-- Tooltip -->
        <template
          v-if="playerList.length > 0"
          #append
        >
          <v-list-item-action>
            <v-tooltip
              location="left center"
              text="Set by Match Settings"
            >
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  icon="mdi-information-outline"
                />
              </template>
            </v-tooltip>
          </v-list-item-action>
        </template>
      </v-list-item>

      <!-- Duplicate Operators Toggle -->
      <field-label class="ml-4">Duplicate Operators</field-label>
      <v-list-item class="mb-1">
        <template #prepend>
          <v-list-item-action start>
            <v-checkbox-btn
              v-model="settings.pickDuplicates"
              density="comfortable"
              :disabled="!!playlist"
              v-bind="playlist ? { modelValue: playlist.features.duplicateOperators } : {}"
              @update:model-value="emit('update:pickDuplicates', $event)"
            />
          </v-list-item-action>
        </template>

        Allow duplicate operator picks?

        <!-- Tooltip -->
        <template
          v-if="!!playlist"
          #append
        >
          <v-list-item-action>
            <v-tooltip
              location="left center"
              text="Set by Match Settings"
            >
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  icon="mdi-information-outline"
                />
              </template>
            </v-tooltip>
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-divider class="my-1" />

      <!-- Operator Filters -->
      <v-list-subheader>Operator Filters</v-list-subheader>

      <!-- Speed & Health -->
      <field-label class="ml-4 mt-1">Speed & Health</field-label>
      <v-list-item class="mb-1" />

      <!-- Roles -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.roles"
          :items="Role.LIST"
          label="Roles"
          multiple
          :readonly="filters.roles.length >= 2"
          @update:model-value="emit('update:roles', $event)"
        />
      </v-list-item>

      <!-- Squad -->
      <v-list-item class="mb-1">
        <squad-picker
          v-model="filters.squad"
          @update:model-value="emit('update:squad', $event)"
        />
      </v-list-item>

      <v-list-subheader class="mt-2">Loadout</v-list-subheader>

      <!-- Primary Weapons -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.primary"
          :items="Weapon.LIST.filter((w) => w.isPrimary)"
          label="Primary Weapons"
          multiple
          @update:model-value="emit('update:primary', $event)"
        />
      </v-list-item>

      <!-- Secondary Weapons -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.secondary"
          :items="Weapon.LIST.filter((w) => w.isSecondary)"
          label="Secondary Weapons"
          multiple
          @update:model-value="emit('update:secondary', $event)"
        />
      </v-list-item>

      <!-- Gadgets -->
      <v-list-item class="mb-1">
        <v-select
          v-model="filters.gadgets"
          :items="Gadget.LIST"
          label="Gadgets"
          multiple
          @update:model-value="emit('update:gadgets', $event)"
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { SquadPicker } from '@/components';
import { Gadget, Role, Weapon } from '@/models';
import { useMatchSettings } from '@/store';

// Extract refs from MatchSettings
const { playlist, playerList } = storeToRefs(useMatchSettings());

// eslint-disable-next-line
const emit = defineEmits([
  // Randomizer settings
  'update:pickAmount',
  'update:pickDuplicates',

  // Operator filters
  'update:speed',
  'update:roles',
  'update:squad',

  // Loadout filters
  'update:primary',
  'update:secondary',
  'update:gadgets'
]);

/** The setting values. */
const settings = ref({
  pickAmount: 5,
  pickDuplicates: false
});

/** The filter values. */
const filters = ref({
  // Operator filters
  speed: [],
  roles: [],
  squad: null,

  // Loadout filters
  primary: [],
  secondary: [],
  gadgets: []
});
</script>
