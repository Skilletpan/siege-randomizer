<template>
  <v-select
    clearable
    :items="items"
    item-title="name"
    item-value="key"
    label="Playlist"
  >
    <template #item="{ index, props: p }">
      <!-- Playlist Category Subheader -->
      <template v-if="subheaders[index]">
        <v-divider v-if="index > 0" />
        <v-list-subheader
          class="mb-n2"
          :title="subheaders[index]"
        />
      </template>

      <!-- Playlist Item -->
      <v-list-item v-bind="p" />
    </template>
  </v-select>
</template>

<script setup>
import { computed } from 'vue';

import { Playlist } from '@/models';

/**
 * The component props.
 * @type {{ readonly items: Playlist[] }}
 */
const props = defineProps({
  items: {
    default: Playlist.LIST,
    type: Array,
    validator: (v) => Array.isArray(v) && v.every((_v) => _v instanceof Playlist)
  }
});

/**
 * The subheaders to display in the selection list and the indexes where to display them.
 * @type {import('vue').ComputedRef<{ [index: number]: string }>}
 */
const subheaders = computed(() => ({
  [props.items.findIndex((playlist) => playlist.isTactical)]: 'Tactical',
  [props.items.findIndex((playlist) => playlist.isQuickplay)]: 'Quickplay',
  [props.items.findIndex((playlist) => playlist.isArcade)]: 'Arcade',
  [props.items.findIndex((playlist) => playlist.isVersusAI)]: 'Versus AI',
  [props.items.findIndex((playlist) => playlist.isTraining && !playlist.isVersusAI)]: 'Training'
}));
</script>
