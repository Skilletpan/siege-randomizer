<template>
  <base-display :label="{ value: label, props: { class: 'mb-1' } }">
    <v-row class="ma-n1">
      <slot :items="items">
        <v-chip
          v-for="item, index in items"
          :key="index"
          v-bind="chipProps"
          class="ma-1"
          label
          size="small"
          :text="typeof item === 'object' ? item[textKey] : item"
        />
      </slot>
    </v-row>
  </base-display>
</template>

<script setup>
import BaseDisplay from './BaseDisplay';

// eslint-disable-next-line
const props = defineProps({
  /** Props to assign to the item label. */
  chipProps: {
    default: () => ({}),
    type: Object
  },

  /** The items to display. */
  items: {
    required: true,
    type: Array
  },

  /** The field label. */
  label: {
    required: true,
    type: String
  },

  /** The name of the text prop on items. */
  textKey: {
    default: 'name',
    type: String
  }
});
</script>
