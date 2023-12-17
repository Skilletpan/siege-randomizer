<template>
  <v-list v-bind="$attrs">
    <v-list-subheader>Players</v-list-subheader>

    <!-- Player Input -->
    <v-list-item class="mb-1">
      <v-combobox
        ref="input"
        v-model="PlayerSettings.playerList"
        density="comfortable"
        :disabled="PlayerSettings.playerList.length >= 5"
        :hide-details="!$refs.input?.search?.length"
        hide-selected
        hint="Press ENTER to add"
        :items="PlayerSettings.recentPlayers"
        label="Add Player"
        multiple
        persistent-placeholder
        placeholder="Enter player name..."
        variant="solo-filled"
        @update:focused="$refs.input.search = null"
      >
        <!-- Selection Text -->
        <template v-slot:selection="{ index }">
          <template v-if="index === 0">
            {{ PlayerSettings.playerList.length }} selected
          </template>
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

    <!-- Player List -->
    <v-list-item v-if="PlayerSettings.playerList.length">
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
                @click="PlayerSettings.removePlayer(index)"
              />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { useAppSettings, usePlayerSettings } from '@/store';

const AppSettings = useAppSettings();
const PlayerSettings = usePlayerSettings();

// Update player lists in local storage and session storage
PlayerSettings.$subscribe(
  (_, state) => {
    sessionStorage.setItem('players', JSON.stringify({ players: state.playerList }));

    if (AppSettings.storeRecentPlayers) {
      localStorage.setItem('players', JSON.stringify({ recentPlayers: state.recentPlayers }));
    }
  }
);
</script>
