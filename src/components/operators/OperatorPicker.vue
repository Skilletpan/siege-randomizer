<template>
  <!-- Operator Picker -->
  <v-autocomplete
    v-bind="$attrs"
    ref="search"
    clearable
    density="comfortable"
    hide-details
    :items="Operator.LIST"
    item-title="name"
    item-value="key"
    label="Operators"
    persistent-placeholder
    placeholder="Select..."
    variant="solo-filled"
    @update:model-value="$refs.search.search = null"
  >
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
