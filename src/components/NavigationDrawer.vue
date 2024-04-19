<template>
  <v-navigation-drawer
    :model-value="!mobile || show"
    :rail="!mobile && !show"
    @update:model-value="show = $event"
  >
    <v-list nav>
      <!-- To Home -->
      <v-list-item
        :active="$route.name === 'home'"
        prepend-icon="mdi-home"
        title="Home"
        to="/"
      />

      <v-divider class="my-1" />

      <!-- To Operator Picker -->
      <v-list-item
        :active="$route.name === 'operator-picker'"
        prepend-icon="$siege-operators"
        title="Operators"
        to="/operators"
      />

      <!-- To Map Picker -->
      <v-list-item
        :active="$route.name === 'map-picker'"
        prepend-icon="$siege-map"
        title="Maps"
        to="/maps"
      />

      <!-- To Strat Roulette -->
      <v-list-item
        :active="$route.name === 'strat-picker'"
        prepend-icon="$siege-strategy"
        title="Strat Roulette"
        to="/strats"
      />

      <!-- To Team Picker -->
      <v-list-item
        :active="$route.name === 'team-picker'"
        prepend-icon="mdi-account-group"
        title="Team Picker"
        to="/teams"
      />

      <v-divider class="my-1" />

      <!-- Settings -->
      <v-list-item
        :active="false"
        prepend-icon="$settings"
        title="Settings"
        @click="showSettings = true"
      >
        <settings-dialog v-model="showSettings" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { shallowRef, watchEffect } from 'vue';
import { useDisplay } from 'vuetify';

import SettingsDialog from './SettingsDialog.vue';

// Extract Vuetify breakpoints
const { mobile } = useDisplay();

/**
 * Whether to show (mobile) or expand (desktop) the navigation bar.
 * @type {import('vue').ModelRef<Boolean>}
 */
const show = defineModel({ type: Boolean });

/**
 * Whether to show the settings dialog.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const showSettings = shallowRef(false);

// Toggles navigation visibility depending on screen size
watchEffect(() => {
  show.value = !mobile.value;
});
</script>
