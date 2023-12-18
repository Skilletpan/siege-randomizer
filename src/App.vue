<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="expandNavigation = !expandNavigation" />
      <v-app-bar-title>Siege Randomizer</v-app-bar-title>

      <template v-slot:append>
        <v-btn
          icon="mdi-stadium-variant"
          @click="AppSettings.showMatchDrawer = !AppSettings.showMatchDrawer"
        />
      </template>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <navigation-drawer :rail="!expandNavigation" />

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Match Settings Drawer -->
    <match-settings-drawer />

    <!-- App Settings -->
    <app-settings-dialog />
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

import { AppSettingsDialog, MatchSettingsDrawer, NavigationDrawer } from '@/components';
import { useAppSettings } from './store';

const AppSettings = useAppSettings();

/**
 * Whether the navigation drawer should be expanded.
 * @type {import('vue').Ref<Boolean>}
 */
const expandNavigation = ref(true);
</script>
