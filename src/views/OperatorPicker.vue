<template>
  <v-container>
    <!-- Operator Cards -->
    <v-row class="justify-center">
      <v-col
        v-for="i in settings.pickerSettings.pickAmount"
        :key="i"
        class="operator-card"
      >
        <operator-card
          colored
          :operator-key="pickedOperators[i - 1]"
          :placeholder="!pickedOperators[i - 1]"
          :player-name="rawSettings.playerSettings.players[i - 1] || `Player ${i}`"
          portrait
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="justify-center">
      <v-col
        v-for="side in Side.LIST"
        :key="side.key"
        cols="auto"
      >
        <v-btn
          :color="side.color"
          :disabled="!operatorPool.length"
          :icon="side.icon"
          size="x-large"
          @click="pickOperator(side)"
        />
      </v-col>

      <v-col
        v-if="false"
        cols="auto"
      >
        <!-- Randomize Buttons -->
        <v-btn
          v-for="side in Side.LIST"
          :key="`randomize_${side.key}`"
          class="mb-4 mx-2"
          :color="side.color"
          :disabled="!operatorPool.length"
          :icon="side.icon"
          size="x-large"
          @click="pickOperator(side)"
        />

        <!-- Pick Amount Slider -->
        <v-slider
          v-model="settings.picks"
          hide-details
          label="Pick Amount"
          max="5"
          min="1"
          show-ticks="always"
          step="1"
        />
      </v-col>
    </v-row>

    <!-- Operator Pool -->
    <v-row>
      <v-col cols="12">
        <side-pool
          :items="operatorPool"
          title="Operator Pool"
        >
          <template v-slot="{ items }">
            <v-card-text class="d-flex flex-wrap">
              <v-col
                v-for="operator in items"
                :key="operator.key"
                cols="3"
              >
                <operator-card
                  colored
                  :operator-key="operator.key"
                  @click="previewOperator(operator.key)"
                />
              </v-col>
            </v-card-text>
          </template>
        </side-pool>
      </v-col>
    </v-row>
  </v-container>

  <v-navigation-drawer
    location="right"
    width="350"
  >
    <v-tabs
      v-model="rawSettings.tab"
      fixed-tabs
    >
      <v-tab
        text="Global"
        value="GLOBAL"
      />
      <v-tab
        text="Picker"
        value="PICKER"
      />
    </v-tabs>

    <v-divider />

    <v-window v-model="rawSettings.tab">
      <v-window-item value="GLOBAL">
        <!-- Match Settings -->
        <match-settings
          v-model:playlist="rawSettings.matchSettings.playlist"
          v-model:map="rawSettings.matchSettings.map"
          v-model:bans="rawSettings.matchSettings.operatorBans"
        />

        <v-divider />

        <!-- Player Settings -->
        <player-settings v-model:players="rawSettings.playerSettings.players" />
      </v-window-item>

      <v-window-item value="PICKER">
        <v-list>
          <v-list-subheader>Picker Settings</v-list-subheader>

          <!-- Player Count -->
          <v-list-item
            :disabled="!!rawSettings.playerSettings.players.length"
            class="mb-1"
          >
            <v-label class="d-block text-caption">Player Count</v-label>
            <v-slider
              v-model="rawSettings.pickerSettings.pickAmount"
              append-icon="mdi-account-group"
              density="comfortable"
              :hide-details="!rawSettings.playerSettings.players.length"
              messages="Set by players list."
              max="5"
              min="1"
              prepend-icon="mdi-account"
              show-ticks="always"
              step="1"
            />
          </v-list-item>

          <!-- Duplicate Pick Switch -->
          <v-list-item
            :disabled="!!rawSettings.matchSettings.playlist"
            class="mb-1"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-switch
                  v-model="rawSettings.pickerSettings.pickDuplicates"
                  density="comfortable"
                  hide-details
                  v-bind="rawSettings.matchSettings.playlist ? { modelValue: settings.matchSettings.playlist.isArcade } : null"
                />
              </v-list-item-action>
            </template>
            <v-list-item-title>Allow duplicate operator picks</v-list-item-title>
            <v-list-item-subtitle v-if="rawSettings.matchSettings.playlist">Set by playlist</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider />

        <!-- Operator Filters -->
        <operator-settings
          v-model:speed="rawSettings.operatorSettings.speed"
          v-model:role="rawSettings.operatorSettings.role"
          v-model:squad="rawSettings.operatorSettings.squad"
          v-model:primary="rawSettings.operatorSettings.loadout.primary"
          v-model:secondary="rawSettings.operatorSettings.loadout.secondary"
          v-model:gadget="rawSettings.operatorSettings.loadout.gadget"
        />
      </v-window-item>
    </v-window>
  </v-navigation-drawer>

  <!-- Operator Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="300"
  >
    <operator-card
      detailed
      :operator-key="previewDialog.operatorKey"
      portrait
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

