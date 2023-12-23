<template>
  <v-container>
    <!-- Picked Map -->
    <v-row class="justify-center">
      <v-col cols="6">
        <map-card
          :map-key="toRaw(pickedMap)?.key"
          :variant="pickedMap ? 'prominent' : 'placeholder'"
          @click="onCardClick"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
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
    <v-card class="mt-12">
      <!-- Title -->
      <v-toolbar
        class="pr-4 text-center"
        color="primary"
        title="Map Pool"
      />

      <!-- Map Cards -->
      <v-card-text class="d-flex flex-wrap no-gutters">
        <v-col
          v-for="map in pickableMaps"
          :key="map.key"
          cols="3"
        >
          <map-card
            :map-key="map.key"
            @click="showPreview(map.key)"
          />
        </v-col>
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Preview Dialog -->
  <v-dialog
    v-model="preview.show"
    width="700"
  >
    <map-card
      :map-key="preview.mapKey"
      variant="detailed"
    />
  </v-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';

import { MapCard } from '@/components';
import { Map } from '@/models';
import { useMatchSettings } from '@/store';

// Extract refs from MatchSettings
const { pickableMaps } = storeToRefs(useMatchSettings());

/**
 * The map that was picked by the randomizer.
 * @type {import('vue').Ref<Map>}
 */
const pickedMap = ref(null);

/**
 * The data for the preview dialog.
 * @type {import('vue').Ref<{ mapKey: String, show: Boolean }>}
 */
const preview = ref({
  mapKey: null,
  show: false
});

/** Handles clicks on the picked map card. */
function onCardClick() {
  if (pickedMap.value) showPreview(toRaw(pickedMap.value).key);
  else pickMap();
}

/** Picks a random map from the map pool. */
function pickMap() {
  pickedMap.value = Map.pickRandom(pickableMaps.value, toRaw(pickedMap.value)) || null;
}

/**
 * Shows a preview dialog for the provided map.
 * 
 * @prop {string} mapKey The key of the map to preview.
 */
function showPreview(mapKey) {
  preview.value.mapKey = mapKey;
  preview.value.show = true;
}
</script>
