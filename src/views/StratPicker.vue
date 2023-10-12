<template>
  <v-container>
    <v-row
      class="pt-12"
      justify="center"
    >
      <!-- Picked Strat Card -->
      <v-col cols="auto">
        <strat-card
          v-if="picks.strat"
          :side="picks.side"
          :strat="picks.strat"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row
      class="pb-12"
      justify="center"
    >
      <!-- Randomize Buttons -->
      <v-col cols="auto">
        <v-btn
          v-for="{ sideKey, icon } in SIDE_LIST.filter((s) => !!s.sideKey)"
          :key="sideKey"
          class="mx-2"
          color="primary"
          :icon="icon"
          size="x-large"
          @click="pickRandomStrat(sideKey)"
        />
      </v-col>
    </v-row>

    <!-- Strat Pool -->
    <v-row>
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
        v-for="(strat, index) in STRATS"
        :key="index"
        cols="3"
      >
        <v-card
          :title="strat.title"
          @click="previewDialog.strat = strat; previewDialog.show = true;"
        >
          <template v-slot:append>
            <v-icon :icon="SIDES[strat.side].icon" />
          </template>
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
      :strat="previewDialog.strat"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { StratCard } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { SIDES, SIDE_LIST, STRATS } from '@/data';

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
    return s.side === side || s.side === SIDES.ALL.key;
  });

  [picks.value.strat] = pickRandom(pool);
}
</script>
