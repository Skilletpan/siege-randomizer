<template>
  <v-card variant="elevated">
    <v-toolbar
      :color="displaySide.color"
      extension-height="64"
    >
      <v-toolbar-title class="mr-4 text-center">{{ props.title }}</v-toolbar-title>
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

    <slot
      :items="displayItems"
      :side="displaySideKey"
    >
      {{ Side.valueOf(displaySideKey).name }}
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

  /** Whether distinct sides should only show items of this side. */
  distinct: {
    type: Boolean
  }
});

/** @type {import('vue').Ref<string>} */
const displaySideKey = ref(Side.ALL.key);

/** @type {import('vue').ComputedRef<Side>} */
const displaySide = computed(() => Side.valueOf(displaySideKey.value));

/** @type {import('vue').ComputedRef<import('@/models').Model[]>} */
const displayItems = computed(() => props.items.filter((i) => {
  if (props.distinct) return displaySide.value.includes(i.side);
  return displaySide.value.overlaps(i.side);
}));
</script>
