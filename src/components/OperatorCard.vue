<template>
  <v-card :width="detailed ? 300 : 250">
    <!-- Operator Portrait -->
    <v-img
      :alt="`${placeholder ? 'Placeholder' : operator.name} portrait`"
      :aspect-ratio="3 / 5"
      class="align-end portrait text-center"
      :class="{ placeholder }"
      cover
      :src="loadPortrait(operator.key, placeholder)"
      :style="loadBackground()"
    >
      <!-- Operator Emblem -->
      <v-avatar
        v-if="!placeholder"
        rounded="0"
        size="80"
      >
        <v-img
          :alt="`${operator.name} emblem`"
          :src="loadEmblem(operator.key)"
        />
      </v-avatar>
    </v-img>

    <!-- Operator Name -->
    <v-card-title class="text-center">{{ placeholder ? '?' : operator.name }}</v-card-title>

    <!-- Operator Details -->
    <template v-if="!placeholder && detailed">
      <v-divider />
      <v-card-text>
        <v-list
          class="py-0"
          density="comfortable"
        >
          <!-- Operator Roles -->
          <template v-if="operator.roles.length">
            <v-list-subheader title="Roles" />
            <v-list-item :title="operator.roles.join(' • ') || 'None'" />
          </template>

          <!-- Operator Squad -->
          <template v-if="operator.squad">
            <v-list-subheader title="Squad" />
            <v-list-item
              :prepend-avatar="loadSquadEmblem(operator.squad)"
              :title="operator.squad"
            />
          </template>

          <!-- Operator Speed and Health -->
          <v-list-subheader title="Speed and Health" />
          <v-list-item
            append-icon="mdi-hospital-box-outline"
            prepend-icon="mdi-speedometer"
          >
            <v-list-item-title class="d-flex">
              <v-radio
                v-for="i in 4"
                :key="i"
                :color="i <= operator.speed ? 'green' : 'blue'"
                density="compact"
                hide-details
                inline
                :model-value="true"
                readonly
              />
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

import { loadEmblem, loadPortrait, loadSquadEmblem } from '@/composables/imageLoader';
import { MAPS, OPERATORS } from '@/data';

// Define input properties
const props = defineProps({
  detailed: {
    default: false,
    type: Boolean
  },

  placeholder: {
    default: false,
    type: Boolean
  },

  operatorKey: {
    type: String,
    validator: (v) => OPERATORS.map((o) => o.key).includes(v)
  }
});

// Define computed properties
const operator = computed(() => {
  // Fetch random operator if placeholder
  if (props.placeholder) return OPERATORS[Math.floor(Math.random() * OPERATORS.length)];

  // Fetch given operator by operator key
  return OPERATORS.find((o) => o.key === props.operatorKey);
});

/**
 * Loads a random map to display behind the operator.
 */
function loadBackground() {
  if (props.placeholder) return null;

  // Pick random map
  const map = MAPS[Math.floor(Math.random() * MAPS.length)].key;
  return { backgroundImage: `url(${require(`@/assets/maps/${map}.jpg`)})` };
}
</script>

<style scoped>
.placeholder {
  filter: brightness(10%) grayscale(100%);
  -webkit-filter: brightness(10%) grayscale(100%);
}

.portrait {
  background-position: center;
  background-size: cover;
}
</style>
