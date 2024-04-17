<template>
  <!-- Player Name Input -->
  <v-autocomplete
    v-model="input.value"
    v-model:search="input.search"
    clear-on-select
    :hide-no-data="!AppSettings.storePlayerNames"
    :items="inputItems"
    label="Add Player"
    multiple
    no-data-text="No players"
    placeholder="Player name"
    @keyup.enter="addPlayer(input.search)"
    @update:model-value="addPlayer($event[0])"
  >
    <template #item="{ item, props }">
      <!-- Autocomplete List Item -->
      <v-list-item
        v-bind="props"
        prepend-icon="mdi-history"
      >
        <template #append>
          <!-- Item Remove Button -->
          <v-list-item-action end>
            <v-btn
              density="comfortable"
              icon="$delete"
              variant="plain"
              @click.stop="Players.removePlayer(item.value)"
            />
          </v-list-item-action>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useAppSettings, usePlayers } from '@/stores';

// Register composables
const AppSettings = useAppSettings();
const Players = usePlayers();

/**
 * The list to add player names to.
 * @type {import('vue').ModelRef<String[]>}
 */
const players = defineModel({ type: Array, default: [] });

// Component props
const props = defineProps({
  /** The player name items to pick from.  */
  items: Array
});

/**
 * The input values.
 * @type {import('vue').Ref<{ value: string[], search: string }>}
 */
const input = ref({
  value: [],
  search: null
});

/**
 * The player name items to choose from.
 * @type {import('vue').ComputedRef<String[]>}
 */
const inputItems = computed(() => props.items || Players.storedPlayers);

/**
 * Adds a player name to the list.
 * 
 * @param {string} playerName The player name to add.
 */
function addPlayer(playerName) {
  // Only add valid player names
  if (playerName?.length >= 3 && !players.value.includes(playerName)) {
    // Add player names to list and store
    players.value.push(playerName);
    Players.addPlayer(playerName);

    // Reset input values
    input.value.value.length = 0;
    input.value.search = null;
  }
}
</script>
