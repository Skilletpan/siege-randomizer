<template>
  <v-navigation-drawer
    :model-value="showNavigation"
    :rail="!expandNavigation"
    @update:model-value="(value) => show = value"
  >
    <v-list nav>
      <v-list-subheader
        v-show="mobile || expandNavigation"
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
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

// Extract Vuetify breakpoints
const { mobile } = useDisplay();

/**
 * Whether to show (mobile) or expand (desktop) the navigation bar.
 * @type {import('vue').ModelRef<Boolean>}
 */
const show = defineModel({ type: Boolean });

// Set the default value for `show` depending on device type
show.value = !mobile.value;

/**
 * Whether the navigation drawer should be expanded.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const expandNavigation = computed(() => show.value);

/**
 * Whether the navigation drawer should be shown.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const showNavigation = computed(() => !mobile.value || show.value);
</script>
