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

    <!-- Selection Text Replacer -->
    <template
      v-slot:selection="{ index: i }"
      v-if="props.selectionText"
    >
      <template v-if="i === 0">{{ props.selectionText }}</template>
    </template>

    <!-- Operator Item -->
    <template v-slot:item="{ item, props: p }">
      <v-list-item
        v-bind="p"
        :append-icon="Operator.valueOf(item.value).side.icon"
        :prepend-avatar="Operator.valueOf(item.value).emblem"
      />
    </template>
  </v-autocomplete>
</template>

<script setup>
import { Operator } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** A text to display in place of the default selection text. */
  selectionText: {
    type: String
  }
})
</script>
