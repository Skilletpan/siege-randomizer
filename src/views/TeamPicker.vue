<template>
  <v-container class="py-6 py-sm-8 py-md-10 py-lg-12">
    <v-row justify="center">
      <template v-if="smAndUp">
        <v-col
          v-for="side, index in Side.LIST"
          :key="side.key"
          cols="5"
          lg="4"
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
      </template>

      <v-col
        v-else
        cols="12"
      >
        <!-- Teams Card -->
        <v-card class="pb-1">
          <v-toolbar
            class="mb-1"
            :color="AppSettings.colors[teamTab]"
            density="compact"
            elevation="1"
          >
            <!-- Side Tabs -->
            <v-tabs
              v-model="teamTab"
              fixed-tabs
              grow
            >
              <v-tab
                v-for="side in Side.LIST"
                :key="side.key"
                :text="side.name"
                :value="side.key"
              />
            </v-tabs>

            <v-toolbar-items>
              <!-- Set as Squad Button -->
              <v-btn
                :disabled="teams[Side.LIST.indexOf(Side[teamTab])].length === 0"
                icon="mdi-account-group"
                @click="Players.currentPlayers = Array.from(teams[Side.LIST.indexOf(Side[teamTab])])"
              />
            </v-toolbar-items>
          </v-toolbar>

          <v-window v-model="teamTab">
            <!-- Team Lists -->
            <v-window-item
              v-for="side, index in Side.LIST"
              :key="side.key"
              :value="side.key"
            >
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
            </v-window-item>
          </v-window>
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
      <v-col
        cols="12"
        sm="6"
        md="5"
        lg="4"
      >
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
import { ref, shallowRef } from 'vue';
import { useDisplay } from 'vuetify';

import { PlayerInput } from '@/components';
import { Side } from '@/models';
import { useAppSettings, usePlayers } from '@/stores';

// Register composables
const { smAndUp } = useDisplay();
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

/**
 * The side tab to show.
 * @type {import('vue').ShallowRef<String>}
 */
const teamTab = shallowRef(Side.ATT.key);

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
