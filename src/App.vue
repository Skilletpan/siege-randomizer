<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="expandNavigation = !expandNavigation" />
      <v-app-bar-title>Siege Randomizer</v-app-bar-title>

      <template #append>
        <v-btn
          icon="mdi-web"
          @click="showMatchDrawer = !showMatchDrawer"
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
    <match-settings-drawer v-model="showMatchDrawer" />
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

import { MatchSettingsDrawer, NavigationDrawer } from '@/components';

/**
 * Whether the navigation drawer should be expanded.
 * @type {import('vue').Ref<Boolean>}
 */
const expandNavigation = ref(true);

/**
 * Whether to show the match drawer.
 * @type {import('vue').Ref<Boolean>}
 */
const showMatchDrawer = ref(false);
</script>
