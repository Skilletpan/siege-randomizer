<template>
  <v-card variant="elevated">
    <v-toolbar
      class="text-center"
      :color="displaySide.color"
      extension-height="64"
      :title="props.title"
    >
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
  }
});

/** @type {import('vue').Ref<string>} */
const displaySideKey = ref(Side.ALL.key);

/** @type {import('vue').ComputedRef<Side>} */
const displaySide = computed(() => Side.valueOf(displaySideKey.value));

/** @type {import('vue').ComputedRef<import('@/models').Model[]>} */
const displayItems = computed(() => props.items.filter((i) => displaySide.value.includes(i.side)));
</script>
