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
      :src="placeholder ? operator.portrait : operator.easterEggPortrait"
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
    <v-card-title
      class="text-center"
      :color="!placeholder ? operator.side.color : null"
    >
      {{ placeholder ? '?' : operator.name }}
    </v-card-title>

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

        <!-- Gadgets -->
        <template v-if="operator.gadgets.length">
          <v-label
            class="d-block mt-3 text-caption"
            text="Gadgets"
          />
          <v-chip-group>
            <v-chip
              v-for="{ id, name } in operator.gadgets"
              :key="id"
              label
              size="small"
              :text="name"
            />
          </v-chip-group>
        </template>

        <!-- Roles -->
        <template v-if="operator.roles.length">
          <v-label
            class="d-block mt-3 text-caption"
            text="Roles"
          />
          {{ operator.rolesString }}
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

import { Map, Operator } from '@/models';

// Define input properties
// eslint-disable-next-line
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
    validator: (v) => Object.keys(Operator).includes(v)
  }
});

// Define computed properties

/** @type {import('vue').ComputedRef<Operator>} */
const operator = computed(() => {
  if (props.operatorKey) return Operator[props.operatorKey];
  return Operator.LIST[Math.floor(Math.random() * Operator.LIST.length)];

  // // Fetch operator
  // const operator = { name: '?', ...OPERATORS[props.operatorKey] };

  // // Map additional properties
  // if (!props.placeholder) {
  //   operator.roles = operator.roles.map((r) => ROLES[r].name).join(' • ');
  //   operator.squad = SQUADS[operator.squad];
  // } else {
  //   operator.key = OPERATORS.LIST[Math.floor(Math.random() * OPERATORS.LIST.length)].key;
  // }

  // return operator;
});

/**
 * Loads a random map to display behind the operator.
 * 
 * @returns {String} The CSS value for the picked background image.
 */
function loadBackgroundImage() {
  if (props.placeholder) return 'none';

  // Pick random map
  const map = Map.pickRandomMap();
  return `url(${map.thumbnail})`;
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
