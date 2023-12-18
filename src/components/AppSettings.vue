<template>
  <v-dialog
    v-bind="$attrs"
    v-model="AppSettings.showSettings"
    width="700"
  >
    <v-card>
      <v-card-item class="px-6 py-4">
        <template v-slot:prepend>
          <v-icon icon="mdi-cog" />
        </template>
        <v-card-title>App Settings</v-card-title>
      </v-card-item>

      <v-divider />

      <v-card-text class="d-flex px-6 py-4">
        <v-row>
          <!-- Theme Picker -->
          <v-col cols="6">
            <v-select
              v-model="AppSettings.theme"
              :items="THEMES"
              label="Theme"
              prepend-icon="mdi-palette"
            />
          </v-col>

          <v-col cols="6">
            <v-switch
              v-model="AppSettings.storeRecentPlayers"
              label="Store recent players"
              prepend-icon="mdi-history"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { readonly } from 'vue';
import { useTheme } from 'vuetify';

import { useAppSettings, usePlayerSettings } from '@/store';

/** The list of available themes. */
const THEMES = readonly([
  { title: 'Default', value: 'default' },
  { title: 'Dark', value: 'dark' },
  { title: 'Light', value: 'light' }
]);

// Include settings
const AppSettings = useAppSettings();
const PlayerSettings = usePlayerSettings();

// Set app theme
const vuetifyTheme = useTheme().global.name;
vuetifyTheme.value = AppSettings.theme;

// Update app settings in local storage
AppSettings.$subscribe((_, state) => {
  // Update app settings
  AppSettings.storeSettings();
  vuetifyTheme.value = state.theme;

  // Remove recent players if `storeRecentPlayers` is disabled
  if (!state.storeRecentPlayers) PlayerSettings.recentPlayers.length = 0;
});
</script>
