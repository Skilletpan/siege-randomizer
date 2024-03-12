<template>
  <!-- Operator Picker -->
  <v-autocomplete
    v-bind="$attrs"
    ref="search"
    :item-props="transformProps"
    :items="Operator.LIST"
    label="Operators"
    @update:model-value="$refs.search.search = null"
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

    <!-- Operator Item -->
    <template #item="{ props }">
      <v-list-item v-bind="props">
        <template #prepend>
          <operator-emblem :image="props.prependAvatar" />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { Operator } from '@/models';

/**
 * Transforms raw operators to list props.
 * 
 * @param {Operator} operator The operator item to transform.
 */
function transformProps(operator) {
  return {
    prependAvatar: operator.emblem,
    appendIcon: operator.side.icon
  }
}
</script>
