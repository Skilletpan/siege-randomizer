<template>
  <!-- Playlist Picker -->
  <v-select
    v-bind="$attrs"
    :items="items"
    label="Playlist"
  >
    <!-- Slot Passthrough -->
    <template
      v-for="(_, name) in $slots"
      v-slot:[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>

    <!-- Playlist Items -->
    <template
      v-slot:item="{ item, index, props: p }"
      v-if="!props.classicOnly && !props.arcadeOnly"
    >
      <!-- Classic Playlist Subheader -->
      <v-list-subheader v-if="index === 0">Classic Playlists</v-list-subheader>

      <!-- Arcade Playlist Subheader -->
      <template v-if="toRaw(item.raw).isArcade && !items[index - 1]?.isArcade">
        <v-divider class="mb-1" />
        <v-list-subheader>Arcade Playlists</v-list-subheader>
      </template>

      <!-- Practice Playlist Subheader -->
      <template v-if="toRaw(item.raw).isPractice && !items[index - 1]?.isPractice">
        <v-divider class="mb-1" />
        <v-list-subheader>Practice Playlists</v-list-subheader>
      </template>

      <!-- Playlist Item -->
      <v-list-item v-bind="p" />
    </template>
  </v-select>
</template>

<script setup>
import { computed, toRaw } from 'vue';

import { Playlist } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** Whether only classic playlists should be pickable. */
  classicOnly: {
    default: false,
    type: Boolean
  },

  /** Whether only arcade playlists should be pickable. */
  arcadeOnly: {
    default: false,
    type: Boolean
  },

  /** Whether only practice playlists should be pickable. */
  practiceOnly: {
    default: false,
    type: Boolean
  }
});

/** The items that can be picked from in the picker. */
const items = computed(() => {
  if (props.classicOnly) return Playlist.LIST.filter((p) => p.isStandard);
  if (props.arcadeOnly) return Playlist.LIST.filter((p) => p.isArcade);
  if (props.practiceOnly) return Playlist.LIST.filter((p) => p.isPractice);
  return Playlist.LIST;
});
</script>
