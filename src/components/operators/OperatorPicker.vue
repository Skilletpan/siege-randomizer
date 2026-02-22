<template>
  <v-autocomplete
    v-model="picked"
    v-model:search="search"
    auto-select-first
    clearable
    :clear-on-select="multiple"
    :items="items"
    item-title="name"
    item-value="key"
    label="Operator"
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

    <template #item="{ index, item, props: p }">
      <!-- Operator Side Subheader -->
      <template v-if="subheaders[index]">
        <v-divider v-if="index > 0" />
        <v-list-subheader
          class="mb-n2"
          :title="subheaders[index]"
        />
      </template>

      <!-- Operator Item -->
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
import { computed, shallowRef, toRaw } from 'vue';

import { Operator, Side } from '@/models';

/**
 * The key(s) of the picked operator(s).
 * @type {import('vue').ModelRef<String | String[]>}
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
 * The current search value.
 * @type {import('vue').ShallowRef<String>}
 */
const search = shallowRef(null);

/**
 * The subheaders and their index for the selection list.
 * @type {import('vue').ComputedRef<{ [index: number]: string }>}
 */
const subheaders = computed(() => {
  // Filter selection by search value
  const searchValue = search.value?.toLowerCase() || '';
  const selection = props.items.filter((operator) => operator.name.toLowerCase().includes(searchValue));

  // Find and return subheaders
  return {
    [selection.findIndex((operator) => operator.side === Side.ATT)]: 'Attackers',
    [selection.findIndex((operator) => operator.side === Side.DEF)]: 'Defenders'
  }
});
</script>
