<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar>
      <!-- Navigation Toggle -->
      <v-app-bar-nav-icon @click="appSettings.expandNavigation = !appSettings.expandNavigation" />

      <!-- Title -->
      <v-app-bar-title>Siege Randomizer</v-app-bar-title>

      <!-- Actions -->
      <template #append>
        <v-toolbar-items>
          <!-- Squad Settings Toggle -->
          <v-btn>
            <!-- Icon -->
            <v-icon
              icon="$squad"
              size="x-large"
              start
            />

            <!-- Text -->
            <span class="font-weight-black text-body-1">
              {{ SquadSettings.currentSquad.length }}/5
            </span>

            <!-- Squad Settings Dropdown -->
            <squad-dropdown activator="parent" />
          </v-btn>

          <!-- Match Settings Toggle -->
          <v-btn
            v-if="true"
            icon="mdi-web"
            @click="MatchSettings.show = !MatchSettings.show"
          />

          <!-- App Settings Toggle -->
          <v-btn
            icon="$settings"
            @click="AppSettings.show = true"
          />
        </v-toolbar-items>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <navigation-drawer />

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Match Settings Drawer -->
    <match-settings-drawer />

    <!-- Settings Dialog -->
    <app-settings-dialog />
  </v-app>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import { AppSettingsDialog, MatchSettingsDrawer, NavigationDrawer, SquadDropdown } from '@/components';
import { useAppSettings, useMatchSettings2, useSquadSettings } from '@/store';

// Include settings
const AppSettings = useAppSettings();
const MatchSettings = useMatchSettings2();
const SquadSettings = useSquadSettings();

const { appSettings } = storeToRefs(AppSettings);
</script>

<style>
.randomize-icon {
  position: absolute;
  top: 0;

  backdrop-filter: brightness(30%) grayscale(100%);
  -webkit-backdrop-filter: brightness(30%) grayscale(100%);
}
</style>
