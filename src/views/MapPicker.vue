<template>
  <v-container>
    <!-- Picked Map -->
    <v-row
      class="justify-center"
      no-gutters
    >
      <v-col cols="6">
        <map-card
          :map-key="pickedMap"
          :variant="pickedMap ? 'prominent' : 'placeholder'"
          @click="onMapClick"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row
      class="justify-center mt-4"
      no-gutters
    >
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
          v-for="map in mapPool"
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
import { computed, ref } from 'vue';

import { MapCard } from '@/components';
import { Map } from '@/models';
import { useMatchSettings } from '@/store';

// Include settings
const MatchSettings = useMatchSettings();

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

/**
 * The map pool to display and pick from.
 * @type {import('vue').ComputedRef<Map[]>}
 */
const mapPool = computed(() => MatchSettings.playlist?.maps || Map.LIST);

/** Handles clicks on the picked map card. */
function onMapClick() {
  if (pickedMap.value) showPreview(pickedMap.value);
  else pickMap();
}

/** Picks a random map from the map pool. */
function pickMap() {
  const previous = Map.valueOf(pickedMap.value);
  pickedMap.value = Map.pickRandom(mapPool.value, previous)?.key || null;
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
