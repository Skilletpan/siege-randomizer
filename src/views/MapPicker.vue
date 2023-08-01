<template>
  <v-container>
    <v-row class="py-12" justify="center">
      <v-col cols="auto">
        <map-card big detailed :value="pickedMap" />
        <v-btn block class="mt-4" color="primary" :disabled="mapPool.length < 2" text="Pick Random Map"
          @click="pickMap" />
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center" tag="h2">Map Pool</v-col>
      <v-col cols="2">
        <v-select v-model="pickedPlaylist" density="compact" hide-details :items="PLAYLISTS" variant="solo-filled"
          @update:model-value="pickedMap = mapPool[0].key" />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="m in mapPool" :key="m.key" cols="auto">
        <map-card :value="m.key" @click="pickedMap = m.key" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';

import { MapCard } from '@/components';
import { MAPS, PLAYLISTS } from '@/data';

// Define computed properties
const mapPool = computed(() => MAPS.filter((m) => m.playlists.includes(pickedPlaylist.value)));

// Define dynamic properties
const pickedPlaylist = ref(PLAYLISTS[0]);
const pickedMap = ref(mapPool.value[0].key);

/**
 * Picks a random map from the map pool.
 */
function pickMap() {
  const pool = mapPool.value.filter((m) => m.key !== pickedMap.value);

  // Get a random index from the map pool
  const randomIndex = Math.floor(Math.random() * pool.length);

  // Assign the new map pick
  pickedMap.value = pool[randomIndex].key;
}
</script>
