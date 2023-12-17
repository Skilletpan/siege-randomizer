<template>
  <!-- Playlist Picker -->
  <v-select
    v-bind="$attrs"
    clearable
    density="comfortable"
    hide-details
    :items="items"
    item-title="name"
    item-value="key"
    label="Playlist"
    persistent-placeholder
    placeholder="Select..."
    variant="solo-filled"
  >
    <!-- Slot Passhtrough -->
    <template
      v-for="(_, name) in $slots"
      v-slot:[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>

    <template
      v-slot:item="{ index: i, props: p }"
      v-if="!props.classicOnly && !props.arcadeOnly"
    >
      <!-- Classic Playlist Subheader -->
      <v-list-subheader v-if="i === 0">Classic Playlists</v-list-subheader>

      <!-- Arcade Playlist Subheader -->
      <template v-if="!items[i - 1]?.isArcade && items[i].isArcade">
        <v-divider class="my-2" />
        <v-list-subheader>Arcade Playlists</v-list-subheader>
      </template>

      <!-- Practice Playlist Subheader -->
      <template v-if="!items[i - 1]?.isPractice && items[i].isPractice">
        <v-divider class="my-2" />
        <v-list-subheader>Practice Playlists</v-list-subheader>
      </template>

      <!-- Playlist Item -->
      <v-list-item v-bind="p" />
    </template>
  </v-select>
</template>

<script setup>
import { computed } from 'vue';

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
