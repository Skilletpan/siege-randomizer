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
          :side-key="picks.side"
          :strat-id="picks.strat"
        />

        <!-- Placeholder Loader -->
        <v-skeleton-loader
          v-else
          boilerplate
          type="heading, subtitle, divider, list-item-avatar@3"
          width="800"
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
          v-for="side in Side.LIST"
          :key="side.key"
          class="mx-2"
          color="primary"
          :icon="side.icon"
          size="x-large"
          @click="pickRandomStrat(side)"
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
        v-for="strat in Strat.LIST"
        :key="strat.id"
        cols="3"
      >
        <v-card
          :title="strat.title"
          @click="previewDialog.strat = strat.id; previewDialog.show = true;"
        >
          <template v-slot:append>
            <v-icon :icon="strat.side?.icon || '$siege-side-all'" />
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
      :strat-id="previewDialog.strat"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { StratCard } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { Side, Strat } from '@/models';

/**
 * The picked strat values.
 * @type {import('vue').Ref<{ side: "ATT"|"DEF", strat: number }>}
 */
const picks = ref({
  side: null,
  strat: null
});

/**
 * The preview dialog values.
 * @type {import('vue').Ref<{ show: boolean, strat: number }>}
 */
const previewDialog = ref({
  show: false,
  strat: null
});

/**
 * Picks a random strategy from the pool.
 * 
 * @param {Side} side The side to pick the strat for.
 */
function pickRandomStrat(side) {
  picks.value.side = side.key;

  const pool = Strat.LIST.filter((strat) => {
    if (strat.id === picks.value.strat) return false;
    return !strat.side || strat.side === side;
  });

  picks.value.strat = pickRandom(pool)[0].id;
}
</script>
