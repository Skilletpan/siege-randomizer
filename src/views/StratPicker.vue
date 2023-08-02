<template>
  <v-container>
    <v-row class="py-12" justify="center">
      <v-col cols="auto">
        <strat-card :value="pickedStrat" />
        <v-btn block class="mt-4" color="primary" text="Pick Attack Strat" @click="pickRandomStrat('ATT')" />
        <v-btn block class="mt-4" color="primary" text="Pick Defense Strat" @click="pickRandomStrat('DEF')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

import { StratCard } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { STRATS } from '@/data';

// Define dynamic properties
const pickedStrat = ref(null);

/**
 * Picks a random strategy from the pool.
 * 
 * @param {"ATT" | "DEF"} side The side to pick the strat for.
 */
function pickRandomStrat(side) {
  const pool = STRATS.filter((s) => s.sides.includes(side));
  [pickedStrat.value] = pickRandom(pool);
}
</script>
