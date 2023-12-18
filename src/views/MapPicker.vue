<template>
  <v-container>
    <v-row class="align-end justify-center">
      <!-- Map Card -->
      <v-col cols="6">
        <map-card
          v-if="pickedMap"
          big
          :map-key="pickedMap"
          :placeholder="!pickedMap"
          v-on="{ click: pickedMap ? () => { showPreview(pickedMap); } : null }"
        />
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col cols="auto">
        <v-btn
          color="primary"
          icon="mdi-dice-multiple-outline"
          size="x-large"
          @click="pickMap"
        />
      </v-col>
    </v-row>

    <!-- Map Pool -->
    <v-row justify="center">
      <!-- Title -->
      <v-col
        class="text-center"
        cols="12"
        tag="h2"
      >
        Map Pool
      </v-col>

      <!-- Map Cards -->
      <v-col
        v-for="m in mapPool"
        :key="m.key"
        cols="3"
      >
        <map-card
          :inactive="mapFilters.disabled.includes(m.key)"
          :map-key="m.key"
          @click="showPreview(m.key)"
        />
      </v-col>
    </v-row>
  </v-container>

  <v-navigation-drawer
    location="right"
    width="350"
  >
    <match-settings />
  </v-navigation-drawer>

  <v-dialog
    v-model="preview.show"
    width="700"
  >
    <map-card
      big
      detailed
      :map-key="preview.mapKey"
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

import { MapCard, MatchSettings } from '@/components';
import { Map, Playlist } from '@/models';

// Define dynamic properties
const pickedMap = ref(null);

const mapFilters = ref({
  disabled: [],
  playlist: null
});

const preview = ref({
  mapKey: null,
  show: false
});

// Define computed properties
const mapPool = computed(() => {
  if (mapFilters.value.playlist) return Playlist.valueOf(mapFilters.value.playlist).maps;
  return Map.LIST;
});

/**
 * Picks a random map from the map pool.
 */
function pickMap() {
  const previous = pickedMap.value ? Map.valueOf(pickedMap.value) : null;
  pickedMap.value = Map.pickRandom(mapPool.value, previous)?.key || null;
}

function showPreview(mapKey) {
  preview.value.mapKey = mapKey;
  preview.value.show = true;
}
</script>
