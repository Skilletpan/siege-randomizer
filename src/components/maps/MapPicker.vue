<template>
  <!-- Map Picker -->
  <v-select
    v-bind="$attrs"
    :items="Map.LIST"
    label="Map"
  >
    <!-- Slot Passthrough -->
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
