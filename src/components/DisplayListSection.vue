<template>
  <div
    class="d-flex flex-column"
    :class="`ga-${gap} pa-${padding}`"
  >
    <!-- Label -->
    <v-divider v-if="label">
      <h5 class="text-uppercase">{{ label }}</h5>
    </v-divider>

    <!-- Content Slot -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { label, gap = 3, padding = 3 } = defineProps<{
  /** The label of the display list section. */
  label?: string;

  /** The gap between items of the display list section. */
  gap?: number;

  /** The padding of the display list section. */
  padding?: number;
}>();
</script>
