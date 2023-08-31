<template>
  <v-container class="pt-12">
    <v-row justify="center">
      <!-- Operator Cards -->
      <v-col
        v-for="i in settings.picks"
        :key="`portrait_${i}`"
        cols="auto"
      >
        <operator-card
          :operator-key="pickedOperators[i - 1] || null"
          :placeholder="i > pickedOperators.length"
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <!-- Randomize Button -->
      <v-col
        align="center"
        cols="12"
      >
        <v-btn
          v-for="{ icon, side } in SIDE_BUTTONS"
          :key="`randomize_${side || 'ALL'}`"
          class="mx-2"
          color="primary"
          :disabled="!operatorPool.length"
          :icon="icon"
          size="x-large"
          @click="pickOperator(side)"
        />

        <v-card
          variant="plain"
          width="250"
        >
          <v-slider
            v-model="settings.picks"
            hide-details
            label="Pick Amount"
            max="5"
            min="1"
            step="1"
          />

          <v-switch
            v-model="settings.duplicates"
            hide-details
            inset
            label="Allow duplicate picks"
          />
        </v-card>


      </v-col>

      <!-- Operator Pool Title -->
      <v-col
        class="text-center"
        cols="12"
        tag="h2"
      >
        Operator Pool
      </v-col>

      <!-- Operator Pool -->
      <v-col
        v-for="o in operatorPool"
        :key="o.key"
        cols="3"
      >
        <v-card
          v-if="false"
          class="px-0"
        >
          <operator-item :value="o.key" />
        </v-card>

        <v-card class="align-center d-flex">
          <v-col
            class="py-0"
            cols="auto"
          >
            <v-avatar rounded="0">
              <v-img
                :alt="`${o.name} emblem`"
                :src="loadEmblem(o.key)"
              />
            </v-avatar>
          </v-col>
          <v-col class="pa-0">
            <v-card-title class="pb-0 text-center">{{ o.name }}</v-card-title>
            <v-card-subtitle class="mb-2 text-center">{{ o.squad || 'None' }}</v-card-subtitle>
          </v-col>
          <v-col
            class="py-0"
            cols="auto"
          >
            <v-icon
              class="mx-1"
              :icon="o.side === 'ATT' ? 'mdi-sword-cross' : 'mdi-chess-rook'"
              size="32"
            />
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Operator Filter Drawer -->
  <operator-filter-drawer
    v-model:bans="settings.bans"
    v-model:recruits="settings.recruits"
    v-model:roles="settings.roles"
    v-model:speed="settings.speed"
    v-model:squad="settings.squad"
  />
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorCard, OperatorFilterDrawer, OperatorItem } from '@/components';
import { loadEmblem } from '@/composables/imageLoader';
import { pickRandomOperators } from '@/composables/operatorPicker';
import { OPERATORS } from '@/data';

const SIDE_BUTTONS = [
  { side: 'ATT', icon: 'mdi-sword-cross' },
  { side: null, icon: 'mdi-infinity' },
  { side: 'DEF', icon: 'mdi-chess-rook' }
];

// Define dynamic properties
const settings = ref({
  bans: [],
  duplicates: false,
  picks: 1,
  recruits: true,
  roles: [null, null],
  speed: [1, 2, 3],
  squad: null
});

const pickedOperators = ref([]);

// Define computed properties
const operatorFilter = computed(() => {
  // Load settings
  const { bans, duplicates, picks, recruits, speed, squad } = settings.value;
  const roles = settings.value.roles.filter((r) => !!r);

  // Collect excluded operators
  const excludedOperators = [...bans];
  if (!recruits) excludedOperators.push('RECRUIT_ATT', 'RECRUIT_DEF');
  if (picks === 1 && pickedOperators.value.length === 1) excludedOperators.push(pickedOperators.value[0]);

  // Build filters
  const filterOptions = {};
  if (picks > 1) filterOptions.amount = picks;
  if (duplicates) filterOptions.allowDuplicates = true;
  if (excludedOperators.length) filterOptions.exclude = excludedOperators;
  if (roles.length) filterOptions.roles = roles;
  if (speed.length !== 3) filterOptions.speeds = speed;
  if (squad) filterOptions.squads = [squad];
  return filterOptions;
});

const operatorPool = computed(() => OPERATORS.filter((o) => {
  const { bans, recruits, speed, squad } = settings.value;
  const roles = settings.value.roles.filter((r) => !!r);

  // Apply selected filters
  if (bans.includes(o.key)) return false;
  if (!recruits && o.key.startsWith('RECRUIT')) return false;
  if (!roles.every((r) => r ? o.roles.includes(r) : true)) return false;
  if (!speed.includes(o.speed)) return false;
  if (squad && o.squad !== squad) return false;

  return true;
}));

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {"ATT" | "DEF"} [side=null] The side to pick the operator from.
 */
function pickOperator(side = null) {
  // Finalize filters
  const filters = { ...operatorFilter.value };
  if (side) filters.sides = [side];

  // Pick random operator
  pickedOperators.value.length = 0;
  pickedOperators.value = pickRandomOperators(filters);
}
</script>
