<template>
  <v-container>
    <!-- Operator Cards -->
    <v-row class="justify-center flex-nowrap pt-12">
      <v-col
        v-for="i in pickerSettings.pickAmount"
        :key="`portrait_${i}`"
        class="operator-card"
      >
        <operator-card
          :operator-key="pickedOperators[i - 1]"
          :placeholder="!pickedOperators[i - 1]"
          @click="previewOperator(pickedOperators[i - 1])"
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
            @click="pickOperator(side.key)"
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
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :color="AppSettings.colors[operator.side.key]"
                  :prepend-avatar="operator.emblem"
                  :title="operator.name"
                  @click="previewOperator(operator.key)"
                >
                  <!-- Ban Button -->
                  <template v-slot:append>
                    <v-btn
                      v-show="isHovering"
                      variant="text"
                      @click.stop="matchSettings.operatorBans.push(operator.key)"
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
    v-model:pick-amount="pickerSettings.pickAmount"
    v-model:use-squad="pickerSettings.useSquad"
    v-model:pick-duplicates="pickerSettings.pickDuplicates"
    v-model:playlist="matchSettings.playlist"
    v-model:operator-bans="matchSettings.operatorBans"
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
    width="auto"
  >
    <operator-card
      detailed
      :operator-key="previewDialog.operatorKey"
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorCard, OperatorFilterDrawer } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { Operator, Playlist, Side } from '@/models';
import { useAppSettings, usePlayers } from '@/stores';
import findItems from '@/utils/findItems';

// Register composables
const AppSettings = useAppSettings();
const Players = usePlayers();

/**
 * The settings for the operator picker.
 * @type {import('vue').Ref<{ pickAmount: number, useSquad: boolean, pickDuplicates: boolean }>}
 */
const pickerSettings = ref({
  /** The amount of operators to pick. */
  pickAmount: Math.max(Players.currentPlayers.length, 1),

  /** Whether to use the current squad to determine pick amount.  */
  useSquad: Players.currentPlayers.length > 0,

  /** Whether duplicate picks are allowed. */
  pickDuplicates: false
});

/**
 * The match settings.
 * @type {import('vue').Ref<{ playlist: string, operatorBans: string[] }>}
 */
const matchSettings = ref({
  /** The key of the picked playlist. */
  playlist: null,

  /** The keys of the banned operators. */
  operatorBans: []
});

/**
 * The operator filter values.
 * @type {import('vue').Ref<{ speed: number[], roles: string[], squad: string }>}
 */
const operatorSettings = ref({
  /** The speeds of the operators. */
  speed: [1, 2, 3],

  /** The keys of the roles of the operators. */
  roles: [],

  /** The key of the squad of the operators. */
  squad: null
});

/**
 * The loadout filter values.
 * @type {import('vue').Ref<{ primary: string[], secondary: string[], gadgets: [] }>}
 */
const loadoutSettings = ref({
  /** The keys of the primary weapons of the operators. */
  primary: [],

  /** The keys of the secondary weapons of the operators. */
  secondary: [],

  /** The keys of the gadgets of the operators. */
  gadgets: []
});

/**
 * The operator pool to pick from.
 * @type {import('vue').ComputedRef<Operator[]>}
 */
const operatorPool = computed(() => {
  const { playlist, operatorBans } = matchSettings.value;
  const { speed, roles, squad } = operatorSettings.value;
  const { primary, secondary, gadgets } = loadoutSettings.value;

  // Set filters
  const filters = [];
  if (playlist) filters.push({ method: 'included', value: Playlist[playlist].bannedOperators, negative: true });
  if (operatorBans.length) filters.push({ property: 'key', method: 'included', value: operatorBans, negative: true });
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
 * The keys of the currently picked operators.
 * @type {import('vue').Ref<String[]>}
 */
const pickedOperators = ref([]);

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {string} [sideKey=null] The side to pick the operator from.
 */
function pickOperator(sideKey = null) {
  const { pickAmount, pickDuplicates } = pickerSettings.value;

  const pool = operatorPool.value
    .filter((operator) => {
      if (sideKey && operator.side.key !== sideKey) return false;
      return !pickedOperators.value.includes(operator);
    })
    .map((operator) => operator.key);

  // Pick random operator
  pickedOperators.value.length = 0;
  pickedOperators.value = pickRandom(pool, pickAmount, pickDuplicates);
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
</script>

<style scoped>
.operator-card {
  max-width: calc(100% / 5);
}
</style>
