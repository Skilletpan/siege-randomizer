<template>
  <!-- Squad Picker -->
  <v-select
    v-bind="$attrs"
    v-model="pickedSquad"
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
      <v-avatar
        :image="Squad.valueOf(pickedSquad).emblem"
        rounded="0"
        size="small"
      />
    </template>

    <!-- Squad Item -->
    <template #item="{ item, props }">
      <v-list-item
        v-bind="props"
        :prepend-avatar="toRaw(item.raw).emblem"
      />
    </template>
  </v-select>
</template>

<script setup>
import { shallowRef, toRaw } from 'vue';

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
 * 
 * @todo Check when Vuetify fixed their `prependAvatar` bug.
 * @see https://github.com/vuetifyjs/vuetify/issues/18933
 */
// eslint-disable-next-line
function transformProps(squad) {
  return {
    prependAvatar: squad.emblem
  }
}
</script>
