<template>
  <v-container>
    <v-row
      class="py-12"
      justify="center"
    >
      <!-- Picked Strat Card -->
      <v-col
        v-if="picks.strat"
        cols="auto"
      >
        <strat-card
          :side="picks.side"
          :strat="picks.strat"
        />
      </v-col>

      <!-- Randomize Buttons -->
      <v-col
        align="center"
        cols="12"
      >
        <v-btn
          v-for="s in ['ATT', 'DEF']"
          :key="s"
          class="mx-2"
          color="primary"
          :icon="s === 'ATT' ? 'mdi-sword-cross' : 'mdi-chess-rook'"
          size="x-large"
          @click="pickRandomStrat(s)"
        />
      </v-col>

      <!-- Strat Pool Title -->
      <v-col
        class="text-center"
        cols="12"
        tag="h2"
      >
        Strat Pool
      </v-col>

      <!-- Strat Pool Cards -->
      <v-col
        v-for="(s, index) in STRATS"
        :key="index"
        cols="4"
      >
        <v-card
          class="align-center d-flex"
          @click="previewDialog.strat = s; previewDialog.show = true;"
        >
          <!-- Strat Name and Description -->
          <v-col class="pa-0">
            <v-card-title class="align-center d-flex flex-nowrap pb-0">{{ s.title }}</v-card-title>
            <v-card-subtitle class="mb-2">{{ s.description }}</v-card-subtitle>
          </v-col>

          <!-- Strat Side Icons -->
          <v-col
            v-for="si in s.sides"
            :key="si"
            cols="auto"
          >
            <v-icon :icon="si === 'ATT' ? 'mdi-sword-cross' : 'mdi-chess-rook'" />
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Strat Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="auto"
  >
    <strat-card
      preview
      :side="previewDialog.strat.sides[0]"
      :strat="previewDialog.strat"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { StratCard } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { STRATS } from '@/data';

// Define dynamic properties
const picks = ref({
  side: null,
  strat: null
});

const previewDialog = ref({
  show: false,
  strat: null
});

/**
 * Picks a random strategy from the pool.
 * 
 * @param {"ATT" | "DEF"} side The side to pick the strat for.
 */
function pickRandomStrat(side) {
  picks.value.side = side;

  const pool = STRATS.filter((s) => {
    if (picks.value.strat && s.title === picks.value.strat.title) return false;
    return s.sides.includes(side);
  });

  [picks.value.strat] = pickRandom(pool);
}
</script>
