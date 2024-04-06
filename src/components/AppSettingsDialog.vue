<template>
  <v-dialog
    v-model="AppSettings.show"
    width="700"
  >
    <v-card>
      <v-card-item class="px-6 py-4">
        <template #prepend>
          <v-icon icon="$settings" />
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
              :clearable="false"
              :items="THEMES"
              label="Theme"
              prepend-icon="mdi-palette"
            />
          </v-col>

          <!-- Recent Players Toggle -->
          <v-col cols="6">
            <v-switch
              v-model="squadSettings.saveRecentPlayers"
              hide-details
              label="Store recent players"
              prepend-icon="$player-recent"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { shallowReadonly, watchEffect } from 'vue';
import { useTheme } from 'vuetify';

import { useAppSettings, useSquadSettings } from '@/store';
import { storeToRefs } from 'pinia';

// Include settings
const AppSettings = useAppSettings();
const SquadSettings = useSquadSettings();

const { squadSettings } = storeToRefs(SquadSettings);

const { name: vuetifyTheme } = useTheme().global;

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
watchEffect(() => { vuetifyTheme.value = AppSettings.theme; });
</script>
