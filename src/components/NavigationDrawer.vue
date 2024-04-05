<template>
  <v-navigation-drawer
    :model-value="!mobile || show"
    :rail="!mobile && !show"
    @update:model-value="show = $event"
  >
    <v-list nav>
      <!-- To Home -->
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        to="/"
      />

      <v-divider class="my-1" />

      <!-- To Operator Picker -->
      <v-list-item
        prepend-icon="$siege-operators"
        title="Operators"
        to="/operators"
      />

      <!-- To Map Picker -->
      <v-list-item
        prepend-icon="$siege-map"
        title="Maps"
        to="/maps"
      />

      <!-- To Strat Roulette -->
      <v-list-item
        prepend-icon="$siege-strategy"
        title="Strat Roulette"
        to="/strats"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { watchEffect } from 'vue';
import { useDisplay } from 'vuetify';

// Extract Vuetify breakpoints
const { mobile } = useDisplay();

/**
 * Whether to show (mobile) or expand (desktop) the navigation bar.
 * @type {import('vue').ModelRef<Boolean>}
 */
const show = defineModel({ type: Boolean });

// Toggles navigation visibility depending on screen size
watchEffect(() => {
  show.value = !mobile.value;
});
</script>
