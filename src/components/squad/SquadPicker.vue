<template>
  <v-select
    v-model="squad"
    clearable
    :items="Squad.LIST"
    item-title="name"
    item-value="key"
    label="Squad"
  >
    <!-- Prepend Avatar -->
    <template
      #append-inner
      v-if="squad"
    >
      <v-avatar
        :image="Squad[squad].emblem"
        rounded="0"
        size="small"
      />
    </template>

    <!-- Squad List Item -->
    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <template #append>
          <v-avatar
            :image="item.raw.emblem"
            rounded="0"
            size="small"
          />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import { shallowRef } from 'vue';

import { Squad } from '@/models';

/**
 * The key of the picked squad.
 * @type {import('vue').ShallowRef<String>}
 */
const squad = shallowRef(null);
</script>
