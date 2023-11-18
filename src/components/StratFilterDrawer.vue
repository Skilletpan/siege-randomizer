<template>
  <v-navigation-drawer
    class="pa-3"
    location="right"
    width="350"
  >
    <!-- Match Settings Section -->
    <v-label class="mb-3 text-caption">Match Settings</v-label>

    <!-- Playlist -->
    <v-select
      v-model="rawSettings.playlist"
      class="mb-3"
      clearable
      density="comfortable"
      hide-details
      :items="playlistItems"
      item-title="name"
      item-value="id"
      label="Playlist"
      persistent-placeholder
      placeholder="None"
      variant="solo-filled"
    />

    <!-- Map (TODO) -->
    <v-select
      v-model="rawSettings.map"
      class="mb-3"
      clearable
      density="comfortable"
      hide-details
      :items="mapItems"
      item-value="id"
      item-title="name"
      label="Map"
      persistent-placeholder
      placeholder="None"
      variant="solo-filled"
    />

    <!-- Banned Operators -->
    <operator-search
      allow-none
      class="mb-2"
      density="comfortable"
      hide-details
      label="Banned Operators"
      :operators="operatorItems"
      persistent-placeholder
      variant="solo-filled"
      @pick="rawSettings.bannedOperators.push($event)"
    />

    <v-list
      class="py-0"
      variant="flat"
    >
      <template
        v-for="(operator, index) in settings.allBannedOperators"
        :key="operator.id"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            v-bind="props"
            :append-icon="isHovering ? 'mdi-delete' : null"
            :disabled="!rawSettings.bannedOperators.includes(operator.id)"
            :prepend-avatar="operator.emblem"
            :subtitle="rawSettings.bannedOperators.includes(operator.id) || 'Banned by Playlist'"
            :title="operator.name"
            @click="rawSettings.bannedOperators.splice(index, 1)"
          />
        </v-hover>
      </template>
    </v-list>

    <v-btn
      v-if="rawSettings.bannedOperators.length"
      block
      class="mt-2"
      color="primary"
      text="Clear Bans"
      @click="rawSettings.bannedOperators.length = 0"
    />

    <v-row
      v-if="false"
      no-gutters
    >
      <template
        v-for="{ key, title } of Side.SIDES"
        :key="key"
      >
        <v-col>
          <v-label
            class="d-block text-caption text-center"
            :text="title"
          />
          <operator-label
            v-for="operatorKey in matchSettings.bannedOperators2[key]"
            :key="operatorKey"
            closable
            negative
            :operator-key="operatorKey"
          />
        </v-col>
      </template>
    </v-row>

    <v-divider class="my-3" />

    <template v-if="false">
      <v-label class="mb-3 text-caption">Repetition</v-label>
      <v-slider
        hint="Test"
        max="15"
        min="0"
        persistent-hint
        step="5"
        show-ticks="always"
      >
        <template v-slot:prepend><v-avatar size="x-small">0</v-avatar></template>
        <template v-slot:append><v-avatar size="x-small">15</v-avatar></template>
      </v-slider>

      <v-divider class="my-3" />
    </template>

    <v-label class="mb-3 text-caption">Tags</v-label>
    <v-select
      v-model="rawSettings.bannedTags"
      clearable
      density="comfortable"
      hide-details
      :items="StrategyTag.LIST"
      item-title="name"
      item-value="id"
      label="Excluded Tags"
      multiple
      persistent-placeholder
      placeholder="0 selected"
      variant="solo-filled"
    >
      <template v-slot:selection="{ index }">
        <template v-if="index === 0">{{ rawSettings.bannedTags.length }} selected</template>
      </template>
    </v-select>

  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorLabel, OperatorSearch } from '.';
import { Playlist, Map, Operator, Side, Strategy, StrategyTag } from '@/models';

/** The raw match settings. */
const rawSettings = ref({
  playlist: null,
  map: null,
  bannedOperators: [],
  bannedTags: []
});

/**
 * @typedef  {Object}        StratFilterSettings
 * @property {?Playlist}     playlist           The selected playlist.
 * @property {?Map}          map                The selected maps.
 * @property {Operator[]}    bannedOperators    The selected banned operators.
 * @property {Operator[]}    allBannedOperators The combined bannede operators from the playlist and manual selection.
 * @property {StrategyTag[]} bannedTags         The selected banned strategy tags.
 */

/**
 * The mapped match settings.
 * @type {import('vue').ComputedRef<StratFilterSettings>}
 */
const settings = computed(() => {
  const { playlist, map, bannedOperators, bannedTags } = rawSettings.value;

  return {
    playlist: Playlist[playlist] || null,
    map: Map[map] || null,
    bannedOperators: bannedOperators.map((o) => Operator[o]),
    allBannedOperators: [].concat(
      Playlist[playlist]?.bannedOperators || [],
      bannedOperators.map((o) => Operator[o])
    ),
    bannedTags: bannedTags.map((t) => StrategyTag[t])
  }
});

/** The playlist items to show in the selector. */
const playlistItems = Playlist.LIST.filter((p) => !p.isArcade);

/**
 * The map items to show in the selector.
 * @type {import('vue').ComputedRef<Map[]>}
 */
const mapItems = computed(() => settings.value.playlist?.maps || Map.LIST);

/**
 * The operator items to show in the selector.
 * @type {import('vue').ComputedRef<Operator[]>}
 */
const operatorItems = computed(() => Operator.LIST.filter((o) => !settings.value.bannedOperators.includes(o)));

const stratPool = computed(() => {
  const { allBannedOperators, bannedTags } = settings.value;

  return Strategy.LIST.filter((s) => {
    // Check if operators from every available side are banned
    const sides = s.side === Side.ALL ? [Side.ATT, Side.DEF] : [s.side];
    const allSidesHaveBan = sides.every(
      (side) => s.getRequiredOperators(side).some((operator) => allBannedOperators.includes(operator))
    );
    if (allSidesHaveBan) return false;

    // Filter by tags
    if (s.tags.some((t) => bannedTags.includes(t))) return false;

    return true;
  });
});

// eslint-disable-next-line
defineExpose({ stratPool });
</script>
