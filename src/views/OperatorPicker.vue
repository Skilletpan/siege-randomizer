<template>
  <v-container>
    <v-row class="py-12" justify="center">
      <v-col cols="auto">
        <operator-card big :value="pickedOperator" />
        <v-btn block class="mt-4" color="primary" :disabled="operatorPool.length < 2" text="Randomize"
          @click="pickOperator" />
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center" tag="h2">Operator Pool</v-col>
      <v-col cols="2">
        <v-select v-model="pickedSpeed" clearable density="compact" hide-details :items="[1, 2, 3]" placeholder="Speed"
          variant="solo-filled" />
      </v-col>
      <v-col cols="2">
        <v-select v-model="pickedRole" clearable density="compact" hide-details :items="ROLES" placeholder="Role"
          variant="solo-filled" />
      </v-col>
      <v-col cols="2">
        <v-select v-model="pickedSquad" clearable density="compact" hide-details :items="SQUADS" placeholder="Squad"
          variant="solo-filled" />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="o in operatorPool" :key="o.name" cols="auto">
        <operator-card :value="o.name" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorCard } from '@/components';
import { OPERATORS, ROLES, SQUADS } from '@/data';

// Define computed properties
const operatorPool = computed(() => OPERATORS.filter((o) => {
  // Apply selected filters
  if (pickedSpeed.value && o.speed !== pickedSpeed.value) return false;
  if (pickedRole.value && !o.roles.includes(pickedRole.value)) return false;
  if (pickedSquad.value && o.squad !== pickedSquad.value) return false;

  return true;
}));

const attackerPool = computed(() => operatorPool.value.filter((o) => o.side === 'ATT'));
const defenderPool = computed(() => operatorPool.value.filter((o) => o.side === 'DEF'));

// Define dynamic properties
const pickedRole = ref(null);
const pickedSpeed = ref(null);
const pickedSquad = ref(null);
const pickedOperator = ref(operatorPool.value[0].name);

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {"ATT" | "DEF" | null} [side] The side to pick the operator from.
 * 
 * If the picked operator is the same as previous, the function is re-run.
 */
function pickOperator(side = null) {
  // Get a random index from the operator pool
  const randomIndex = Math.floor(Math.random() * operatorPool.value.length);

  // Assign the new operator pick or re-run the function
  if (pickedOperator.value === operatorPool.value[randomIndex].name) pickOperator();
  else pickedOperator.value = operatorPool.value[randomIndex].name;
}
</script>
