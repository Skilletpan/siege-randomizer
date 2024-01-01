<template>
  <div>
    <!-- Field Label -->
    <v-label
      class="d-block mb-1 text-caption"
      :text="label"
    />

    <!-- Item Label Container -->
    <v-row
      class="ma-n1"
      no-gutters
    >
      <slot :items="items">
        <!-- Item Label -->
        <v-chip
          v-for="item, index in items"
          :key="index"
          v-bind="labelProps"
          class="ma-1"
          label
          size="small"
          :text="typeof item === 'object' ? item[textKey] : item"
        />
      </slot>
    </v-row>
  </div>
</template>

<script setup>
// eslint-disable-next-line
const props = defineProps({
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

  /** Props to assign to the item label. */
  labelProps: {
    default: () => ({}),
    type: Object
  },

  /** The name of the text prop on items. */
  textKey: {
    default: 'name',
    type: String
  }
});
</script>
