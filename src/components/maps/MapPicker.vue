<template>
  <!-- Map Picker -->
  <v-select
    v-bind="$attrs"
    :items="SiegeMap.LIST"
    label="Map"
  >
    <!-- Slot Passthrough -->
    <template
      v-for="(_, name) in $slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </v-select>
</template>

<script setup>
import { SiegeMap } from '@/models';
</script>
