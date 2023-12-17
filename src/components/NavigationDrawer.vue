<template>
  <v-navigation-drawer v-bind="$attrs">
    <v-list nav>
      <v-list-subheader v-if="!$attrs.rail">Randomizers</v-list-subheader>

      <!-- Map Picker -->
      <v-list-item
        prepend-icon="mdi-warehouse"
        title="Map Picker"
        to="maps"
      />

      <!-- Operator Picker -->
      <v-list-item
        prepend-icon="mdi-account"
        title="Operator Picker"
        to="operators"
      />

      <!-- Strat Roulette -->
      <v-list-item
        prepend-icon="mdi-strategy"
        title="Strat Roulette"
        to="strats"
      />

      <v-divider />

      <!-- Settings -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        @click="AppSettings.showSettings = true"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useAppSettings } from '@/store';

// Include settings
const AppSettings = useAppSettings();
</script>
