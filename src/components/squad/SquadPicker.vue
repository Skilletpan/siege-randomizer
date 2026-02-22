<template>
  <v-select
    v-model="picked"
    clearable
    :items="Squad.LIST"
    item-title="name"
    item-value="key"
    label="Squad"
  >
    <!-- Squad Avatar -->
    <template
      #append-inner
      v-if="picked"
    >
      <v-avatar
        color="transparent"
        :image="Squad[picked].emblem"
        size="small"
        tile
      />
    </template>

    <!-- Squad List Item -->
    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <template #append>
          <v-avatar
            color="transparent"
            :image="item.raw.emblem"
            size="small"
            tile
          />
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import { Squad } from '@/models';

/**
 * The key(s) of the picked squad(s);
 * @type {import('vue').ModelRef<String>}
 */
const picked = defineModel({
  type: String,
  validator: (v) => Object.keys(Squad).includes(v)
});
</script>
