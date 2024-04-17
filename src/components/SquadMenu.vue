<template>
  <v-menu
    activator="parent"
    :close-on-content-click="false"
    location="bottom right"
    width="300"
  >
    <v-list class="rounded-t-0">
      <!-- Current Players List -->
      <v-list-item>
        <v-list class="border-thin py-0 rounded">
          <v-list-subheader
            class="mb-n2 text-caption"
            title="Current Squad"
          />

          <!-- Player List Item -->
          <v-list-item
            v-for="player, index in Players.currentPlayers"
            :key="index"
            :title="player"
          >
            <template #append>
              <v-list-item-action end>
                <v-btn
                  density="comfortable"
                  icon="$delete"
                  variant="flat"
                  @click="Players.currentPlayers.splice(index, 1)"
                />
              </v-list-item-action>
            </template>
          </v-list-item>

          <!-- Placeholder Item -->
          <v-list-item
            v-if="Players.currentPlayers.length === 0"
            class="font-italic"
            disabled
            title="No players"
          />
        </v-list>
      </v-list-item>

      <!-- Player Input -->
      <v-list-item
        v-if="Players.currentPlayers.length < 5"
        class="mt-2"
      >
        <v-autocomplete
          v-model="playerInput.value"
          v-model:search="playerInput.search"
          clear-on-select
          :items="recentPlayers"
          label="Add Player"
          multiple
          no-data-text="No players"
          placeholder="Player Name"
          @keyup.enter="addPlayer(playerInput.search)"
          @update:model-value="addPlayer($event[0])"
        >
          <template #item="{ item, props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-history"
            >
              <template #append>
                <v-list-item-action end>
                  <v-btn
                    density="comfortable"
                    icon="$delete"
                    variant="flat"
                    @click.stop="Players.removePlayer(item.value)"
                  />
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { computed, ref } from 'vue';

import { usePlayers } from '@/stores';

// Register composables
const Players = usePlayers();

/**
 * The current player input values.
 * @type {import('vue').Ref<{ search: string, value: string[] }>}
 */
const playerInput = ref({
  search: null,
  value: []
});

/**
 * The list of stored players with current players filtered out.
 * @type {import('vue').ComputedRef<String[]>}
 */
const recentPlayers = computed(() => Players.storedPlayers.filter((p) => !Players.currentPlayers.includes(p)));

/**
 * Adds a player name to the `currentPlayers` list.
 * 
 * @param {string} playerName The player name to add.
 */
function addPlayer(playerName) {
  if (playerName?.length >= 3 && !Players.currentPlayers.includes(playerName)) {
    // Add player name to list and storage
    Players.currentPlayers.push(playerName);
    Players.addPlayer(playerName);

    // Reset player name input
    playerInput.value.value.length = 0;
    playerInput.value.search = null;
  }
}
</script>
