<template>
  <!-- Strategy Tag Picker -->
  <v-select
    v-bind="$attrs"
    v-model="items"
    chips
    closable-chips
    :density="items.length ? 'default' : 'comfortable'"
    :items="StrategyTag.LIST"
    label="Tags"
    multiple
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

    <!-- Strategy Tag Chip -->
    <template #chip="{ item, props: p }">
      <v-chip
        v-bind="p"
        :color="props.banned ? 'error' : null"
        label
      >
        <span :class="{ 'text-decoration-line-through': props.banned }">{{ item.title }}</span>
      </v-chip>
    </template>

    <template #item="{ item, props: p }">
      <v-list-item v-bind="p">
        <template #append>
          <v-tooltip
            location="start center"
            :text="item.raw.description"
          >
            <template #activator="{ props: p2 }">
              <v-icon
                v-bind="p2"
                icon="$info"
              />
            </template>
          </v-tooltip>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import { shallowRef } from 'vue';

import { StrategyTag } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  banned: Boolean
});

/**
 * The picked strategy tag keys.
 * @type {import('vue').ShallowRef<String[]>}
 */
const items = shallowRef([]);
</script>
