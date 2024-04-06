<template>
  <v-container>
    <!-- Picked Operators -->
    <v-row class="justify-center">
      <v-col
        v-for="i in pickerSettings.pickAmount"
        :key="i"
        class="operator-card"
      >
        <operator-card
          :operator="pickedOperators[i - 1]"
          :player-name="playerList[i - 1] || null"
          :refreshable="!!pickedOperators[i - 1]"
          :variant="!pickedOperators[i - 1] ? 'placeholder' : 'prominent'"
          @click="onCardClick(i - 1)"
          @refresh="() => { console.log('Test') }"
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
        icon="$filter"
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
              @click="previewOperator(operator)"
            />
          </v-col>
        </v-card-text>
      </template>
    </side-pool>

    <!-- Filter Drawer -->
    <operator-filter-drawer
      v-model="showOperatorFilters"
      @update:operators="filteredOperators = $event"
      @update:settings="pickerSettings = $event"
    />
  </v-container>

  <!-- Operator Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="300"
  >
    <operator-card
      :operator="previewDialog.operator"
      variant="detailed"
    />
  </v-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { OperatorCard, OperatorFilterDrawer, SidePool } from '@/components';
import { Operator, Side } from '@/models';
import { useMatchSettings, useSquadSettings } from '@/store';

// Include settings
const MatchSettings = useMatchSettings();
const SquadSettings = useSquadSettings();

// Extract refs from MatchSettings
const { pickableOperators, playerList, playlist } = storeToRefs(MatchSettings);

/**
 * Whether to show the operator filter drawer.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const showOperatorFilters = shallowRef(false);

/**
 * The settings for the operator picker.
 * @type {import('vue').Ref<{ pickAmount: Number, pickDuplicates: Boolean }>}
 */
const pickerSettings = ref({});

/**
 * The filtered operators from the filter drawer.
 * @type {import('vue').Ref<Operator[]>}
 */
const filteredOperators = ref([]);

/** The sides available to pick operators from. */
const pickableSides = computed(() => {
  if (!playlist.value || playlist.value.features.mixedTeams) return Side.LIST;
  return Side.SIDES;
});

/** The pool to pick operators from. */
const operatorPool = computed(() => pickableOperators.value.filter((o) => filteredOperators.value.includes(o)));

/**
 * The keys of the operators that have been picked by the randomizer.
 * @type {import('vue').Ref<Operator[]>}
 */
const pickedOperators = ref([]);

/**
 * The operators that have been picked by the randomizer by player name.
 * @type {import('vue').Ref<{ [playerName: String]: Operator[] }>}
 */
const picks = ref({});

/**
 * The data for the preview dialog.
 * @type {import('vue').Ref<{ operator: Operator | String, show: Boolean }>}
 */
const previewDialog = ref({
  operator: null,
  show: false
});

function onCardClick(index) {
  // Pick operators
  if (pickedOperators.value.length === 0) {
    pickOperators(Side.ALL);
    return;
  }

  const pickedOperator = toRaw(pickedOperators.value[index]);
  if (pickedOperator) previewOperator(pickedOperator);
}

/**
 * Picks random operators from the operator pool.
 * 
 * @param {Side} side The side to pick the operators from.
 */
function pickOperators(side) {
  const { pickAmount, pickDuplicates } = pickerSettings.value;

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
 * @param {Operator|string} operator The (key of the) operator to preview.
 */
function previewOperator(operator) {
  previewDialog.value.operator = operator;
  previewDialog.value.show = true;
}
</script>

<style scoped>
.operator-card {
  max-width: calc(100% / 5);
}
</style>
