<template>
  <v-navigation-drawer location="right">
    <v-list>
      <!-- Presets Selector -->
      <v-list-item>
        <v-select
          v-model="pickedPreset"
          density="comfortable"
          hide-details
          :items="Object.keys(PRESETS)"
          label="Preset"
          variant="solo-filled"
          @update:model-value="loadPreset"
        >
          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              lines="two"
              :subtitle="PRESETS[item.value].modes"
            />
          </template>
        </v-select>
      </v-list-item>

      <v-divider class="mt-2" />

      <!-- Operator Pool Settings -->
      <v-list-subheader title="Operator Pool" />

      <!-- Banned Operators Selector -->
      <v-list-item>
        <v-select
          clearable
          density="comfortable"
          hide-details
          :items="OPERATORS"
          item-title="name"
          item-value="key"
          label="Banned Operators"
          :model-value="bans"
          multiple
          placeholder="0 selected"
          variant="solo-filled"
          @update:model-value="$emit('update:bans', $event)"
        >
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">{{ bans.length }} selected</template>
          </template>
        </v-select>
      </v-list-item>

      <!-- Recruit Switch -->
      <v-list-item>
        <v-switch
          density="comfortable"
          hide-details
          inset
          label="Include Recruits"
          :model-value="recruits"
          @update:model-value="$emit('update:recruits', $event)"
        />
      </v-list-item>

      <v-divider />

      <!-- Speed & Health Checkboxes -->
      <v-list-subheader title="Speed & Health" />
      <v-list-item
        v-for="s in 3"
        :key="s"
        class="pl-3 py-0"
      >
        <v-checkbox
          density="comfortable"
          hide-details
          :label="`${s} Speed | ${4 - s} Health`"
          :model-value="speed"
          :value="s"
          @update:model-value="$emit('update:speed', $event)"
        />
      </v-list-item>

      <v-divider />

      <!-- Role Selectors -->
      <v-list-subheader title="Roles" />
      <v-list-item
        v-for="i in 2"
        :key="i"
      >
        <v-select
          class="mb-2"
          clearable
          density="comfortable"
          hide-details
          :items="ROLES"
          label="Role"
          :model-value="roles[i - 1]"
          variant="solo-filled"
          @update:model-value="$emit('update:roles', i === 1 ? [$event, roles[1]] : [roles[0], $event])"
        />
      </v-list-item>

      <!-- Reset Role Selectors Button -->
      <v-list-item>
        <v-btn
          block
          color="primary"
          text="Reset Roles"
          @click="$emit('update:roles', [null, null])"
        />
      </v-list-item>

      <v-divider class="mt-2" />

      <!-- Additional Settings -->
      <v-list-subheader title="Other" />

      <!-- Squad Selector -->
      <v-list-item>
        <v-select
          clearable
          density="comfortable"
          hide-details
          :items="SQUADS"
          label="Squad"
          :model-value="squad"
          variant="solo-filled"
          @update:model-value="$emit('update:squad', $event)"
        />
      </v-list-item>

      <!-- Reset Button -->
      <v-list-item>
        <v-btn
          block
          class="mt-2"
          color="primary"
          text="Reset Filters"
          @click="resetFilters"
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';

import { OPERATORS, ROLES, SQUADS } from '@/data';

// Define static properties
const DEFAULT_PRESET = {
  bans: [],
  recruits: true,
  roles: [null, null],
  speed: [1, 2, 3],
  squad: null
};

const PRESETS = {
  Competitive: {
    modes: 'Competitive, Ranked',
    recruits: false
  },
  Casual: {
    modes: 'Standard, Quick Match'
  },
  'Arcade 1': {
    duplicates: true,
    modes: 'Weapons Roulette, Golden Gun, Snipers Only'
  },
  'Arcade 2': {
    bans: ['BLITZ', 'CLASH', 'MONTAGNE'],
    duplicates: true,
    modes: 'Free for All, Deathmatch'
  }
}

// Define input properties
defineProps({
  bans: {
    default: () => [],
    type: Array
  },

  recruits: {
    default: true,
    type: Boolean
  },

  roles: {
    default: () => [null, null],
    type: Array
  },

  speed: {
    default: () => [1, 2, 3],
    type: Array
  },

  squad: {
    default: null,
    type: String
  }
});

// Define dynamic properties
const pickedPreset = ref(null);

// Define emits
const emit = defineEmits([
  'update:bans',
  'update:recruits',
  'update:roles',
  'update:speed',
  'update:squad'
]);

/**
 * Loads preset filter settings.
 */
function loadPreset() {
  const { bans, recruits } = PRESETS[pickedPreset.value];

  // Emit setting changes
  emit('update:bans', bans || DEFAULT_PRESET.bans);
  emit('update:recruits', recruits !== DEFAULT_PRESET.recruits ? recruits : DEFAULT_PRESET.recruits);
  emit('update:roles', DEFAULT_PRESET.roles);
  emit('update:speed', DEFAULT_PRESET.speed);
  emit('update:squad', DEFAULT_PRESET.squad);
}

/**
 * Resets all filters to default values.
 */
function resetFilters() {
  pickedPreset.value = null;

  // Emit setting changes
  emit('update:bans', DEFAULT_PRESET.bans);
  emit('update:recruits', DEFAULT_PRESET.recruits);
  emit('update:roles', DEFAULT_PRESET.roles);
  emit('update:speed', DEFAULT_PRESET.speed);
  emit('update:squad', DEFAULT_PRESET.squad);
}
</script>
