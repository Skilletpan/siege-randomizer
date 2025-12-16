<template>
  <v-card-item class="px-2 py-3">
    <!-- Emblem -->
    <template #prepend>
      <v-avatar
        :image="operator.emblem.href"
        tile
      />
    </template>

    <!-- Alias -->
    <v-card-title class="font-weight-bold text-center">{{ operator.alias }}</v-card-title>

    <!-- Side Icon -->
    <template #append>
      <v-avatar
        :color="operator.side.color"
        :icon="operator.side.icon"
        tile
        variant="text"
      />
    </template>
  </v-card-item>
</template>

<script setup lang="ts">
import type { Operator } from '@/models';

// Props
defineProps<{
  /** The operator to display. */
  operator: Operator
}>();
</script>