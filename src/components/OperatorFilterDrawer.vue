<template>
  <v-navigation-drawer location="right">
    <v-list lines="one">
      <!-- Disabled Operators Select -->
      <v-list-subheader title="Operator Filters" />
      <v-list-item class="mb-2">
        <v-select
          clearable
          density="comfortable"
          hide-details
          :items="OPERATORS"
          item-title="name"
          item-value="key"
          label="Disabled Operators"
          :model-value="disabledOperators"
          multiple
          placeholder="0 selected"
          variant="solo-filled"
          @update:model-value="$emit('update:disabledOperators', $event)"
        >
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">
              {{ disabledOperators.length }} selected
            </template>
          </template>
        </v-select>
      </v-list-item>

      <v-divider />

      <v-list-subheader title="Pick Count" />

      <!-- Pick Slider -->
      <v-list-item>
        <v-slider
          hide-details
          max="5"
          min="1"
          :model-value="picks"
          show-ticks="always"
          step="1"
          @update:model-value="$emit('update:picks', $event)"
        >
          <template v-slot:prepend>1</template>
          <template v-slot:append>5</template>
        </v-slider>
      </v-list-item>

      <!-- Duplicate Pick Switch -->
      <v-list-item :disabled="picks < 2">
        <v-switch
          density="comfortable"
          hide-details
          inset
          label="Duplicate Picks"
          :model-value="duplicates"
          @update:model-value="$emit('update:duplicates', $event)"
        />
      </v-list-item>

      <v-divider />

      <!-- Side Checkboxes -->
      <v-list-subheader title="Side" />
      <v-list-item
        v-for="f in SIDE_FILTERS"
        :key="f.value"
      >
        <v-checkbox
          density="comfortable"
          hide-details
          :label="f.title"
          :model-value="sides"
          :value="f.value"
          @update:model-value="$emit('update:sides', $event)"
        />
      </v-list-item>

      <v-divider />

      <!-- Speed Checkboxes -->
      <v-list-subheader title="Speed" />
      <v-list-item
        v-for="s in 3"
        :key="s"
      >
        <v-checkbox
          density="comfortable"
          hide-details
          :label="`${s} Speed | ${4 - s} Armor`"
          :model-value="speeds"
          :value="s"
          @update:model-value="$emit('update:speeds', $event)"
        />
      </v-list-item>

      <v-divider />

      <v-list-subheader title="Details" />

      <!-- Roles Select -->
      <v-list-item>
        <v-select
          clearable
          density="comfortable"
          hide-details
          :items="ROLES"
          label="Roles"
          :model-value="roles"
          multiple
          placeholder="0 selected"
          variant="solo-filled"
          @update:model-value="$emit('update:roles', $event)"
        >
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">
              {{ roles.length }} selected
            </template>
          </template>
        </v-select>
      </v-list-item>

      <!-- Squad Select -->
      <v-list-item>
        <v-select
          class="mt-2"
          clearable
          density="comfortable"
          hide-details
          :items="SQUADS"
          label="Squad"
          :model-value="squads"
          multiple
          placeholder="0 selected"
          variant="solo-filled"
          @update:model-value="$emit('update:squads', $event)"
        >
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">
              {{ squads.length }} selected
            </template>
          </template>
        </v-select>
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
import { defineEmits, defineProps } from 'vue';

import { OPERATORS, ROLES, SQUADS } from '@/data';

// Define static properties
const SIDE_FILTERS = [
  { title: 'Attackers', value: 'ATT' },
  { title: 'Defenders', value: 'DEF' },
  { title: 'Recruits', value: 'REC' }
];


// Define input properties
defineProps({
  disabledOperators: {
    type: Array,
    default: () => []
  },

  duplicates: {
    type: Boolean,
    default: false
  },

  picks: {
    type: Number,
    default: 1
  },

  roles: {
    type: Array,
    default: () => []
  },

  sides: {
    type: Array,
    default: () => ['ATT', 'DEF']
  },

  speeds: {
    type: Array,
    default: () => [1, 2, 3]
  },

  squads: {
    type: Array,
    default: () => []
  }
});

// Define emits
const emit = defineEmits([
  'update:disabledOperators',
  'update:duplicates',
  'update:picks',
  'update:roles',
  'update:sides',
  'update:speeds',
  'update:squads'
]);

/**
 * Resets all filters to default values.
 */
function resetFilters() {
  emit('update:disabledOperators', []);
  emit('update:duplicates', false);
  emit('update:picks', 1);
  emit('update:roles', []);
  emit('update:sides', ['ATT', 'DEF']);
  emit('update:speeds', [1, 2, 3]);
  emit('update:squads', []);
}
</script>
