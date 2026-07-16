<template>
  <v-autocomplete
    v-model="picked"
    clearable
    :clear-on-select="multiple"
    :items="pickerItems"
    item-title="name"
    item-value="key"
    label="Operator"
    :list-props="{ class: 'pt-0' }"
    :multiple="multiple"
  >
    <!-- Operator Avatar -->
    <template
      #append-inner
      v-if="picked && !multiple"
    >
      <v-avatar
        color="transparent"
        :image="Operator[picked].emblem"
        tile
      />
    </template>

    <!-- Selection Text -->
    <template
      #selection="{ index, item }"
      v-if="multiple"
    >
      <template v-if="index === 0">
        <template v-if="picked.length > 1">{{ picked.length }} selected</template>
        <template v-else>{{ item.title }}</template>
      </template>
    </template>

    <!-- Side Subheaders (Picker List) -->
    <template #subheader="{ props: p }">
      <v-list-subheader
        v-bind="p"
        sticky
      />
    </template>

    <!-- Operator Avatar (Picker List) -->
    <template #item="{ item, props: p }">
      <v-list-item v-bind="p">
        <template #prepend>
          <v-avatar
            color="transparent"
            :image="toRaw(item.raw).emblem"
            tile
          />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { computed, toRaw } from 'vue';

import { Operator } from '@/models';

/**
 * The key(s) of the picked operator(s).
 * @type {import('vue').ModelRef<string | string[]>}
 */
const picked = defineModel({
  default: (_props) => {
    if (_props.multiple) return [];
    return null;
  },
  type: [String, Array],
  validator: (v, _props) => {
    const keys = Object.keys(Operator);

    if (_props.multiple) return v.every((_v) => keys.includes(_v));
    return keys.includes(v);
  }
});

/**
 * The props of the component.
 * @type {{ readonly items: Operator[], readonly multiple: boolean }}
 */
const props = defineProps({
  /** The list of operators to pick from. */
  items: {
    default: Operator.LIST,
    type: Array,
    validator: (v) => v.every((_v) => _v instanceof Operator)
  },

  /** Whether multiple operators can be picked. */
  multiple: Boolean
});

/**
 * The items to render in the picker list.
 * @type {Operator | [{ title: string, type: 'subheader' }, Operator]}
 */
const pickerItems = computed(() => props.items.flatMap((operator, index, items) => {
  // Add subheader when operator side changes
  if (operator.side !== items[index - 1]?.side) return [
    { title: operator.side.name, type: 'subheader' },
    operator
  ];

  return operator;
}));
</script>
