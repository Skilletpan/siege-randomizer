<template>
  <!-- Playlist Picker -->
  <v-select
    v-bind="$attrs"
    :items="pickerItems"
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

    <!-- Playlist Items -->
    <template
      v-if="!standardOnly && !arcadeOnly && !practiceOnly"
      #item="{ item, index, props: p }"
    >
      <!-- Playlist Type Subheader -->
      <template v-if="toRaw(item.raw).playlistType !== pickerItems[index - 1]?.playlistType">
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
  /** Whether only arcade playlists should be pickable. */
  arcadeOnly: Boolean,

  /** The items to pick a playlist from. */
  items: {
    default: undefined,
    type: Array,
    validator: (value) => value.every((v) => Playlist.LIST.includes(v))
  },

  /** The label for the picker. */
  label: {
    default: 'Playlist',
    type: String
  },

  /** Whether multiple playlists can be picked. */
  multiple: Boolean,

  /** Whether only practice playlists should be pickable. */
  practiceOnly: Boolean,

  /** Whether only standard playlists should be pickable. */
  standardOnly: Boolean
});

/**
 * The items that can be picked from in the picker.
 * @type {import('vue').ComputedRef<Playlist[]>}
 */
const pickerItems = computed(() => {
  if (props.items) return props.items;

  return Playlist.LIST.filter((p) => {
    if (props.standardOnly && !p.isStandard) return false;
    if (props.arcadeOnly && !p.isArcade) return false;
    if (props.practiceOnly && !p.isPractice) return false;
    return true;
  });
});
</script>
