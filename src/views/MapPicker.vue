<template>
  <v-container>
    <v-row
      class="py-12"
      align="end"
      justify="center"
    >
      <!-- Map Card -->
      <v-col
        cols="auto"
        offset="3"
      >
        <map-card
          big
          :value="pickedMap"
          @click="pickMap"
        />
      </v-col>

      <!-- Filters -->
      <v-col cols="3">
        <v-card
          color="transparent"
          elevation="0"
          max-width="300"
        >
          <!-- Playlist Select -->
          <v-select
            v-model="mapFilters.playlist"
            clearable
            hide-details
            :items="playlistPool"
            label="Playlist"
            variant="solo-filled"
          >
            <template v-slot:item="{ item, props }">
              <!-- Default Playlists Subheader -->
              <v-list-subheader v-if="PLAYLISTS.indexOf(item.title) === 0">Default Playlists</v-list-subheader>

              <!-- Arcade Playlists Subheader -->
              <template v-if="ARCADE_PLAYLISTS.indexOf(item.title) === 0">
                <v-divider class="my-2" />
                <v-list-subheader>Arcade Playlists</v-list-subheader>
              </template>

              <!-- Item -->
              <v-list-item v-bind="props" />
            </template>
          </v-select>

          <!-- Pick Button -->
          <v-btn
            block
            class="mt-4"
            color="primary"
            :text="pickedMap ? 'Repick' : 'Randomize'"
            @click="pickMap"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Map Pool Title -->
    <v-row justify="center">
      <v-col
        cols="auto"
        class="text-center"
        tag="h2"
      >Map Pool</v-col>
    </v-row>

    <!-- Map Pool List -->
    <v-row justify="center">
      <v-col
        v-for="m in mapPool"
        :key="m.key"
        cols="auto"
      >
        <map-card
          :inactive="mapFilters.disabled.includes(m.key)"
          :value="m"
          @click="toggleInactive(m.key)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';

import { MapCard } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { ARCADE_PLAYLISTS, MAPS, PLAYLISTS } from '@/data';

// Define dynamic properties
const pickedMap = ref(undefined);

const mapFilters = ref({
  disabled: [],
  playlist: null
});

// Define computed properties
const mapPool = computed(() => {
  if (!mapFilters.value.playlist) return MAPS;
  return MAPS.filter((m) => [...m.playlists, ...m.arcadePlaylists].includes(mapFilters.value.playlist));
});

const playlistPool = computed(() => [...PLAYLISTS, ...ARCADE_PLAYLISTS]);

/**
 * Clears the map pick and disabled maps.
 */
function clearPicks() {
  mapFilters.value.disabled.length = 0;
  mapFilters.value.playlist = null;
}

/**
 * Picks a random map from the map pool.
 */
function pickMap() {
  const pool = mapPool.value.filter((m) => {
    if (pickedMap.value && m.key === pickedMap.value.key) return false;
    return !mapFilters.value.disabled.includes(m.key);
  });

  [pickedMap.value] = pickRandom(pool);
}

/**
 * Toggles the inactive status of a map.
 * 
 * @param {String} key The key of the map to toggle.
 */
function toggleInactive(key) {
  // Find map index
  const mapIndex = mapFilters.value.disabled.indexOf(key);

  // Add or remove map from list
  if (mapIndex === -1) mapFilters.value.disabled.push(key);
  else mapFilters.value.disabled.splice(mapIndex, 1);
}
</script>
