<template>
  <v-container>
    <!-- Operator Cards -->
    <v-row class="justify-center flex-nowrap pt-12">
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
      <template
        v-for="side in Side.SIDES"
        :key="side.key"
      >
        <v-col>
          <!-- Side Title -->
          <h2 class="mb-4 text-center">
            <v-icon
              :icon="side.icon"
              size="small"
              start
            />
            {{ side.title }}
          </h2>

          <!-- Operator Items -->
          <v-row>
            <v-col
              v-for="operator in operatorPool.filter((o) => o.side === side)"
              :key="operator.id"
              cols="6"
            >
              <!-- Operator Card -->
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :prepend-avatar="operator.emblem"
                  :title="operator.name"
                  @click="previewOperator(operator.id)"
                >
                  <!-- Ban Button -->
                  <template v-slot:append>
                    <v-btn
                      v-show="isHovering"
                      color="primary"
                      variant="text"
                      @click.stop="filterDrawer.addBan(operator.id)"
                    >
                      Ban
                    </v-btn>
                  </template>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>

        <!-- <v-divider
          v-else
          vertical
        /> -->
      </template>
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
    width="auto"
  >
    <operator-card
      detailed
      :operator-key="previewDialog.operatorKey"
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

import { OperatorCard, OperatorFilterDrawer } from '@/components';
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
  picks: 1
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
}
</style>
