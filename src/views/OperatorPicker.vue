<template>
  <v-container>
    <!-- Operator Cards -->
    <v-row class="justify-center flex-nowrap overflow-x-auto pt-12">
      <v-col
        v-for="playerName in activePlayers"
        :key="playerName"
        class="operator-card"
      >
        <!-- Operator Card -->
        <operator-card
          v-model="pickHistory[playerName][0]"
          :player="pickerSettings.useSquad ? playerName : null"
          @click="onCardClick(playerName)"
          @repick="pickOperators(playerName)"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="justify-center pb-12">
      <v-col cols="auto">
        <!-- Randomize Buttons -->
        <template
          v-for="side, index in [Side.ATT, {}, Side.DEF]"
          :key="index"
        >
          <v-btn
            class="mb-4 mx-2"
            :color="side.key ? AppSettings.colors[side.key] : 'side-all'"
            :disabled="!operatorPool.length"
            :icon="side.icon || '$siege-side-all'"
            size="x-large"
            @click="lastPickSide = side.key || null; pickOperators()"
          />
        </template>
      </v-col>
    </v-row>

    <!-- Operator Pool -->
    <v-row>
      <template
        v-for="side, index in Side.LIST"
        :key="side.key"
      >
        <v-col>
          <!-- Side Title -->
          <h2 class="mb-4 text-center">
            <v-icon
              :icon="side.icon"
              size="small"
              start
            />
            {{ side.name }}
          </h2>

          <!-- Operator Items -->
          <v-row>
            <v-col
              v-for="operator in operatorPool.filter((o) => o.side === side)"
              :key="operator.key"
              cols="6"
            >
              <!-- Operator Card -->
              <v-hover #="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :color="AppSettings.colors[operator.side.key]"
                  :title="operator.name"
                  @click="previewOperator(operator.key)"
                >
                  <!-- Operator Emblem -->
                  <template #prepend>
                    <v-avatar
                      :image="operator.emblem"
                      tile
                    />
                  </template>

                  <!-- Ban Button -->
                  <template #append>
                    <v-btn
                      v-show="isHovering"
                      variant="text"
                      @click.stop="operatorSettings.bans.push(operator.key)"
                    >
                      Ban
                    </v-btn>
                  </template>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>

        <v-divider
          v-if="index === 0"
          vertical
        />
      </template>
    </v-row>
  </v-container>

  <!-- Operator Filter Drawer -->
  <operator-filter-drawer
    v-model:preset="pickerSettings.preset"
    v-model:pick-amount="pickerSettings.pickAmount"
    v-model:repick-cooldown="pickerSettings.repickCooldown"
    v-model:pick-duplicates="pickerSettings.pickDuplicates"
    v-model:use-squad="pickerSettings.useSquad"
    v-model:bans="operatorSettings.bans"
    v-model:speed="operatorSettings.speed"
    v-model:roles="operatorSettings.roles"
    v-model:squad="operatorSettings.squad"
    v-model:primary-weapons="loadoutSettings.primary"
    v-model:secondary-weapons="loadoutSettings.secondary"
    v-model:gadgets="loadoutSettings.gadgets"
  />

  <!-- Operator Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="300"
  >
    <operator-card
      v-model="previewDialog.operatorKey"
      detailed
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';

import { OperatorCard, OperatorFilterDrawer } from '@/components';
import { Operator, Playlist, Side } from '@/models';
import { useAppSettings, usePlayers } from '@/stores';
import findItems from '@/utils/findItems';

// Register composables
const AppSettings = useAppSettings();
const Players = usePlayers();

/** The settings for the operator picker. */
const pickerSettings = ref({
  /**
   * The the key of the playlist to use as preset.
   * @type {string}
   */
  preset: null,

  /**
   * The amount of operators to pick.
   * @type {number}
   */
  pickAmount: Math.max(Players.currentPlayers.length, 1),

  /**
   * The delay until an operator can be repicked.
   * @type {number} 
   */
  repickCooldown: 5,

  /**
   * Whether duplicate picks are allowed.
   * @type {boolean}
   */
  pickDuplicates: false,

  /**
   * Whether to use the current squad to determine pick amount.
   * @type {boolean}
   */
  useSquad: Players.currentPlayers.length > 0,
});

/** The operator filter values. */
const operatorSettings = ref({
  /**
   * The keys of the banned operators.
   * @type {string[]}
   */
  bans: [],

  /**
   * The speeds of the operators.
   * @type {number[]}
   */
  speed: [1, 2, 3],

  /**
   * The keys of the roles of the operators.
   * @type {string[]}
   */
  roles: [],

  /**
   * The key of the squad of the operators.
   * @type {string}
   */
  squad: null
});

/** The loadout filter values. */
const loadoutSettings = ref({
  /**
   * The keys of the primary weapons of the operators.
   * @type {string[]}
   */
  primary: [],

  /**
   * The keys of the secondary weapons of the operators.
   * @type {string[]}
   */
  secondary: [],

  /**
   * The keys of the gadgets of the operators.
   * @type {string[]}
   */
  gadgets: []
});

/**
 * The list of active player names.
 * @type {import('vue').ComputedRef<String[]|Number[]>}
 */
const activePlayers = computed(() => {
  const { pickAmount, useSquad } = pickerSettings.value;

  if (useSquad) return Players.currentPlayers;
  else return [...Array(pickAmount).keys()];
});

