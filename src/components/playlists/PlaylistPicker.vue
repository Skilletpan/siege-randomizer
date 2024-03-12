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
      <!-- Playlist Type Subheader -->
      <template v-if="toRaw(item.raw).playlistType !== items[index - 1]?.playlistType">
        <v-divider v-if="index > 0" />
        <v-list-subheader>{{ toRaw(item.raw).playlistType }} Playlist</v-list-subheader>
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
const items = computed(() => Playlist.LIST.filter((p) => {
  if (props.standardOnly && !p.isStandard) return false;
  if (props.arcadeOnly && !p.isArcade) return false;
  if (props.practiceOnly && !p.isPractice) return false;
  return true;
}));
</script>
