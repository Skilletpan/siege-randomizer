<template>
  <v-card>
    <v-toolbar
      :color="displaySide.color"
      extension-height="64"
    >
      <!-- Title -->
      <v-toolbar-title class="mr-4 text-center">{{ title }}</v-toolbar-title>

      <!-- Tabs -->
      <template v-slot:extension>
        <v-tabs
          v-model="displaySideKey"
          class="w-100"
          fixed-tabs
        >
          <v-tab
            v-for="side in Side.LIST"
            :key="side.key"
            stacked
            :value="side.key"
          >
            <v-icon
              class="mb-1"
              :icon="side.icon"
            />
            {{ side.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <!-- Items -->
    <slot
      :items="displayItems"
      :side="displaySideKey"
    >
      <!-- Display Side name as fallback -->
      {{ displaySide.name }}
    </slot>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

import { Side } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The title of the side pool. */
  title: {
    required: true,
    type: String
  },

  /** The items in the side pool. */
  items: {
    required: true,
    type: Array
  },

  /** The key of the side to display by default. */
  defaultSide: {
    default: Side.ALL.key,
    type: String,
    validator: (v) => Side.KEYS.includes(v)
  },

  /** Whether items with side `ALL` should be displayed on `ATT` or `DEF` tabs. */
  strict: Boolean
});

/**
 * The key of the side to display.
 * @type {import('vue').Ref<String>}
 */
const displaySideKey = ref(props.defaultSide);

/**
 * The side to display.
 * @type {import('vue').ComputedRef<Side>}
 */
const displaySide = computed(() => Side.valueOf(displaySideKey.value));

/**
 * The items to display for the current `displaySide`.
 * @type {import('vue').ComputedRef<import('@/models').Model[]>}
 */
const displayItems = computed(() => props.items.filter((i) => {
  if (props.strict) return displaySide.value.includes(i.side);
  return displaySide.value.overlaps(i.side);
}));
</script>
