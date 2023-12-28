<template>
  <v-dialog
    v-bind="$attrs"
    width="700"
  >
    <v-card>
      <v-card-item class="px-6 py-4">
        <template #prepend>
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
              v-model="theme"
              :clearable="false"
              :items="THEMES"
              label="Theme"
              prepend-icon="mdi-palette"
            />
          </v-col>

          <!-- Recent Players Toggle -->
          <v-col cols="6">
            <v-switch
              v-model="storeRecentPlayers"
              hide-details
              label="Store recent players"
              prepend-icon="mdi-history"
            />
          </v-col>

          <!-- Animated Placeholder Cards Toggle -->
          <v-col cols="6">
            <v-switch
              v-model="animatePlaceholderCards"
              label="Animate placeholder cards"
              messages="Requires reloading the page to take effect"
              prepend-icon="mdi-animation-outline"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { shallowReadonly, watchEffect } from 'vue';
import { useTheme } from 'vuetify';

import { useAppSettings, useMatchSettings } from '@/store';

// Include settings
const AppSettings = useAppSettings();

// Extract refs from settings
const { animatePlaceholderCards, storeRecentPlayers, theme } = storeToRefs(AppSettings);
const { storeSettings } = AppSettings;
const { recentPlayerList } = storeToRefs(useMatchSettings());
const { name: vuetifyTheme } = useTheme().global;

// Update app settings in local storage
AppSettings.$subscribe((_, state) => {
  // Update app settings
  storeSettings();

  // Remove recent players if `storeRecentPlayers` is disabled
  if (!state.storeRecentPlayers) {
    recentPlayerList.value.length = 0;
    localStorage.removeItem('recent-players');
  }
});

/**
 * The list of available themes.
 * @type {import('vue').ShallowReadonly<{ name: string, key: string }[]>}
 */
const THEMES = shallowReadonly([
  { name: 'Default', key: 'default' },
  { name: 'Dark', key: 'dark' },
  { name: 'Light', key: 'light' }
]);

// Update theme
watchEffect(() => { vuetifyTheme.value = theme.value; });
</script>
