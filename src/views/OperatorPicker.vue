<template>
  <v-container>
    <!-- Operator Cards -->
    <v-row class="justify-center">
      <v-col
        v-for="i in settings.picks"
        :key="i"
        class="operator-card"
      >
        <operator-card
          v-if="pickedOperators[i - 1]"
          :operator-id="pickedOperators[i - 1]"
          portrait
        />

        <operator-card
          v-else
          placeholder
        />
      </v-col>
    </v-row>

    <v-row
      v-if="false"
      class="justify-center flex-nowrap pt-12"
    >
      <v-col
        v-for="i in settings.picks"
        :key="`portrait_${i}`"
        class="operator-card"
      >
        <operator-card
          v-if="pickedOperators[i - 1]"
          :operator-key="pickedOperators[i - 1]"
          @click="previewOperator(pickedOperators[i - 1])"
        />

        <operator-card
          v-else
          placeholder
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="justify-center pb-12">
      <v-col cols="auto">
        <!-- Randomize Buttons -->
        <v-btn
          v-for="side in Side.LIST"
          :key="`randomize_${side.key}`"
          class="mb-4 mx-2"
          :color="side.color"
          :disabled="!operatorPool.length"
          :icon="side.icon"
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
      <v-col cols="12">
        <side-pool
          :items="operatorPool"
          title="Operator Pool"
        >
          <template v-slot="{ items }">
            <v-card-text class="d-flex flex-wrap">
              <v-col
                v-for="operator in items"
                :key="operator.key"
                cols="3"
              >
                <operator-card
                  colored
                  :operator-key="operator.key"
                  @click="previewOperator(operator.key)"
                />
              </v-col>
            </v-card-text>

          </template>
        </side-pool>
      </v-col>
    </v-row>
  </v-container>

  <!-- Operator Filter Drawer -->
  <operator-filter-drawer
    ref="filterDrawer"
    v-model:duplicates="settings.duplicates"
  />

  <!-- Operator Preview Dialog -->
  <v-dialog
    v-model="previewDialog.show"
    width="300"
  >
    <operator-card
      detailed
      :operator-key="previewDialog.operatorKey"
      portrait
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorCard, OperatorFilterDrawer, SidePool } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { Side } from '@/models';

// Define dynamic properties
const filterDrawer = ref(null);

/**
 * The operators that have been picked by the randomizer.
 * 
 * @type {import('vue').Ref<import('@/models').Operator[]>}
 */
const pickedOperators = ref([]);
const previewDialog = ref({
  operatorKey: null,
  show: false
});
const settings = ref({
  duplicates: false,
  picks: 5
});

/**
 * The pool to pick operators from.
 * @type {import('vue').ComputedRef<import('@/models').Operator[]>}
 */
const operatorPool = computed(() => {
  if (filterDrawer.value) return filterDrawer.value.operatorPool;
  return [];
})

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {Side} side The side to pick the operator from.
 */
function pickOperator(side) {
  const { duplicates, picks } = settings.value;

  // Apply filters
  const pool = operatorPool.value
    .filter((o) => [
      side === Side.ALL || o.side === side,
      picks > 1 || pickedOperators.value.length !== 1 || o.key !== pickedOperators.value[0]
    ].every((isTrue) => isTrue))

  // Pick random operator
  pickedOperators.value.length = 0;
  pickedOperators.value = pickRandom(pool, picks, duplicates).map((o) => o.id);
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

<style scoped>
.operator-card {
  max-width: calc(100% / 5);
}</style>
