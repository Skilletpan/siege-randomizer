<template>
  <v-menu
    v-bind="$attrs"
    :close-on-content-click="false"
    location="bottom right"
    transition="slide-y-transition"
    width="300"
  >
    <!-- Dropdown Content -->
    <v-list>
      <v-list-subheader>Current Squad</v-list-subheader>

      <!-- Current Squad List -->
      <v-list-item>
        <v-list
          border
          class="py-0"
          rounded
          variant="flat"
        >
          <!-- Empty Squad Placeholder Item -->
          <v-list-item
            v-if="!SquadSettings.currentSquad.length"
            class="text-center text-grey-lighten-1"
            title="No players added"
          />

          <!-- Player Items -->
          <v-list-item
            v-for="playerName in SquadSettings.currentSquad"
            :key="playerName"
            :title="playerName"
          >
            <!-- Remove Player Button -->
            <template #append>
              <v-btn
                density="comfortable"
                icon="$close"
                variant="plain"
                @click="SquadSettings.removePlayer(playerName)"
              />
            </template>
          </v-list-item>

          <!-- Clear List Button -->
          <v-btn
            v-if="SquadSettings.currentSquad.length > 0"
            block
            class="rounded-t-0"
            color="primary"
            text="Clear"
            variant="text"
            @click="SquadSettings.currentSquad.length = 0"
          />
        </v-list>
      </v-list-item>

      <template v-if="SquadSettings.currentSquad.length < 5">
        <v-divider class="my-2" />

        <!-- Player Input -->
        <v-list-item>
          <!-- Player Input Text Field -->
          <v-text-field
            id="player-input"
            v-model="playerInput"
            hide-details
            label="Add Player"
            placeholder="Type player name..."
            @keyup.enter="addPlayer(playerInput)"
            @update:focused="playerInput = null"
          />

          <!-- Recent Players List -->
          <v-menu
            activator="#player-input"
            :close-on-content-click="false"
            :disabled="recentPlayers.length === 0"
          >
            <v-list>
              <v-list-item
                v-for="playerName in recentPlayers"
                :key="playerName"
                prepend-icon="$player-recent"
                :title="playerName"
                @click.stop="SquadSettings.addPlayer(playerName)"
              >
                <!-- Remove Recent Player Button -->
                <template #append>
                  <v-btn
                    density="comfortable"
                    icon="$delete"
                    variant="plain"
                    @click.stop="SquadSettings.removeRecentPlayer(playerName)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useSquadSettings } from '@/store';

// Squad Settings store
const SquadSettings = useSquadSettings();

/**
 * The player input value.
 * @type {import('vue').Ref<String>}
 */
const playerInput = ref(null);

/**
 * The players to display in the recent players list.
 * @type {import('vue').ComputedRef<String[]>}
 */
const recentPlayers = computed(() => SquadSettings.recentPlayers.filter((player) => {
  return !playerInput.value?.length || player.toLowerCase().includes(playerInput.value.toLowerCase());
}));

/**
 * Adds a player to the list and clears the player input.
 */
function addPlayer() {
  const hasAdded = SquadSettings.addPlayer(playerInput.value);
  if (hasAdded) playerInput.value = null;
}
</script>
