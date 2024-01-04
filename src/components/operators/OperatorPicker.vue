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
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>

    <!-- Operator Item -->
    <template #item="{ item, props }">
      <v-list-item
        v-bind="props"
        :append-icon="toRaw(item.raw).side.icon"
        :prepend-avatar="toRaw(item.raw).emblem"
      />
    </template>
  </v-autocomplete>
</template>

<script setup>
import { Operator } from '@/models';

/**
 * Transforms raw operators to list props.
 * 
 * @param {Operator} operator The operator item to transform.
 * 
 * @todo Check when Vuetify fixed their `prependAvatar` bug.
 * @see https://github.com/vuetifyjs/vuetify/issues/18933
 */
// eslint-disable-next-line
function transformProps(operator) {
  return {
    prependAvatar: operator.emblem,
    appendIcon: operator.side.icon
  }
}
</script>
