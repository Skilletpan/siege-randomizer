<template>
  <v-container>
    <v-row class="py-12" justify="center">
      <v-col cols="auto">
        <strat-card :side="pickedSide" :value="pickedStrat" />
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
const pickedSide = ref(undefined);
const pickedStrat = ref(undefined);

/**
 * Picks a random strategy from the pool.
 * 
 * @param {"ATT" | "DEF"} side The side to pick the strat for.
 */
function pickRandomStrat(side) {
  pickedSide.value = side;

  const pool = STRATS.filter((s) => {
    return s.title === 'Santa Claus';

    // if (pickedStrat.value && s.title === pickedStrat.value.title) return false;
    // return s.sides.includes(side);
  });

  [pickedStrat.value] = pickRandom(pool);
}
</script>
