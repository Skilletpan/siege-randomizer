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
        :append-icon="Operator.valueOf(item.value).side.icon"
        :prepend-avatar="Operator.valueOf(item.value).emblem"
      />
    </template>
  </v-autocomplete>
</template>

<script setup>
import { Operator } from '@/models';
</script>
