<template>
  <v-card
    variant="tonal"
    width="250"
  >
    <!-- Operator Portrait -->
    <v-img
      :alt="placeholder ? 'Portrait placeholder' : `${operator.name} portrait`"
      class="align-end d-flex portrait"
      :class="{ placeholder }"
      cover
      :lazy-src="RECRUIT_PORTRAIT"
      ref="portrait"
      :src="placeholder ? RECRUIT_PORTRAIT : loadPortrait(operatorKey)"
      :style="{ backgroundImage: `url(${require(`@/assets/maps/${MAPS[BACKGROUND_IMAGE_INDEX].key}.jpg`)})` }"
    >
      <v-row
        v-if="!placeholder"
        align="center"
        no-gutters
      >
        <!-- Operator Emblem -->
        <v-col
          align="center"
          cols="4"
          offset="4"
        >
          <v-avatar
            rounded="0"
            size="80"
          >
            <v-img
              :alt="`${operator.name} emblem`"
              :src="loadEmblem(operatorKey)"
            />
          </v-avatar>
        </v-col>

        <!-- Operator Side Icon -->
        <v-col
          align="end"
          cols="4"
        >
          <v-icon
            class="mr-4"
            :icon="operator.side === 'ATT' ? 'mdi-sword-cross' : 'mdi-chess-rook'"
            size="x-large"
          />
        </v-col>
      </v-row>
    </v-img>

    <!-- Operator Name -->
    <v-card-title class="text-center">
      <template v-if="!placeholder">{{ operator.name }}</template>
      <template v-else>None</template>
    </v-card-title>

    <!-- Operator Roles -->
    <v-card-subtitle
      v-if="false"
      class="pb-2 text-center"
    >
      <template v-if="!placeholder">{{ roles }}</template>
      <template v-else>Randomize</template>
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue';

import { loadEmblem, loadPortrait } from '@/composables/imageLoader';
import { MAPS, OPERATORS } from '@/data';

// Define static properties
const BACKGROUND_IMAGE_INDEX = Math.floor(Math.random() * MAPS.length);
const RECRUIT_PORTRAIT = require('@/assets/portraits/RECRUIT.png');

// Define input properties
const props = defineProps({
  placeholder: {
    default: false,
    type: Boolean
  },

  operatorKey: {
    type: String,
    validator: (v) => OPERATORS.map((o) => o.key).includes(v)
  }
});

const portrait = ref(null);

// Define computed properties
/**
 * Fetches the operator details from the operators list.
 */
const operator = computed(() => OPERATORS.find((o) => o.key === props.operatorKey));

/**
 * Builds the roles string.
 */
const roles = computed(() => props.placeholder ? null : operator.value.roles.join(' • ') || 'None');

onMounted(() => {
  portrait.value.$el.classList.add('border');
  portrait.value.$el.style.backgroundSize = 'cover';
});
</script>

<style scoped>
.portrait:not(.placeholder) {
  /* background-color: lightskyblue; */
  /* background-image: url("~@/assets/maps/BORDER.jpg"); */

  background-size: cover;
}

.placeholder {
  filter: brightness(.1);
}
</style>
