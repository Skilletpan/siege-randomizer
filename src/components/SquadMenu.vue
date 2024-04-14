<template>
  <v-menu
    activator="parent"
    :close-on-content-click="false"
    location="bottom right"
    width="300"
  >
    <v-list>
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
          :items="Players.recentPlayers"
          label="Add Player"
          multiple
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
                    @click.stop="Players.removeRecentPlayer(item.value)"
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
import { ref } from 'vue';

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
 * Adds a player name to the `currentPlayers` list.
 * 
 * @param {string} playerName The player name to add.
 */
function addPlayer(playerName) {
  if (playerName && playerName.length >= 3 && !Players.currentPlayers.includes(playerName)) {
    Players.addPlayer(playerName);

    playerInput.value.value.length = 0;
    playerInput.value.search = null;
  }
}
</script>