import { MatchSettings, OperatorCard, OperatorSettings, PlayerSettings, SidePool } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { Gadget, Map, Operator, Playlist, Role, Side, Squad, Weapon } from '@/models';

// Define dynamic properties
/** The raw settings values. */
const rawSettings = ref({
  tab: 'PICKER',
  matchSettings: {
    playlist: null,
    map: null,
    operatorBans: []
  },
  playerSettings: {
    players: []
  },
  pickerSettings: {
    pickAmount: 5,
    pickDuplicates: false
  },
  operatorSettings: {
    speed: [],
    role: [],
    squad: null,
    loadout: {
      primary: [],
      secondary: [],
      gadget: []
    }
  }
});

/** The finalized settings values. */
const settings = computed(() => {
  const {
    matchSettings: { playlist, map, operatorBans },
    playerSettings: { players },
    pickerSettings: { pickAmount, pickDuplicates },
    operatorSettings: { speed, role, squad, loadout: { primary, secondary, gadget } }
  } = rawSettings.value;

  const _settings = {
    matchSettings: {
      playlist: playlist ? Playlist.valueOf(playlist) : null,
      map: map ? Map.valueOf(map) : null,
      operatorBans: operatorBans.map((o) => Operator.valueOf(o))
    },
    playerSettings: {
      players
    },
    pickerSettings: {
      pickAmount: players.length || pickAmount,
      pickDuplicates
    },
    operatorSettings: {
      speed,
      role: role.map((r) => Role.valueOf(r)),
      squad: squad ? Squad.valueOf(squad) : null,
      loadout: {
        primary: primary.map((p) => Weapon.valueOf(p)),
        secondary: secondary.map((s) => Weapon.valueOf(s)),
        gadget: gadget.map((g) => Gadget.valueOf(g))
      }
    }
  }

  if (playlist) {
    _settings.matchSettings.operatorBans.push(..._settings.matchSettings.playlist.bannedOperators);
    _settings.pickerSettings.pickDuplicates = _settings.matchSettings.playlist.isArcade;
  }

  return _settings;
});

/**
 * The keys of the operators that have been picked by the randomizer.
 * @type {import('vue').Ref<String>}
 */
const pickedOperators = ref([]);
const previewDialog = ref({
  operatorKey: null,
  show: false
});

/** The pool to pick operators from. */
const operatorPool = computed(() => {
  const {
    matchSettings: { operatorBans },
    operatorSettings: { speed, role, squad, loadout: { primary, secondary, gadget } }
  } = settings.value;

  const operatorFilters = {};

  // Set bans
  if (operatorBans.length) operatorFilters.bans = operatorBans;

  // Set operator details
  if (speed.length) operatorFilters.speed = speed;
  if (role.length) operatorFilters.role = role;
  if (squad) operatorFilters.squad = squad;

  // Set loadout filter
  if (primary.length || secondary.length || gadget.length) {
    const loadoutFilter = { method: 'every' };

    if (primary.length) loadoutFilter.primary = primary;
    if (secondary.length) loadoutFilter.secondary = secondary;
    if (gadget.length) loadoutFilter.gadget = gadget;

    operatorFilters.loadoutFilters = [loadoutFilter];
  }

  return Operator.getOperators(operatorFilters);
});

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {Side} side The side to pick the operator from.
 */
function pickOperator(side) {
  const { pickerSettings: { pickAmount, pickDuplicates } } = settings.value;

  // Apply side filter
  const pool = operatorPool.value.filter((o) => side.includes(o.side));

  // Pick random operator
  pickedOperators.value.length = 0;
  pickedOperators.value = pickRandom(pool, pickAmount, pickDuplicates).map((o) => o.key);
}

/**
 * Opens a preview dialog for the selected operator.
 * 
 * @param {String} operatorKey The key of the operator to preview.
 */
function previewOperator(operatorKey) {
  previewDialog.value.operatorKey = operatorKey;
  previewDialog.value.show = true;
}
</script>

<style scoped>
.operator-card {
  max-width: calc(100% / 5);
}
</style>
