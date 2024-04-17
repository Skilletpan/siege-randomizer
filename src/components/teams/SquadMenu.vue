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
                  variant="plain"
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
        <player-input v-model="Players.currentPlayers" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { PlayerInput } from '@/components';
import { usePlayers } from '@/stores';

// Register composables
const Players = usePlayers();
</script>
