<template>
  <v-container>
    <!-- Picked Operators -->
    <v-row class="justify-center">
      <v-col
        v-for="i in playerList.length || pickerSettings.pickAmount"
        :key="i"
        class="operator-card"
      >
        <operator-card
          :operator="pickedOperators[i - 1]"
          :player-name="playerList[i - 1] || null"
          :variant="!pickedOperators[i - 1] ? 'placeholder' : 'prominent'"
          @click="onCardClick(i - 1)"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="justify-center">
      <v-col
        v-for="side in pickableSides"
        :key="side.key"
        cols="auto"
      >
        <v-btn
          :color="side.color"
          :disabled="!operatorPool.length"
          :icon="side.icon"
          size="x-large"
          @click="pickOperators(side)"
        />
      </v-col>

      <v-btn
        icon="mdi-filter"
        @click="showOperatorFilters = true"
      />
    </v-row>

    <!-- Operator Pool -->
    <side-pool
      class="mt-12"
      :items="operatorPool"
      title="Operator Pool"
    >
      <template #default="{ items }">
        <v-card-text class="d-flex flex-wrap">
          <v-col
            v-for="operator in items"
            :key="operator.key"
            cols="3"
          >
            <operator-card
              :operator="operator"
              @click="previewOperator(operator.key)"
            />
          </v-col>
        </v-card-text>
      </template>
    </side-pool>

    <!-- Filter Drawer -->
    <operator-filter-drawer
      v-model="showOperatorFilters"
      v-model:pick-amount="pickerSettings.pickAmount"
      v-model:pick-duplicates="pickerSettings.pickDuplicates"
      v-model:speed="filters.speed"
      v-model:roles="filters.roles"
      v-model:squad="filters.squad"
      v-model:primary="filters.primary"
      v-model:secondary="filters.secondary"
      v-model:gadgets="filters.gadgets"
    />
  </v-container>

  <!-- Operator Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="300"
  >
    <operator-card
      :operator="previewDialog.operatorKey"
      variant="detailed"
    />
  </v-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { OperatorCard, OperatorFilterDrawer, SidePool } from '@/components';
import { Operator, Side } from '@/models';
import { useMatchSettings } from '@/store';

// Include settings
const MatchSettings = useMatchSettings();

// Extract refs from MatchSettings
const { pickableOperators, playerList, playlist } = storeToRefs(MatchSettings);

const pickableSides = computed(() => Side.LIST.filter((s) => {
  return s !== Side.ALL || (!playlist.value || playlist.value.features.mixedTeams);
}));

/**
 * Whether to show the operator filter drawer.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const showOperatorFilters = shallowRef(false);

/**
 * The settings for the operator picker.
 * @type {import('vue').Ref<{ pickAmount: Number, pickDuplicates: Boolean }>}
 */
const pickerSettings = ref({
  pickAmount: 5,
  pickDuplicates: false
});

/**
 * @typedef {Object}   OperatorFilters The values to filter operators by.
 * @prop    {number[]} speed           The target operator's speed.
 * @prop    {string[]} roles           The keys of the target operator's roles.
 * @prop    {string}   squad           The key of the target operator's squad.
 * @prop    {string[]} primary         The keys of the target operator's primary weapons.
 * @prop    {string[]} secondary       The keys of the target operator's secondary weapons.
 * @prop    {string[]} gadgets         The keys of the target operator's gadgets.
 */

/**
 * The values to filter operators by.
 * @type {import('vue').Ref<OperatorFilters>}
 */
const filters = ref({
  // Operator Details
  speed: [],
  roles: [],
  squad: null,

  // Loadout
  primary: [],
  secondary: [],
  gadgets: []
});

/**
 * The keys of the operators that have been picked by the randomizer.
 * @type {import('vue').Ref<Operator[]>}
 */
const pickedOperators = ref([]);
const previewDialog = ref({
  operatorKey: null,
  show: false
});

/** The pool to pick operators from. */
const operatorPool = computed(() => {
  const { speed, roles, squad, primary, secondary, gadgets } = filters.value;

  const operatorFilters = {};

  // Set operator details
  if (speed.length) operatorFilters.speed = speed;
  if (roles.length) operatorFilters.role = roles;
  if (squad) operatorFilters.squad = squad;

  // Set loadout filter
  if (primary.length || secondary.length || gadgets.length) {
    const loadoutFilter = { method: 'every' };

    if (primary.length) loadoutFilter.primary = primary;
    if (secondary.length) loadoutFilter.secondary = secondary;
    if (gadgets.length) loadoutFilter.gadget = gadgets;

    operatorFilters.loadoutFilters = [loadoutFilter];
  }

  return Operator.getOperators(operatorFilters, pickableOperators.value);
});

function onCardClick(index) {
  // Pick operators
  if (pickedOperators.value.length === 0) {
    pickOperators(Side.ALL);
    return;
  }

  const pickedOperator = toRaw(pickedOperators.value[index]);
  if (pickedOperator) previewOperator(pickedOperator.key);
}

/**
 * Picks random operators from the operator pool.
 * 
 * @param {Side} side The side to pick the operators from.
 */
function pickOperators(side) {
  const { pickAmount, pickDuplicates } = pickerSettings.value;
  // const { pickerSettings: { pickAmount, pickDuplicates } } = settings2.value;

  // Apply side filter
  const pool = operatorPool.value.filter((o) => side.includes(o.side));
  const pickerParams = {
    amount: playerList.length || pickAmount,
    duplicates: pickDuplicates,
    previous: [...pickedOperators.value.map((o) => toRaw(o))]
  };

  // Pick random operator
  pickedOperators.value.length = 0;
  pickedOperators.value.push(...Operator.pickRandomOperators(pool, pickerParams));
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
