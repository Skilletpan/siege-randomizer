<template>
  <!-- Squad Picker -->
  <v-select
    v-bind="$attrs"
    v-model="pickedSquad"
    :items="Squad.LIST"
    label="Squad"
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

    <!-- Squad Emblem -->
    <template
      v-slot:prepend-inner
      v-if="pickedSquad"
    >
      <v-avatar
        :image="Squad.valueOf(pickedSquad).emblem"
        rounded="0"
        size="small"
      />
    </template>

    <!-- Squad Item -->
    <template v-slot:item="{ item, props }">
      <v-list-item
        v-bind="props"
        :prepend-avatar="toRaw(item.raw).emblem"
      />
    </template>
  </v-select>
</template>

<script setup>
import { ref, toRaw } from 'vue';

import { Squad } from '@/models';

const pickedSquad = ref(null);
</script>
