<template>
  <v-card width="800">
    <!-- Title and Tagline -->
    <v-card-item
      :append-icon="side.icon"
      class="mb-n1 px-4 py-3"
      :subtitle="strat.tagline"
      :title="strat.title"
    />

    <!-- Required Operators -->
    <template v-if="strat.requiredOperators[side.key]?.length">
      <v-divider />
      <v-card-item class="pb-3 pt-2 px-4">
        <v-label
          class="d-block mb-1 text-caption"
          text="Required Operators"
        />
        <div class="ma-n1">
          <operator-label
            v-for="operator in strat.requiredOperators[side.key]"
            :key="operator.key"
            v-model="operator.key"
            class="ma-1"
          />
        </div>
      </v-card-item>
    </template>

    <!-- Allowed / Banned Operators -->
    <template v-if="strat.bannedOperators[side.key]?.length">
      <v-divider />
      <v-tabs
        v-model="operatorTab"
        density="comfortable"
        :items="OPERATOR_TABS"
      />

      <v-window v-model="operatorTab">
        <v-window-item
          v-for="tab, index in OPERATOR_TABS"
          :key="tab"
          :value="tab"
        >
          <v-card-item class="px-4 py-3">
            <div class="ma-n1">
              <operator-label
                v-for="operator in strat[['allowedOperators', 'bannedOperators'][index]][side.key]"
                :key="operator.key"
                v-model="operator.key"
                class="ma-1"
                :negative="index === 1"
              />
            </div>
          </v-card-item>
        </v-window-item>
      </v-window>
    </template>

    <!-- Rules -->
    <v-divider />
    <v-card-item class="py-2 px-4">
      <v-label
        class="d-block text-caption"
        text="Rules"
      />
    </v-card-item>
    <v-card-item
      v-for="rule, index in strat.rules"
      :key="index"
      class="pb-3 pl-3 pr-4 pt-0"
      density="comfortable"
      v-show="!rule.side || rule.side === side || rule.operator?.side === side"
    >
      <template #prepend>
        <v-avatar
          icon="$siege-operators"
          :image="rule.operator?.emblem"
          rounded="0"
        />
      </template>

      {{ rule.text }}
    </v-card-item>

    <!-- Preview Actions -->
    <template v-if="preview && !strat.side">
      <v-divider />
      <v-card-actions>
        <v-spacer />

        <!-- Side Toggle -->
        <v-btn
          :color="AppSettings.colors[side.opposite.key]"
          :prepend-icon="side.opposite.icon"
          :text="`View ${side.opposite.name} Version`"
          @click="side = side.opposite.key"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import { shallowReadonly, shallowRef, watch } from 'vue';

import { Side, Strat } from '@/models';
import { useAppSettings } from '@/stores';

import OperatorLabel from '../operators/OperatorLabel';

// Register composables
const AppSettings = useAppSettings();

/**
 * The strat to display.
 * @type {import('vue').ModelRef<Strat>}
 */
const strat = defineModel({
  get: (stratId) => Strat[stratId],
  required: true,
  type: Number,
  validator: (v) => Object.keys(Strat).includes(String(v))
});

/**
 * The side of the strat to display.
 * @type {import('vue').ModelRef<Side>}
 */
const side = defineModel('side', {
  default: Side.ATT.key,
  get: (sideKey) => sideKey ? Side[sideKey] : null,
  type: String,
  validator: (v) => Object.keys(Side).includes(v)
});

/**
 * The props of the component.
 * @type {{ readonly preview: boolean }}
 */
const props = defineProps({
  /** Whether the strat is being previewed. */
  preview: Boolean
});

/**
 * The available operator tabs.
 * @type {readonly string[]}
 */
const OPERATOR_TABS = shallowReadonly(['ALLOWED OPERATORS', 'BANNED OPERATORS']);

/**
 * The operator tab to display.
 * @type {import('vue').ShallowRef<String>}
 */
const operatorTab = shallowRef(null);

// Update the default preview side and operator tab on strat change
watch(strat, (newStrat) => {
  const { allowedOperators, bannedOperators, side: stratSide } = newStrat;

  if (newStrat) {
    // Set initial preview side
    if (props.preview) side.value = stratSide?.key || Side.ATT.key;

    // Set initial operator tab
    const hasMoreAllowed = allowedOperators[side.value.key].length > bannedOperators[side.value.key].length;
    operatorTab.value = OPERATOR_TABS[Number(hasMoreAllowed)];
  }
}, { immediate: true });
</script>
