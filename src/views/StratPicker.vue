<template>
  <v-container>
    <v-row
      v-if="picks.strat"
      class="justify-center"
    >
      <!-- Picked Strat Card -->
      <v-col cols="9">
        <strat-card
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

      <v-btn
        icon="$filter"
        @click="showStratFilters = true"
      />
    </v-row>

    <!-- Strat Pool -->
    <v-row>
      <v-col cols="12">
        <side-pool
          :items="stratPool"
          title="Strat Pool"
        >
          <template #default="{ items, side }">
            <v-card-text class="d-flex flex-wrap">
              <v-col
                v-for="strat in items"
                :key="strat.id"
                cols="4"
              >
                <v-card
                  :color="strat.side.color"
                  :title="strat.title"
                  @click="previewStrat(strat, side)"
                >
                  <template #append>
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

  <strat-filter-drawer
    v-model="showStratFilters"
    v-model:required-tags="rawSettings.stratFilters.requiredTags"
    v-model:excluded-tags="rawSettings.stratFilters.excludedTags"
  />

  <!-- Strat Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="800"
  >
    <strat-card
      preview
      :side-key="previewDialog.side"
      :strat-id="previewDialog.strat"
    />
  </v-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { SidePool, StratCard, StratFilterDrawer } from '@/components';
import { Side, Strategy, StrategyTag } from '@/models';
import { useMatchSettings } from '@/store';

const { operatorBans } = storeToRefs(useMatchSettings());

const showStratFilters = ref(false);

// Define dynamic properties
const rawSettings = ref({
  stratFilters: {
    requiredTags: [],
    excludedTags: []
  }
});

const settings = computed(() => {
  const { stratFilters: { requiredTags, excludedTags } } = rawSettings.value;

  return {
    stratFilters: {
      requiredTags: requiredTags.map((t) => StrategyTag.valueOf(t)),
      excludedTags: excludedTags.map((t) => StrategyTag.valueOf(t))
    }
  };
});

const picks = ref({
  side: null,
  strat: null
});

const previewDialog = ref({
  show: false,
  side: null,
  strat: null
});

const stratPool = computed(() => {
  const { ALL: bannedOperators } = operatorBans.value;
  const { stratFilters: { requiredTags, excludedTags } } = settings.value;

  return Strategy.LIST.filter((s) => {
    // Filter by tags
    if (requiredTags.length && requiredTags.some((t) => !s.tags.includes(t))) return false;
    if (s.tags.some((t) => excludedTags.includes(t))) return false;

    // Check for banned operators
    const hasBans = s.side.included.every((si) => {
      // Check for banned required operators
      const bannedRequired = s.requiredOperators[si.key].filter((o) => bannedOperators.includes(o));
      if (bannedRequired.length) return true;

      // Check for banned allowed operators
      const bannedAllowed = s.allowedOperators[si.key].filter((o) => bannedOperators.includes(o));
      if (bannedAllowed.length && (s.allowedOperators[si.key].length - bannedAllowed.length < 5)) return true;

      return false;
    });
    if (hasBans) return false;

    return true;
  });
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

  const pick = Strategy.pickRandom(pool);
  console.debug(pick);

  picks.value.strat = pick.id;
}

/**
 * Opens a preview dialog displaying the provided strat.
 * 
 * @param {Strategy} strat The strat to display.
 */
function previewStrat(strat, sideKey = null) {
  const side = Side.valueOf(sideKey)?.included[0];

  previewDialog.value.strat = strat.id;
  previewDialog.value.side = side?.key;
  previewDialog.value.show = true;
}
</script>
