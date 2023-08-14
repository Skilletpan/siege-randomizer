<template>
  <v-card :variant="inactive ? 'elevated' : 'tonal'" width="300">
    <!-- Operator Portrait -->
    <v-img v-if="big" :alt="`${value.name} portrait`" :aspect-ratio="3 / 4.25"
      class="d-flex align-end portrait text-center" cover :lazy-src="PLACEHOLDER_PORTRAIT" :src="portrait">

      <!-- Operator Icon -->
      <v-avatar rounded="0" size="80">
        <v-img :alt="`${value.name} icon`" :src="icon" />
      </v-avatar>
    </v-img>

    <div class="d-flex">
      <v-col v-if="!big" cols="auto" class="pa-0">
        <!-- Operator Icon -->
        <v-avatar rounded="0" size="76">
          <v-img :alt="`${value.name} icon`" :class="{ inactive }" :src="icon" />
        </v-avatar>
      </v-col>

      <v-col class="pa-0">
        <!-- Operator Name -->
        <v-card-title :class="['text-center', { 'text-button': isEmptyRandomize, 'text-primary': isEmptyRandomize }]">
          {{ value.name }}
        </v-card-title>

        <!-- Operator Roles -->
        <v-card-subtitle v-if="value.key" class="pb-2 text-center">{{ value.roles.join(' • ') }}</v-card-subtitle>
      </v-col>
    </div>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

// Define static properties
const PLACEHOLDER_PORTRAIT = require('@/assets/portraits/ASH.png');

// Define input properties
const props = defineProps({
  big: {
    type: Boolean
  },

  inactive: {
    type: Boolean
  },

  value: {
    default: () => ({ name: 'Randomize' }),
    type: Object
  }
});

// Define computed properties
const isEmptyRandomize = computed(() => !props.value.key && props.big);
const icon = computed(() => props.value.key ? require(`@/assets/icons/${props.value.key}.png`) : null);
const portrait = computed(() => {
  // Return null if no operator is given
  if (!props.value.key) return null;

  // Return Ash easter egg portrait or normal operator portrait
  if (props.value.key === 'ASH' && Math.floor(Math.random() * 50) === 0) return require('@/assets/portraits/ASH_2.png');
  return require(`@/assets/portraits/${props.value.key}.png`);
});
</script>

<style scoped>
.portrait {
  background-color: skyblue;
}

.inactive {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
</style>
