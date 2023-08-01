<template>
  <v-container>
    <v-row class="py-12" justify="center">
      <v-col cols="auto">
        <strat-card />
        {{ pickedStrat ? pickedStrat.title : 'None' }}
        <v-btn text="Pick Attack Strat" @click="pickRandomStrat('ATT')" />
        <v-btn text="Pick Defense Strat" @click="pickRandomStrat('DEF')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

import { StratCard } from '@/components';
import { STRATS } from '@/data';

const pickedStrat = ref(0);

function pickRandomStrat(side) {
  const pool = STRATS.filter((s) => s.sides.includes(side));

  const randomIndex = Math.floor(Math.random() * pool.length);
  pickedStrat.value = pool[randomIndex];
}
</script>
