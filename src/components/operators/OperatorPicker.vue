<template>
  <!-- Operator Picker -->
  <v-autocomplete
    v-bind="$attrs"
    ref="search"
    :items="Operator.LIST"
    label="Operators"
    @update:model-value="$refs.search.search = null"
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

    <!-- Operator Item -->
    <template v-slot:item="{ item, props }">
      <v-list-item
        v-bind="props"
        :append-icon="toRaw(item.raw).side.icon"
        :prepend-avatar="toRaw(item.raw).emblem"
      />
    </template>
  </v-autocomplete>
</template>

<script setup>
import { toRaw } from 'vue';

import { Operator } from '@/models';
</script>
