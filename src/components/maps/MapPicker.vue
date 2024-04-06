<template>
  <!-- Map Picker -->
  <v-select
    v-bind="$attrs"
    v-model="pick"
    :items="items"
    :label="label"
    :multiple="multiple"
  >
    <!-- Slot Passthrough -->
    <template
      v-for="(_, name) in $slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </v-select>
</template>

<script setup>
import { SiegeMap } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The items to pick a map from. */
  items: {
    default: SiegeMap.LIST,
    type: Array,
    validator: (value) => value.every((v) => SiegeMap.LIST.includes(v))
  },

  /** The label for the picker. */
  label: {
    default: 'Map',
    type: String
  },

  /** Whether multiple maps can be picked. */
  multiple: Boolean
});

// eslint-disable-next-line
const pick = defineModel({ type: [String, Array] });
</script>
