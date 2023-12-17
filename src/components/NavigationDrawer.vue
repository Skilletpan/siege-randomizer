<template>
  <v-navigation-drawer v-bind="$attrs">
    <v-list nav>
      <v-list-subheader v-if="!$attrs.rail">Randomizers</v-list-subheader>

      <v-list-item
        prepend-icon="mdi-warehouse"
        title="Map Picker"
        to="maps"
      />

      <v-list-item
        prepend-icon="mdi-account"
        title="Operator Picker"
        to="operators"
      />

      <v-list-item
        prepend-icon="mdi-strategy"
        title="Strat Roulette"
        to="strats"
      />

      <v-divider />

      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        @click="showSettingsDialog = true"
      />
    </v-list>
  </v-navigation-drawer>

  <!-- Settings Dialog -->
  <app-settings
    v-model="showSettingsDialog"
    width="700"
  />
</template>

<script setup>
import { ref } from 'vue';

import { AppSettings } from '@/components';

/** Whether to show the settings dialog. */
const showSettingsDialog = ref(false);
</script>
