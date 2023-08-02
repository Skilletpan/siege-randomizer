<template>
  <v-container>
    <v-row class="py-12" justify="center">
      <v-col cols="auto">
        <operator-card big :value="pickedOperator" />
        <v-btn block class="mt-4" color="primary" :disabled="operatorPool.length < 2" text="Pick Random Operator"
          @click="pickOperator()" />
        <v-btn block class="mt-4" color="primary" :disabled="operatorPool.length < 2" text="Pick Random Attacker"
          @click="pickOperator('ATT')" />
        <v-btn block class="mt-4" color="primary" :disabled="operatorPool.length < 2" text="Pick Random Defender"
          @click="pickOperator('DEF')" />
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center" tag="h2">Operator Pool</v-col>
      <v-col cols="2">
        <v-select v-model="pickedSpeeds" clearable density="compact" hide-details :items="[1, 2, 3]" multiple
          placeholder="Speed" variant="solo-filled" />
      </v-col>
      <v-col cols="2">
        <v-select v-model="pickedRoles" clearable density="compact" hide-details :items="ROLES" multiple
          placeholder="Role" variant="solo-filled" />
      </v-col>
      <v-col cols="2">
        <v-select v-model="pickedSquads" clearable density="compact" hide-details :items="SQUADS" multiple
          placeholder="Squad" variant="solo-filled" />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="o in operatorPool" :key="o.name" cols="auto">
        <operator-card :value="o" @click="pickedOperator = o" />
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
const pickedSpeeds = ref([]);
const pickedSquads = ref([]);
const pickedOperator = ref(null);

const operatorPool = computed(() => OPERATORS.filter((o) => {
  // Apply selected filters
  if (pickedRoles.value.length && pickedRoles.value.some((r) => !o.roles.includes(r))) return false;
  if (pickedSpeeds.value.length && !pickedSpeeds.value.includes(o.speed)) return false;
  if (pickedSquads.value.length && !pickedSquads.value.includes(o.squad)) return false;

  return true;
}));

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {"ATT" | "DEF"} [side] The side to pick the operator from.
 */
function pickOperator(side = null) {
  // Build filter object
  const filters = {};
  if (pickedOperator.value) filters.exclude = [pickedOperator.value];
  if (side) filters.side = side;
  if (pickedRoles.value.length) filters.roles = pickedRoles.value;
  if (pickedSpeeds.value.length) filters.speeds = pickedSpeeds.value;
  if (pickedSquads.value.length) filters.squads = pickedSquads.value;

  // Pick random operator
  [pickedOperator.value] = pickRandomOperators(filters);
}
</script>
