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

      <v-divider class="my-1" />

      <!-- Settings -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        @click="showAppSettings = true"
      />
    </v-list>
  </v-navigation-drawer>

  <!-- App Settings -->
  <app-settings-dialog v-model="showAppSettings" />
</template>

<script setup>
import { shallowRef } from 'vue';

import { AppSettingsDialog } from '@/components';

/**
 * Whether to show the app settings dialog.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const showAppSettings = shallowRef(false);
</script>
