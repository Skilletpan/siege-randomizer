<template>
  <v-container>
    <v-row class="align-end justify-center py-12">
      <!-- Map Card -->
      <v-col
        cols="auto"
        offset="3"
      >
        <!-- Picked Map Card -->
        <map-card
          v-if="pickedMapKey"
          big
          :map-key="pickedMapKey"
          @click="showPreview(pickedMapKey)"
        />

        <!-- Placeholder Map Card -->
        <map-card
          v-else
          big
          placeholder
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
          <playlist-picker
            v-model="pickedPlaylistKey"
            placeholder="All Maps"
          />

          <!-- Pick Button -->
          <v-btn
            block
            class="mt-4"
            color="primary"
            :text="pickedMapKey ? 'Repick' : 'Randomize'"
            @click="pickMap"
          />
        </v-card>
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
        cols="auto"
      >
        <map-card
          :map-key="m.key"
          @click="showPreview(m.key)"
        />
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model="preview.show"
    width="auto"
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

import { MapCard, PlaylistPicker } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { Playlist, SiegeMap } from '@/models';

/**
 * The key of the randomly picked map.
 * @type {import('vue').Ref<String>}
 */
const pickedMapKey = ref(null);

/**
 * The key of the picked playlist.
 * @type {import('vue').Ref<String>}
 */
const pickedPlaylistKey = ref(null);

/** The values for the preview dialog to use. */
const preview = ref({
  mapKey: null,
  show: false
});

/**
 * The pool of maps to pick from.
 * @type {import('vue').ComputedRef<SiegeMap[]>}
 */
const mapPool = computed(() => {
  if (pickedPlaylistKey.value) return Playlist[pickedPlaylistKey.value].maps;
  return SiegeMap.LIST;
});

/** Picks a random map from the map pool. */
function pickMap() {
  const pool = mapPool.value.filter((m) => m.key !== pickedMapKey.value);
  pickedMapKey.value = pickRandom(pool)[0].key;
}

/**
 * Shows a preview dialog for a map.
 * 
 * @param {string} mapKey The key of the map to preview.
 */
function showPreview(mapKey) {
  preview.value.mapKey = mapKey;
  preview.value.show = true;
}
</script>
