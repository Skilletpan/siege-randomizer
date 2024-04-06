<template>
  <v-navigation-drawer :rail="!AppSettings.expandNavigation">
    <v-list
      class="fill-height"
      nav
    >
      <v-list-subheader v-if="AppSettings.expandNavigation">Randomizers</v-list-subheader>

      <!-- Map Picker -->
      <v-list-item
        prepend-icon="$map"
        title="Map Picker"
        to="maps"
      />

      <!-- Operator Picker -->
      <v-list-item
        prepend-icon="$operator"
        title="Operator Picker"
        to="operators"
      />

      <!-- Strat Roulette -->
      <v-list-item
        prepend-icon="$strategy"
        title="Strat Roulette"
        to="strats"
      />

      <v-spacer />

      <!-- Settings -->
      <v-list-item
        prepend-icon="$settings"
        title="Settings"
        @click="AppSettings.show = true"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useAppSettings } from '@/store';

const AppSettings = useAppSettings();
</script>
