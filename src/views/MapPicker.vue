<template>
  <v-container>
    <v-row class="align-end justify-center py-12">
      <!-- Map Card -->
      <v-col
        cols="auto"
        offset="3"
      >
        <map-card
          big
          :map-key="pickedMap"
          :placeholder="!pickedMap"
          v-on="{ click: pickedMap ? () => { showPreview(pickedMap); } : null }"
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
            :items="Playlist.LIST"
            item-title="name"
            item-value="id"
            label="Playlist"
            persistent-placeholder
            placeholder="All Maps"
            variant="solo-filled"
          >
            <template v-slot:item="{ index, props }">
              <!-- Default Playlists Subheader -->
              <v-list-subheader v-if="index === 0">Default Playlists</v-list-subheader>

              <!-- Arcade Playlists Subheader -->
              <template v-if="index === Playlist.LIST.findIndex((p) => p.isArcade)">
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
          :inactive="mapFilters.disabled.includes(m.key)"
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

import { MapCard } from '@/components';
import { pickRandom } from '@/composables/randomizer';
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
  if (!mapFilters.value.playlist) return Map.LIST;
  return Playlist[mapFilters.value.playlist].maps;
});

/**
 * Picks a random map from the map pool.
 */
function pickMap() {
  const pool = mapPool.value
    .filter((m) => {
      if (m.key === pickedMap.value) return false;
      return !mapFilters.value.disabled.includes(m.key);
    })
    .map((m) => m.key);

  [pickedMap.value] = pickRandom(pool);
}

function showPreview(mapKey) {
  preview.value.mapKey = mapKey;
  preview.value.show = true;
}
</script>
