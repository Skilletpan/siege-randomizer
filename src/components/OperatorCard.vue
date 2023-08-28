<template>
  <v-card
    variant="tonal"
    width="250"
  >
    <!-- Operator Portrait -->
    <v-img
      class="align-end d-flex portrait text-center"
      cover
      :lazy-src="PLACEHOLDER_PORTRAIT"
      :src="portrait"
    >
      <!-- Operator Emblem -->
      <v-avatar
        rounded="0"
        size="80"
      >
        <v-img
          :alt="`${operator.name} emblem`"
          :src="emblem"
        />
      </v-avatar>
    </v-img>

    <!-- Operator Name -->
    <v-card-title class="text-center">{{ operator.name }}</v-card-title>

    <!-- Operator Roles -->
    <v-card-subtitle class="pb-2 text-center">{{ roles }}</v-card-subtitle>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { OPERATORS } from '@/data';

// Define static properties
const EASTER_EGG_OPERATORS = ['ASH', 'PULSE', 'RECRUIT'];
const PLACEHOLDER_PORTRAIT = require('@/assets/portraits/RECRUIT.png');

// Define input properties
const props = defineProps({
  value: {
    required: true,
    type: String,
    validator: (v) => OPERATORS.map((o) => o.key).includes(v)
  }
});

// Define computed properties
/**
 * Fetches the operator details from the operators list.
 */
const operator = computed(() => OPERATORS.find((o) => o.key === props.value));

/**
 * Fetches the operator portrait.
 */
const portrait = computed(() => {
  if (isEasterEgg.value) return require(`@/assets/portraits/${props.value}_2.png`);
  return require(`@/assets/portraits/${props.value}.png`);
});

/**
 * Fetches the operator emblem.
 */
const emblem = computed(() => require(`@/assets/emblems/${props.value}.png`));

/**
 * Builds the roles string.
 */
const roles = computed(() => operator.value.roles.join(' • ') || 'None');

/**
 * Shows a different portrait at a 1 in 50 chance.
 */
const isEasterEgg = computed(() => EASTER_EGG_OPERATORS.includes(props.value) && Math.floor(Math.random() * 50) === 0);
</script>

<style scoped>
.portrait {
  background-color: lightskyblue;
}
</style>
