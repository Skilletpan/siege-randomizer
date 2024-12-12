<template>
  <v-tooltip
    activator="parent"
    content-class="d-flex flex-column"
  >
    <span class="text-subtitle-1">{{ ability.name }}</span>

    <v-divider />

    <!-- Amount -->
    <span v-if="ability.amount !== undefined">{{ ability.displayName }}</span>
    <span>Consumable: {{ ability.isConsumable }}</span>
  </v-tooltip>
</template>

<script setup>
import { Ability } from '@/models';

/**
 * The component props.
 * @type {{ readonly ability: Ability }}
 */
const props = defineProps({
  /** The unique operator ability to display. */
  ability: {
    required: true,
    type: Ability
  }
});
</script>
