<template>
  <v-container class="py-6 py-sm-8 py-md-10 py-lg-12">
    <v-row justify="center">
      <v-col
        v-for="side, index in Side.LIST"
        :key="side.key"
        cols="3"
        :order="index"
      >
        <!-- Team Cards -->
        <v-card class="pb-1">
          <v-toolbar
            class="mb-1"
            :color="AppSettings.colors[side.key]"
            density="compact"
            elevation="1"
            :title="side.name"
          >
            <v-toolbar-items class="pr-1">
              <!-- Set as Squad Button -->
              <v-btn
                :disabled="teams[index].length === 0"
                icon
                @click="Players.currentPlayers = Array.from(teams[index])"
              >
                <v-icon icon="mdi-account-group" />

                <v-tooltip
                  activator="parent"
                  location="left"
                  text="Set as Current Squad"
                />
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <!-- Player Item -->
          <v-card-item
            v-for="playerName, index2 in teams[index]"
            :key="playerName"
            :append-icon="index2 === 0 ? 'mdi-crown' : null"
          >
            {{ playerName }}
          </v-card-item>

          <!-- Empty Slot Item -->
          <v-card-item
            v-for="index in (5 - teams[index].length)"
            :key="index"
            class="font-italic text-grey"
          >
            Empty
          </v-card-item>
        </v-card>
      </v-col>

      <v-col
        align-self="center"
        cols="auto"
      >
        <!-- Randomize Teams Button -->
        <v-btn
          color="primary"
          :disabled="playerNames.length < 2"
          icon="$randomize"
          size="x-large"
          @click="randomizeTeams"
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="4">
        <!-- Player Names Input -->
        <player-input
          v-model="playerNames"
          class="mb-4"
        />

        <!-- Player Name List -->
        <v-row class="ma-n1">
          <v-chip
            v-for="playerName, index in playerNames"
            :key="playerName"
            class="ma-1"
            closable
            label
            :text="playerName"
            @click:close="playerNames.splice(index, 1)"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

import { PlayerInput } from '@/components';
import { Side } from '@/models';
import { useAppSettings, usePlayers } from '@/stores';

// Register composables
const AppSettings = useAppSettings();
const Players = usePlayers();

/**
 * The currently entered player names.
 * @type {import('vue').Ref<String[]>}
 */
const playerNames = ref([]);

/**
 * The randomly picked teams.
 * @type {import('vue').Ref<String[][]>}
 */
const teams = ref([[], []]);

/** Builds two teams from the entered player names. */
function randomizeTeams() {
  // Reset teams
  teams.value[0].length = 0;
  teams.value[1].length = 0;

  // Randomize teams
  const _players = Array.from(playerNames.value);
  for (let counter = 0; _players.length > 0 && counter < 10; counter++) {
    const [player] = _players.splice(Math.floor(Math.random() * _players.length), 1);
    teams.value[counter % 2].push(player);
  }
}
</script>
