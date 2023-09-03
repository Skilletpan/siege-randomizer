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
      :style="{ backgroundImage: loadBackgroundImage() }"
    >
      <!-- Operator Emblem -->
      <v-avatar
        v-if="!placeholder"
        :image="loadEmblem(operator.key)"
        rounded="0"
        size="80"
      />
    </v-img>

    <!-- Operator Name -->
    <v-card-title class="text-center">{{ placeholder ? '?' : operator.name }}</v-card-title>

    <!-- Operator Details -->
    <template v-if="!placeholder && detailed">
      <v-divider />
      <v-card-text class="pt-2 px-4">
        <!-- Operator Speed and Health -->
        <v-label
          class="ml-4 text-caption"
          text="Speed and Health"
        />
        <v-row
          class="align-center justify-space-between mb-4 mt-2 px-4"
          no-gutters
        >
          <v-icon
            color="grey lighten-1"
            icon="mdi-speedometer"
          />
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
          <v-icon
            color="grey lighten-1"
            icon="mdi-hospital-box-outline"
          />
        </v-row>

        <!-- Operator Roles -->
        <v-text-field
          v-if="operator.roles.length"
          class="mb-4"
          density="comfortable"
          hide-details
          label="Roles"
          :model-value="operator.roles.join(' • ')"
          readonly
          variant="solo-filled"
        />

        <!-- Operator Squad -->
        <v-text-field
          v-if="operator.squad"
          class="mb-4"
          density="comfortable"
          hide-details
          label="Squad"
          :model-value="operator.squad"
          readonly
          variant="solo-filled"
        >
          <!-- Squad Emblem -->
          <template v-slot:append-inner>
            <v-avatar
              :image="loadSquadEmblem(operator.squad)"
              rounded="0"
            />
          </template>
        </v-text-field>
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
 * 
 * @returns {String} The CSS value for the picked background image.
 */
function loadBackgroundImage() {
  if (props.placeholder) return 'none';

  // Pick random map
  const map = MAPS[Math.floor(Math.random() * MAPS.length)].key;
  return `url(${require(`@/assets/maps/${map}.jpg`)})`;
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
