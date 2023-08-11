<template>
  <v-container>
    <v-row class="py-12" align="end" justify="center">
      <!-- Map Card -->
      <v-col cols="auto" offset="3">
        <map-card big :value="pickedMap" @click="pickMap" />
      </v-col>

      <!-- Filters -->
      <v-col cols="3">
        <v-card color="transparent" elevation="0" max-width="300">
          <v-select v-model="pickedPlaylist" hide-details :items="PLAYLISTS" label="Playlist" variant="solo-filled"
            @update:model-value="clearPicks" />
          <v-btn block class="mt-4" color="primary" :text="pickedMap ? 'Repick' : 'Randomize'" @click="pickMap" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Map Pool Title -->
    <v-row justify="center">
      <v-col cols="auto" class="text-center" tag="h2">Map Pool</v-col>
    </v-row>

    <!-- Map Pool List -->
    <v-row justify="center">
      <v-col v-for="m in mapPool" :key="m.key" cols="auto">
        <map-card :inactive="disabledMaps.includes(m.key)" :value="m" @click="toggleInactive(m.key)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';

import { MapCard } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { MAPS, PLAYLISTS } from '@/data';

// Define computed properties
const mapPool = computed(() => MAPS.filter((m) => m.playlists.includes(pickedPlaylist.value)));

// Define dynamic properties
const pickedPlaylist = ref(PLAYLISTS[0]);
const pickedMap = ref(undefined);
const disabledMaps = ref([]);

/**
 * Clears the map pick and disabled maps.
 */
function clearPicks() {
  pickedMap.value = undefined;
  disabledMaps.value = [];
}

/**
 * Picks a random map from the map pool.
 */
function pickMap() {
  const pool = mapPool.value.filter((m) => {
    if (pickedMap.value && m.key === pickedMap.value.key) return false;
    return !disabledMaps.value.includes(m.key);
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
  const mapIndex = disabledMaps.value.indexOf(key);

  // Add or remove map from list
  if (mapIndex === -1) disabledMaps.value.push(key);
  else disabledMaps.value.splice(mapIndex, 1);
}
</script>
