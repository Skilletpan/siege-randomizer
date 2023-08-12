<template>
  <v-card variant="tonal" :width="big ? 500 : 300">
    <v-img :alt="value.name" :aspect-ratio="16 / 9" :class="{ inactive }" :lazy-src="require('@/assets/maps/OREGON.jpg')"
      :src="image" />
    <v-card-title :class="{ 'text-button': isEmptyRandomize, 'text-center': true, 'text-primary': isEmptyRandomize }">
      {{ value.name }}
    </v-card-title>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

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
const image = computed(() => props.value.key ? require(`@/assets/maps/${props.value.key}.jpg`) : null);
const isEmptyRandomize = computed(() => !props.value.key && props.big);
</script>

<style scoped>
.inactive {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
</style>
