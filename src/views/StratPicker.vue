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
          v-for="side in Side.SIDES"
          :key="side.key"
          class="mx-2"
          :color="side.color"
          :icon="side.icon"
          size="x-large"
          @click="pickRandomStrat(side)"
        />
      </v-col>
    </v-row>

    <!-- Strat Pool -->
    <v-row>
      <v-col cols="12">
        <side-pool
          :items="stratPool"
          title="Strat Pool"
        >
          <template v-slot="{ items }">
            <v-card-text class="d-flex flex-wrap">
              <v-col
                v-for="strat in items"
                :key="strat.id"
                cols="3"
              >
                <v-card
                  :color="strat.side.color"
                  :title="strat.title"
                  @click="previewDialog.strat = strat.id; previewDialog.show = true;"
                >
                  <template v-slot:append>
                    <v-icon :icon="strat.side.icon" />
                  </template>
                </v-card>
              </v-col>
            </v-card-text>
          </template>
        </side-pool>
      </v-col>
    </v-row>
  </v-container>

  <strat-filter-drawer ref="filterDrawer" />

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
import { computed, ref } from 'vue';

import { SidePool, StratCard, StratFilterDrawer } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { Side } from '@/models';

// Define dynamic properties
const picks = ref({
  side: null,
  strat: null
});

const previewDialog = ref({
  show: false,
  strat: null
});

const filterDrawer = ref(null);

/** @type {import('vue').ComputedRef<import('@/models/Strategy').default[]>} */
const stratPool = computed(() => {
  if (filterDrawer.value) return filterDrawer.value.stratPool;
  return [];
});

/**
 * Picks a random strategy from the pool.
 * 
 * @param {Side} side The side to pick the strat for.
 */
function pickRandomStrat(side) {
  picks.value.side = side.key;

  const pool = stratPool.value.filter((s) => {
    if (!s.side.includes(side)) return false;
    if (s === picks.value.strat) return false;

    return true;
  });

  const pick = pickRandom(pool);
  console.debug(pick);

  picks.value.strat = pick[0].id;
}
</script>
