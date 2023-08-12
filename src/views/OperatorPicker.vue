<template>
  <v-container>
    <v-row class="py-12" align="end" justify="center">
      <!-- Operator Card -->
      <v-col cols="auto" offset="3">
        <operator-card big :value="pickedOperator" @click="pickOperator" />
      </v-col>

      <!-- Filters -->
      <v-col cols="3">
        <v-card color="transparent" elevation="0" max-width="300">
          <!-- Side -->
          <v-radio-group v-model="pickedSide" inline hide-details @update:model-value="clearPicks">
            <v-radio label="All" :value="null" />
            <v-radio label="Attacker" value="ATT" />
            <v-radio label="Defender" value="DEF" />
          </v-radio-group>

          <!-- Speed -->
          <v-select v-model="pickedSpeeds" class="mt-4" clearable hide-details :items="[1, 2, 3]" label="Speed" multiple
            variant="solo-filled" @update:model-value="clearPicks" />

          <!-- Role -->
          <v-select v-model="pickedRoles" class="mt-4" clearable hide-details :items="ROLES" label="Role" multiple
            variant="solo-filled" @update:model-value="clearPicks" />

          <!-- Squad -->
          <v-select v-model="pickedSquads" class="mt-4" clearable hide-details :items="SQUADS" label="Squad" multiple
            variant="solo-filled" @update:model-value="clearPicks" />

          <!-- Randomize Button -->
          <v-btn block class="mt-4" color="primary" :text="pickedOperator ? 'Repick' : 'Randomize'"
            @click="pickOperator" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Operator Pool Title -->
    <v-row justify="center">
      <v-col cols="auto" class="text-center" tag="h2">Operator Pool</v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="o in operatorPool" :key="o.key" cols="auto">
        <operator-card :inactive="disabledOperators.includes(o)" :value="o" @click="toggleInactive(o)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorCard } from '@/components';
import { pickRandomOperators } from '@/composables/operatorPicker';
import { OPERATORS, ROLES, SQUADS } from '@/data';

// Define dynamic properties
const pickedRoles = ref([]);
const pickedSide = ref(null);
const pickedSpeeds = ref([]);
const pickedSquads = ref([]);
const pickedOperator = ref(undefined);
const disabledOperators = ref([]);

// Define computed properties
const operatorPool = computed(() => OPERATORS.filter((o) => {
  // Apply selected filters
  if (pickedSide.value && pickedSide.value !== o.side) return false;
  if (pickedRoles.value.length && pickedRoles.value.some((r) => !o.roles.includes(r))) return false;
  if (pickedSpeeds.value.length && !pickedSpeeds.value.includes(o.speed)) return false;
  if (pickedSquads.value.length && !pickedSquads.value.includes(o.squad)) return false;

  return true;
}));

/**
 * Clears the operator pick and disabled operators.
 */
function clearPicks() {
  pickedOperator.value = undefined;
  disabledOperators.value = [];
}

/**
 * Picks a random operator from the operator pool.
 */
function pickOperator() {
  // Build filter object
  const filters = { exclude: [...disabledOperators.value] };
  if (pickedOperator.value) filters.exclude.push(pickedOperator.value);
  if (pickedSide.value) filters.side = pickedSide.value;
  if (pickedRoles.value.length) filters.roles = pickedRoles.value;
  if (pickedSpeeds.value.length) filters.speeds = pickedSpeeds.value;
  if (pickedSquads.value.length) filters.squads = pickedSquads.value;

  // Pick random operator
  [pickedOperator.value] = pickRandomOperators(filters);
}

/**
 * Toggles the inactive status of an operator.
 * 
 * @param {String} key The key of the operator to toggle.
 */
function toggleInactive(operator) {
  // Find operator index
  const operatorIndex = disabledOperators.value.indexOf(operator);

  // Add or remove operator from list
  if (operatorIndex === -1) disabledOperators.value.push(operator);
  else disabledOperators.value.splice(operatorIndex, 1);
}
</script>
