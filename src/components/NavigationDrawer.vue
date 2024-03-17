<template>
  <v-navigation-drawer
    :model-value="!mobile || show"
    :rail="!mobile && !show"
    @update:model-value="show = $event"
  >
    <v-list nav>
      <v-list-subheader
        v-show="mobile || show"
        title="Randomizers"
      />

      <!-- To Map Picker -->
      <v-list-item
        prepend-icon="$siege-map"
        title="Map Picker"
        to="/maps"
      />

      <!-- To Operator Picker -->
      <v-list-item
        prepend-icon="$siege-operators"
        title="Operator Picker"
        to="/operators"
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
