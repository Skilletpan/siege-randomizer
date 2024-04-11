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
          :operator-key="pickedOperators[i - 1]"
          :placeholder="!pickedOperators[i - 1]"
          @click="previewOperator(pickedOperators[i - 1])"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row class="justify-center pb-12">
      <v-col cols="auto">
        <!-- Randomize Buttons -->
        <template
          v-for="side, index in [Side.ATT, {}, Side.DEF]"
          :key="index"
        >
          <v-btn
            class="mb-4 mx-2"
            :color="side.key ? AppSettings.colors[side.key] : 'side-all'"
            :disabled="!operatorPool.length"
            :icon="side.icon || '$siege-side-all'"
            size="x-large"
            @click="pickOperator(side.key)"
          />
        </template>

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
        v-for="side, index in Side.LIST"
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
            {{ side.name }}
          </h2>

          <!-- Operator Items -->
          <v-row>
            <v-col
              v-for="operator in mappedOperatorPool.filter((o) => o.side === side)"
              :key="operator.key"
              cols="6"
            >
              <!-- Operator Card -->
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :color="AppSettings.colors[operator.side.key]"
                  :prepend-avatar="operator.emblem"
                  :title="operator.name"
                  @click="previewOperator(operator.key)"
                >
                  <!-- Ban Button -->
                  <template v-slot:append>
                    <v-btn
                      v-show="isHovering"
                      color="primary"
                      variant="text"
                      @click.stop="filterDrawer.addBan(operator.key)"
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
          v-if="index === 0"
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
import { computed, ref } from 'vue';

import { OperatorCard, OperatorFilterDrawer } from '@/components';
import { pickRandom } from '@/composables/randomizer';
import { Operator, Side } from '@/models';
import { useAppSettings } from '@/stores';

const AppSettings = useAppSettings();

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
 * Maps the operator keys to their operator.
 * @type {import('vue').ComputedRef<Operator[]>}
 */
const mappedOperatorPool = computed(() => operatorPool.value.map((key) => Operator[key]));

/**
 * Picks a random operator from the operator pool.
 * 
 * @param {"ATT"|"DEF"} [side=null] The side to pick the operator from.
 */
function pickOperator(side = null) {
  const { duplicates, picks } = settings.value;
  const _side = Side[side];

  // Apply filters
  const pool = mappedOperatorPool.value
    .filter((o) => [
      !side || o.side === _side,
      picks > 1 || pickedOperators.value.length !== 1 || o.key !== pickedOperators.value[0]
    ].every((isTrue) => isTrue))
    .map((o) => o.key);

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

<style scoped>
.operator-card {
  max-width: calc(100% / 5);
}
</style>
