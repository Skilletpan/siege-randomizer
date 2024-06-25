<template>
  <v-select
    v-model="picks"
    clearable
    :items="items"
    item-title="name"
    item-value="key"
    label="Weapon Class"
    :multiple
  >
    <!-- Selection Text -->
    <template #selection="{ index, item }">
      <template v-if="index === 0">
        <template v-if="picks.length > 1">{{ picks.length }} selected</template>
        <template v-else>{{ item.title }}</template>
      </template>
    </template>
  </v-select>
</template>

<script setup>
import { computed } from 'vue';

import { WeaponClass } from '@/models';

/**
 * The key(s) of the picked weapon class(es).
 * @type {import('vue').ComputedRef<String | String[]>}
 */
const picks = defineModel({
  default: (_props) => {
    if (_props.multiple) return [];
    return null;
  },
  type: [String, Array],
  validator: (v, _props) => {
    const keys = Object.keys(WeaponClass);

    if (_props.multiple) return v.every((_v) => keys.includes(_v));
    return keys.includes(v);
  }
});

/**
 * The component props.
 * @type {{ readonly multiple: boolean, readonly primary: boolean, readonly secondary: boolean }}
 */
const props = defineProps({
  /** Whether to allow multiple picks. */
  multiple: Boolean,

  /** Whether to only pick from primary weapons. */
  primary: Boolean,

  /** Whether to only pick from secondary weapons. */
  secondary: Boolean
});

/**
 * The items to pick from.
 * @type {import('vue').ComputedRef<WeaponClass[]>}
 */
const items = computed(() => {
  if (props.primary) return WeaponClass.LIST.filter((weaponClass) => weaponClass.isPrimary);
  if (props.secondary) return WeaponClass.LIST.filter((weaponClass) => weaponClass.isSecondary);
  return WeaponClass.LIST;
});
</script>
