<template>
  <v-container>
    <v-row
      class="pt-12"
      justify="center"
    >
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
          @click="previewOperator(pickedOperators[i - 1])"
        />

        <!-- Placeholder Operator Card -->
        <operator-card
          v-else
          placeholder
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row
      class="pb-12"
      justify="center"
    >
      <v-col cols="auto">
        <!-- Randomize Buttons -->
        <v-btn
          v-for="{ icon, side } in SIDES"
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
    </v-row>

    <!-- Operator Pool -->
    <v-row>
      <template
        v-for="{ icon, side, sideName } in SIDES"
        :key="side"
      >
        <v-col
          v-if="side"
          cols="6"
        >
          <!-- Side Title -->
          <h2 class="mb-4 text-center">
            <v-icon
              :icon="icon"
              start
            />
            {{ sideName }}
          </h2>

          <!-- Operator Items -->
          <v-row>
            <v-col
              v-for="{ key, name } in operatorPool.filter((o) => o.side === side)"
              :key="key"
              cols="6"
            >
              <!-- Operator Card -->
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :prepend-avatar="loadEmblem(key)"
                  :title="name"
                  @click="previewOperator(key)"
                >
                  <!-- Ban Button -->
                  <template v-slot:append>
                    <v-btn
                      v-show="isHovering"
                      color="primary"
                      variant="text"
                      @click.stop="filterDrawer.addBan(key)"
                    >
                      Ban
                    </v-btn>
                  </template>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>

        <v-divider
          v-else
          vertical
        />
      </template>
    </v-row>
  </v-container>

  <!-- Operator Filter Drawer -->
  <operator-filter-drawer
    ref="filterDrawer"
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

import { OperatorCard, OperatorFilterDrawer } from '@/components';
import { loadEmblem } from '@/composables/imageLoader';
import { pickRandom } from '@/composables/randomizer';

// Define static properties
const SIDES = [
  { side: 'ATT', sideName: 'Attackers', icon: 'mdi-sword-cross' },
  { icon: 'mdi-infinity' },
  { side: 'DEF', sideName: 'Defenders', icon: 'mdi-chess-rook' }
];

// Define dynamic properties
const filterDrawer = ref(null);
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

/**
 * Opens a preview dialog for the selected operator.
 * 
 * @param {String} operatorKey The key of the operator to preview.
 */
function previewOperator(operatorKey) {
  previewDialog.value.operatorKey = operatorKey;
  previewDialog.value.show = true;
}
</script>
