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
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>

    <!-- Playlist Items -->
    <template
      v-if="!standardOnly && !arcadeOnly && !practiceOnly"
      #item="{ item, index, props: p }"
    >
      <!-- Standard Playlist Subheader -->
      <v-list-subheader v-if="index === 0">Standard Playlists</v-list-subheader>

      <!-- Arcade Playlist Subheader -->
      <template v-if="toRaw(item.raw).isArcade && items[index - 1].isStandard">
        <v-divider class="mt-2" />
        <v-list-subheader>Arcade Playlists</v-list-subheader>
      </template>

      <!-- Practice Playlist Subheader -->
      <template v-if="toRaw(item.raw).isPractice && items[index - 1].isArcade">
        <v-divider class="mt-2" />
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
  /** Whether only standard playlists should be pickable. */
  standardOnly: Boolean,

  /** Whether only arcade playlists should be pickable. */
  arcadeOnly: Boolean,

  /** Whether only practice playlists should be pickable. */
  practiceOnly: Boolean
});

/**
 * The items that can be picked from in the picker.
 * @type {import('vue').ComputedRef<Playlist[]>}
 */
const items = computed(() => {
  if (props.standardOnly) return Playlist.LIST.filter((p) => p.isStandard);
  if (props.arcadeOnly) return Playlist.LIST.filter((p) => p.isArcade);
  if (props.practiceOnly) return Playlist.LIST.filter((p) => p.isPractice);
  return Playlist.LIST;
});
</script>
