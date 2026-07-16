<template>
  <v-select
    clearable
    :items="categories ? pickerList : items"
    item-title="name"
    item-value="key"
    label="Playlist"
    :list-props="{ class: 'pt-0' }"
  >
    <!-- Category Subheaders (Picker List) -->
    <template #subheader="{ props: p }">
      <v-list-subheader
        v-bind="p"
        sticky
        :title="p.title[0].toUpperCase() + p.title.slice(1).toLowerCase()"
      />
    </template>
  </v-select>
</template>

<script setup>
import { computed } from 'vue';

import { Playlist } from '@/models';

/**
 * The component props.
 * @type {{ readonly categories: boolean, readonly items: Playlist[] }}
 */
const props = defineProps({
  /** Whether to render playlist category subheaders. */
  categories: {
    default: true,
    type: Boolean
  },

  /** The playlist items to pick from. */
  items: {
    default: Playlist.LIST,
    type: Array,
    validator: (v) => Array.isArray(v) && v.every((_v) => _v instanceof Playlist)
  }
});

/**
 * The items to render in the picker list.
 * @type {(Playlist | { title: string, type: 'subheader' })[]}
 */
const pickerList = computed(() => props.items.flatMap((playlist, index, items) => {
  // Add subheader when playlist category changes
  if (playlist.category !== items[index - 1]?.category) return [
    { title: playlist.category, type: 'subheader' },
    playlist
  ];

  return playlist;
}));
</script>
