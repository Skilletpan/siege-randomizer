<template>
  <!-- Squad Picker -->
  <v-select
    v-bind="$attrs"
    v-model="pick"
    :item-props="transformProps"
    :items="items"
    :label="label"
    :multiple="multiple"
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

    <!-- Squad Emblem -->
    <template
      v-if="pick && !multiple"
      #prepend-inner
    >
      <squad-emblem :image="Squad.valueOf(pick).emblem" />
    </template>

    <!-- Squad Item -->
    <template #item="{ props: p }">
      <v-list-item v-bind="p">
        <template #prepend>
          <squad-emblem :image="p.prependAvatar" />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import { Squad } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  /** The items to pick a squad from. */
  items: {
    default: Squad.LIST,
    type: Array,
    validator: (value) => value.every((v) => Squad.LIST.includes(v))
  },

  /** The label for the picker. */
  label: {
    default: 'Squad',
    type: String
  },

  /** Whether multiple squads can be picked. */
  multiple: Boolean
});

/**
 * The key of the currently picked squad(s).
 * @type {import('vue').Ref<String|String[]>}
 */
// eslint-disable-next-line
const pick = defineModel({
  default: null,
  type: [String, Array]
});

/**
 * Transforms raw squads to list props.
 * 
 * @param {Squad} squad The squad item to transform.
 */
function transformProps(squad) {
  return {
    prependAvatar: squad.emblem
  }
}
</script>
