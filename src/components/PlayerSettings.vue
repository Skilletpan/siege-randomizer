<template>
  <v-list v-bind="$attrs">
    <v-list-subheader>Players</v-list-subheader>

    <!-- Player Input -->
    <v-list-item class="mb-1">
      <v-combobox
        ref="input"
        v-model="PlayerSettings.playerList"
        counter="5"
        density="comfortable"
        :disabled="PlayerSettings.playerList.length >= 5"
        hide-selected
        :hint="$refs.input?.search.length ? 'Press ENTER to add' : null"
        :items="PlayerSettings.recentPlayers"
        label="Add Player"
        multiple
        persistent-counter
        persistent-placeholder
        placeholder="Enter player name..."
        variant="solo-filled"
        @update:focused="$refs.input.search = null"
      >
        <!-- Selection Text -->
        <template v-slot:selection="{ index }">
          <template v-if="index === 0">{{ selectionText }}</template>
        </template>

        <!-- Recent Player Item -->
        <template v-slot:item="{ item, props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-history"
          >
            <template v-slot:append>
              <v-card-actions end>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click.stop="PlayerSettings.removeRecentPlayer(item.value)"
                />
              </v-card-actions>
            </template>
          </v-list-item>
        </template>
      </v-combobox>
    </v-list-item>

    <template v-if="PlayerSettings.playerList.length">
      <!-- Player List -->
      <v-list-item class="mb-1">
        <v-label class="d-block mb-1 text-caption">Player List</v-label>
        <v-list
          border
          class="py-0"
          rounded
          variant="plain"
        >
          <!-- Player Item -->
          <v-list-item
            v-for="player, index in PlayerSettings.playerList"
            :key="index"
            :title="player"
          >
            <!-- Remove Player Button -->
            <template v-slot:append>
              <v-list-item-action end>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  variant="text"
                  @click="PlayerSettings.removePlayer(index, AppSettings.storeRecentPlayers)"
                />
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-list-item>

      <!-- Clear List Button -->
      <v-list-item class="mb-1">
        <v-btn
          block
          color="primary"
          text="Clear List"
          @click="PlayerSettings.playerList.length = 0"
        />
      </v-list-item>
    </template>
  </v-list>
</template>

<script setup>
import { computed } from 'vue';

import { useAppSettings, usePlayerSettings } from '@/store';

// Include settings
const AppSettings = useAppSettings();
const PlayerSettings = usePlayerSettings();

// Update player settings in local storage and session storage
PlayerSettings.$subscribe(() => {
  PlayerSettings.storeSettings(AppSettings.storeRecentPlayers);
});

/**
 * Builds the selection text for the player name input.
 * @type {import('vue').ComputedRef<String>}
 */
const selectionText = computed(() => [
  PlayerSettings.playerList.length,
  PlayerSettings.playerList.length === 1 ? 'player' : 'players'
].join(' '));
</script>