/**
 * The operator pick history by active player.
 * @type {import('vue').Ref<{ [player: string|number]: string[] }>}
 */
const pickHistory = ref({});

/**
 * The key of the last pick side.
 * @type {import('vue').Ref<String>}
 */
const lastPickSide = ref(null);

/**
 * The operator pool to pick from.
 * @type {import('vue').ComputedRef<Operator[]>}
 */
const operatorPool = computed(() => {
  const { preset } = pickerSettings.value;
  const { bans, speed, roles, squad } = operatorSettings.value;
  const { primary, secondary, gadgets } = loadoutSettings.value;

  // Set filters
  const filters = [];
  if (preset) filters.push({ method: 'included', value: Playlist[preset].bannedOperators, negative: true });
  if (bans.length) filters.push({ property: 'key', method: 'included', value: bans, negative: true });
  if (speed.length < 3) filters.push({ property: 'speed', method: 'included', value: speed });
  roles.forEach((key) => { filters.push({ property: 'roles[some].key', value: key }) });
  if (squad) filters.push({ property: 'squad.key', value: squad });
  primary.forEach((key) => { filters.push({ property: 'loadout.primary[some].key', value: key }) });
  secondary.forEach((key) => { filters.push({ property: 'loadout.secondary[some].key', value: key }) });
  gadgets.forEach((key) => { filters.push({ property: 'loadout.gadgets[some].key', value: key }) });

  // Find operators
  return findItems(Operator.LIST, [filters]);
});

/**
 * Handles clicking of an operator card.
 * 
 * @param {string|number} triggerPlayer The player of the clicked card.
 */
function onCardClick(triggerPlayer) {
  // Preview operator if a pick was made
  if (pickHistory.value[triggerPlayer][0]) {
    previewOperator(pickHistory.value[triggerPlayer][0]);
    return;
  }

  // Pick only trigger player if other slots have picks
  if (activePlayers.value.some((player) => !!pickHistory.value[player][0])) pickOperators(triggerPlayer);

  // Otherwise pick for all player slots
  else pickOperators();
}

/**
 * Picks a new operator for each active player from the operator pool.
 * 
 * @param {string} [triggerPlayer=null] The player to pick an operator for.
 */
function pickOperators(triggerPlayer = null) {
  const { pickDuplicates, repickCooldown } = pickerSettings.value;

  // The player(s) to pick operators for
  const players = triggerPlayer ? [triggerPlayer] : activePlayers.value;

  // Blocked operator keys for duplicate pick determination
  const blockedPicks = [];

  // Prefill blocked picks list
  if (triggerPlayer) {
    // Block current player operator for manual repicks (regardless of repick cooldown)
    if (pickHistory.value[triggerPlayer][0]) blockedPicks.push(pickHistory.value[triggerPlayer][0]);

    // Blocked currently picked operators of other player slots if duplicates are disallowed
    if (!pickDuplicates) activePlayers.value.forEach((player) => {
      if (player === triggerPlayer) return;
      if (pickHistory.value[player][0]) blockedPicks.push(pickHistory.value[player][0]);
    });
  }

  // Pick a new operator for each active player
  players.forEach((player) => {
    // Remove oldest pick from pick history
    pickHistory.value[player].length = repickCooldown;

    // Filter pickable operators
    const pool = operatorPool.value.filter((operator) => {
      // Filter by side
      if (lastPickSide.value && operator.side.key !== lastPickSide.value) return false;

      // Filter by pick history
      if (repickCooldown > 0 && pickHistory.value[player].includes(operator.key)) return false;

      // Filter by duplicates
      if (blockedPicks.includes(operator.key)) return false;

      return true;
    });

    // Pick random operator for player if pool size is greater than 0
    if (pool.length > 0) {
      const pickedOperator = pool[Math.floor(Math.random() * pool.length)];
      pickHistory.value[player].unshift(pickedOperator.key);

      // Add picked operator key to blocked picks if duplicates are disallowed
      if (!pickDuplicates) blockedPicks.push(pickedOperator.key);
    }

    // Fall back to no operator
    else pickHistory.value[player].unshift(null);
  });
}

/**
 * The settings for the operator preview dialog.
 * @type {import('vue').Ref<{ operatorKey: string, show: boolean }>}
 */
const previewDialog = ref({
  /** The key of the operator to preview. */
  operatorKey: null,

  /** Whether the operator preview dialog is visible. */
  show: false
});

/**
 * Opens a preview dialog for the selected operator.
 * 
 * @param {String} operatorKey The key of the operator to preview.
 */
function previewOperator(operatorKey) {
  previewDialog.value.operatorKey = operatorKey;
  previewDialog.value.show = true;
}

// Update pick history when picker or squad settings change
watchEffect(() => {
  const { repickCooldown } = pickerSettings.value;

  // Remove inactive players from history
  Object.keys(pickHistory.value).forEach((player) => {
    if (!activePlayers.value.includes(player)) delete pickHistory.value[player];
  });

  // Add active players to history and set history size
  activePlayers.value.forEach((player) => {
    if (!pickHistory.value[player]) pickHistory.value[player] = new Array(repickCooldown + 1);
    else pickHistory.value[player].length = repickCooldown + 1;
  });
});
</script>

<style scoped>
.operator-card {
  flex-basis: 1;
  max-width: calc(100% / 5);
  min-width: 200px;
}
</style>
