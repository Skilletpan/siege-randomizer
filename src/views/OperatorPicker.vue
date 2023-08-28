<template>
  <v-container
    v-bind="$attrs"
    class="pt-12"
  >
    <v-row justify="center">
      <!-- Operator Cards -->
      <v-col
        v-for="(o, index) in pickedOperators"
        :key="`${o.key}_${index}`"
        cols="auto"
      >
        <operator-card :value="o.key" />
      </v-col>

      <!-- Randomize Button -->
      <v-col
        align="center"
        cols="12"
      >
        <v-btn
          color="primary"
          :disabled="!operatorPool.length"
          icon="mdi-dice-multiple-outline"
          size="x-large"
          @click="pickOperator"
        />
      </v-col>

      <!-- Operator Pool Title -->
      <v-col
        cols="12"
        class="text-center"
        tag="h2"
      >
        Operator Pool
      </v-col>

      <!-- Operator Pool -->
      <v-col
        v-for="o in operatorPool"
        :key="o.key"
        cols="2"
      >
        <v-card class="px-0">
          <operator-item :value="o.key" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Operator Filter Drawer -->
  <operator-filter-drawer
    v-model:disabledOperators="operatorFilters.disabled"
    v-model:duplicates="operatorFilters.allowDuplicates"
    v-model:picks="operatorFilters.picks"
    v-model:roles="operatorFilters.roles"
    v-model:sides="operatorFilters.sides"
    v-model:speeds="operatorFilters.speeds"
    v-model:squads="operatorFilters.squads"
  />
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorCard, OperatorFilterDrawer, OperatorItem } from '@/components';
import { pickRandomOperators } from '@/composables/operatorPicker';
import { OPERATORS } from '@/data';

// Define dynamic properties
const operatorFilters = ref({
  allowDuplicates: false,
  disabled: [],
  picks: 1,
  roles: [],
  sides: ['ATT', 'DEF'],
  speeds: [1, 2, 3],
  squads: []
});

const pickedOperators = ref([]);

// Define computed properties
const operatorPool = computed(() => OPERATORS.filter((o) => {
  // Apply selected filters
  if (operatorFilters.value.disabled.includes(o.key)) return false;
  if (!operatorFilters.value.roles.every((r) => o.roles.includes(r))) return false;
  if (!operatorFilters.value.sides.includes(o.side)) return false;
  if (!operatorFilters.value.speeds.includes(o.speed)) return false;
  if (operatorFilters.value.squads.length && !operatorFilters.value.squads.includes(o.squad)) return false;

  return true;
}));

/**
 * Picks a random operator from the operator pool.
 */
function pickOperator() {
  const { allowDuplicates, disabled, picks, roles, sides, speeds, squads } = operatorFilters.value;

  // Build filter object
  const filters = { allowDuplicates, amount: picks, exclude: [...disabled] };

  if (picks === 1 && pickedOperators.value.length === 1) filters.exclude.push(pickedOperators.value[0].key);
  if (roles.length) filters.roles = roles;
  if (sides.length) filters.sides = sides;
  if (speeds.length) filters.speeds = speeds;
  if (squads.length) filters.squads = squads;

  // Pick random operator
  pickedOperators.value.length = 0;
  pickedOperators.value = pickRandomOperators(filters);
}
</script>
