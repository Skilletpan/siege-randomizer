<template>
  <v-card
    :disabled="placeholder"
    :width="detailed ? 300 : null"
  >
    <!-- Operator Portrait -->
    <v-img
      :alt="`${placeholder ? 'Placeholder' : operator.name} portrait`"
      :aspect-ratio="3 / 5"
      :class="['align-end portrait text-center', { placeholder }]"
      cover
      :src="portrait"
      :style="{ backgroundImage: loadBackgroundImage() }"
    >
      <!-- Operator Emblem -->
      <v-avatar
        v-if="!placeholder"
        :image="operator.emblem"
        rounded="0"
        size="80"
      />
    </v-img>

    <!-- Operator Name -->
    <v-card-title class="text-center">{{ placeholder ? '?' : operator.name }}</v-card-title>

    <!-- Operator Details -->
    <template v-if="!placeholder && detailed">
      <v-divider />

      <v-card-text class="d-flex flex-column px-4 py-3">
        <!-- Speed and Health -->
        <v-label
          class="d-block mb-1 text-caption"
          text="Speed and Health"
        />
        <v-row
          class="align-center justify-space-between"
          no-gutters
        >
          <v-icon
            color="grey"
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
            color="grey"
            icon="mdi-hospital-box-outline"
          />
        </v-row>

        <!-- Roles -->
        <template v-if="operator.roles">
          <v-label
            class="d-block mt-3 text-caption"
            text="Roles"
          />
          {{ operator.roles.map((role) => role.name).join(' • ') }}
        </template>

        <!-- Squad -->
        <v-row
          v-if="operator.squad"
          class="align-center mt-3"
          no-gutters
        >
          <v-col class="pa-0">
            <v-label
              class="d-block text-caption"
              text="Squad"
            />
            {{ operator.squad.name }}
          </v-col>
          <v-col
            class="pa-0"
            cols="auto"
          >
            <v-avatar
              :image="operator.squad.emblem"
              rounded="0"
              size="small"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

import { Operator, SiegeMap } from '@/models';

// Component props
const props = defineProps({
  /** Whether operator details should be displayed. */
  detailed: Boolean,

  /** Whether the card should be displayed as a placeholder. */
  placeholder: Boolean,

  /** The key of the operator to display. */
  operatorKey: {
    type: String,
    validator: (v) => Object.keys(Operator).includes(v)
  }
});

/**
 * The operator to display.
 * 
 * If no operator key is set in `props`, a random operator is picked.
 * 
 * @type {import('vue').ComputedRef<Operator>}
 */
const operator = computed(() => {
  if (!props.operatorKey) return Operator.random();
  return Operator[props.operatorKey];
});

/**
 * The URL the operator portrait to display.
 * @type {import('vue').ComputedRef<String>}
 */
const portrait = computed(() => {
  if (props.placeholder) return operator.value.portrait;
  return operator.value.easterEggPortrait();
});

/**
 * Loads a random map to display behind the operator.
 * 
 * @returns {String} The CSS value for the picked background image.
 */
function loadBackgroundImage() {
  if (props.placeholder) return 'none';
  return `url(${SiegeMap.random().thumbnail})`;
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
