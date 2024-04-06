<template>
  <v-navigation-drawer
    v-bind="$attrs"
    location="right"
    order="1"
    temporary
    width="350"
  >
    <v-list>
      <!-- Strategy Filters -->
      <v-list-subheader>Strategy Details</v-list-subheader>

      <!-- Required Tags -->
      <v-list-item class="mb-1">
        <tag-picker
          v-model="filters.requiredTags"
          :items="requiredTagItems"
          label="Required Tags"
          @update:model-value="emit('update:requiredTags', $event)"
        />
      </v-list-item>

      <!-- Excluded tags -->
      <v-list-item class="mb-1">
        <tag-picker
          v-model="filters.excludedTags"
          banned
          :items="excludedTagItems"
          label="Excluded Tags"
          @update:model-value="emit('update:excludedTags', $event)"
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref } from 'vue';

import { TagPicker } from '@/components';
import { StrategyTag } from '@/models';

// eslint-disable-next-line
const emit = defineEmits([
  'update:requiredTags',
  'update:excludedTags'
]);

/** The filter values. */
const filters = ref({
  requiredTags: [],
  excludedTags: []
});

const requiredTagItems = computed(() => StrategyTag.LIST.filter((t) => !filters.value.excludedTags.includes(t.key)));

const excludedTagItems = computed(() => StrategyTag.LIST.filter((t) => !filters.value.requiredTags.includes(t.key)));
</script>
