<template>
  <!-- Squad Picker -->
  <v-select
    v-bind="$attrs"
    v-model="pickedSquad"
    :item-props="transformProps"
    :items="Squad.LIST"
    label="Squad"
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

    <!-- Squad Emblem -->
    <template
      v-if="pickedSquad && !$attrs.multiple"
      #prepend-inner
    >
      <squad-emblem :image="Squad.valueOf(pickedSquad).emblem" />
    </template>

    <!-- Squad Item -->
    <template #item="{ props }">
      <v-list-item v-bind="props">
        <template #prepend>
          <squad-emblem :image="props.prependAvatar" />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import { shallowRef } from 'vue';

import { Squad } from '@/models';

/**
 * The key of the currently picked squad.
 * @type {import('vue').ShallowRef<String>}
 */
const pickedSquad = shallowRef(null);

/**
 * Transforms raw squads to list props.
 * 
 * @param {Squad} squad The squad item to transform.
 */
function transformProps(squad) {
  return {
    prependAvatar: squad.emblem
  }
}
</script>
