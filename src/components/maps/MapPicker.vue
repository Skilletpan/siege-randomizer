<template>
  <!-- Map Picker -->
  <v-select
    v-bind="$attrs"
    clearable
    density="comfortable"
    hide-details
    :items="Map.LIST"
    item-title="name"
    item-value="key"
    label="Map"
    persistent-placeholder
    placeholder="Select..."
    variant="solo-filled"
  >
    <!-- Slot Passhtrough -->
    <template
      v-for="(_, name) in $slots"
      v-slot:[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </v-select>
</template>

<script setup>
import { Map } from '@/models';
</script>
