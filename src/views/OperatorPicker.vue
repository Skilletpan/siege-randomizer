<template>
  <v-container class="pt-12">
    <v-row justify="center">
      <!-- Operator Cards -->
      <v-col
        v-for="i in settings.picks"
        :key="`portrait_${i}`"
        cols="auto"
      >
        <!-- Picked Operator Card -->
        <operator-card
          v-if="pickedOperators[i - 1]"
          :operator-key="pickedOperators[i - 1]"
          @click="previewDialog.operatorKey = pickedOperators[i - 1]; previewDialog.show = true;"
        />

        <!-- Placeholder Operator Card -->
        <operator-card
          v-else
          placeholder
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto">
        <!-- Randomize Buttons -->
        <v-btn
          v-for="{ icon, side } in SIDE_BUTTONS"
          :key="`randomize_${side || 'ALL'}`"
          class="mb-4 mx-2"
          color="primary"
          :disabled="!operatorPool.length"
          :icon="icon"
          size="x-large"
          @click="pickOperator(side)"
        />

        <!-- Pick Amount Slider -->
        <v-slider
          v-model="settings.picks"
          hide-details
          label="Pick Amount"
          max="5"
          min="1"
          show-ticks="always"
          step="1"
        />
      </v-col>

      <!-- Operator Pool Title -->
      <v-col
        class="text-center"
        cols="12"
        tag="h2"
      >
        Operator Pool
      </v-col>

      <!-- Operator Pool -->
      <v-col
        v-for="o in operatorPool"
        :key="o.key"
        cols="3"
      >
        <v-card
          class="align-center d-flex"
          @click="previewDialog.operatorKey = o.key; previewDialog.show = true;"
        >
          <v-col
            class="py-0"
            cols="auto"
          >
            <v-avatar rounded="0">
              <v-img
                :alt="`${o.name} emblem`"
                :src="loadEmblem(o.key)"
              />
            </v-avatar>
          </v-col>
          <v-col class="pa-0">
            <v-card-title class="pb-0 text-center">{{ o.name }}</v-card-title>
            <v-card-subtitle class="mb-2 text-center">{{ o.squad || 'None' }}</v-card-subtitle>
          </v-col>
          <v-col
            class="py-0"
            cols="auto"
          >
            <v-icon
              class="mx-1"
              :icon="o.side === 'ATT' ? 'mdi-sword-cross' : 'mdi-chess-rook'"
              size="32"
            />
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Operator Filter Drawer -->
  <operator-filter-drawer
    v-model:duplicates="settings.duplicates"
    @update:operators="operatorPool = $event"
  />

  <!-- Operator Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="auto"
  >
    <operator-card
      detailed
      :operator-key="previewDialog.operatorKey"
    />
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { OperatorCard, OperatorFilterDrawer, OperatorItem } from '@/components';
import { loadEmblem } from '@/composables/imageLoader';
import { pickRandom } from '@/composables/randomizer';

// Define static properties
const SIDE_BUTTONS = [
  { side: 'ATT', icon: 'mdi-sword-cross' },
  { side: null, icon: 'mdi-infinity' },
  { side: 'DEF', icon: 'mdi-chess-rook' }
];

// Define dynamic properties
const operatorPool = ref([]);
const pickedOperators = ref([]);

const previewDialog = ref({
  operatorKey: null,
  show: false
});

const settings = ref({
  duplicates: false,
  picks: 1
});

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {"ATT" | "DEF"} [side=null] The side to pick the operator from.
 */
function pickOperator(side = null) {
  const { duplicates, picks } = settings.value;

  // Apply filters
  const pool = operatorPool.value.filter((o) => {
    if (side && o.side !== side) return false;
    if (picks === 1 && pickedOperators.value.length === 1 && o.key === pickedOperators.value[0]) return false;
    return true;
  }).map((o) => o.key);

  // Pick random operator
  pickedOperators.value.length = 0;
  pickedOperators.value = pickRandom(pool, picks, duplicates);
}
</script>
