<template>
  <!-- Squad Picker -->
  <v-select
    v-bind="$attrs"
    clearable
    density="comfortable"
    hide-details
    :items="Squad.LIST"
    item-title="name"
    item-value="key"
    label="Squad"
    persistent-placeholder
    placeholder="Select..."
    variant="solo-filled"
  >
    <!-- Squad Item -->
    <template v-slot:item="{ item, props }">
      <v-list-item
        v-bind="props"
        :prepend-avatar="Squad.valueOf(item.value).emblem"
      />
    </template>
  </v-select>
</template>

<script setup>
import { Squad } from '@/models';
</script>
