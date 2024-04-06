<template>
  <v-navigation-drawer
    location="right"
    width="300"
  >
    <v-list>
      <!-- Picker Settings -->
      <v-list-subheader title="Picker Settings" />

      <!-- Match Settings Toggle -->
      <v-list-item
        title="Use match settings?"
        @click="enableMatchSettings = !enableMatchSettings"
      >
        <template #prepend>
          <v-list-item-action start>
            <v-switch
              v-model="enableMatchSettings"
              density="comfortable"
            />
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="repetitionParameter"
          append-inner-icon="mdi-history"
          :clearable="false"
          label="Repick Buffer"
          min="0"
          type="number"
          @click:append-inner.stop="showHistory = true"
        />
      </v-list-item>

      <v-list-item>
        <v-list
          border
          class="py-0"
          rounded
          variant="flat"
        />
      </v-list-item>

      <v-divider class="my-1" />

      <!-- Map Filters -->
      <v-list-subheader title="Map Filters" />

      <!-- Playlist Picker -->
      <v-list-item>
        <playlist-picker :disabled="enableMatchSettings && !!MatchSettings.playlist" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, shallowRef } from 'vue';

import { PlaylistPicker } from '@/components';
import { SiegeMap } from '@/models';
import { useMatchSettings2 } from '@/store';

const MatchSettings = useMatchSettings2();

/**
 * @type {import('vue').ShallowRef<Boolean>}
 */
const enableMatchSettings = shallowRef(true);

/**
 * @type {import('vue').ShallowRef<Number>}
 */
const repetitionParameter = shallowRef(5);

/**
 * @type {import('vue').Ref<SiegeMap[]>}
 */
const pickHistory = ref([]);

const showHistory = shallowRef(false);

/**
 * Adds a map pick to the pick history.
 * 
 * @param {SiegeMap|string} pickedMap The map (key) to add to the pick history.
 */
function addPick(pickedMap) {
  const _pickedMap = SiegeMap.valueOf(pickedMap);

  pickHistory.value.push(_pickedMap);
  pickHistory.value.length = repetitionParameter.value;
}
</script>
