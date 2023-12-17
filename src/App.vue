<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="expandNavigation = !expandNavigation" />
      <v-app-bar-title>Siege Randomizer</v-app-bar-title>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <navigation-drawer :rail="!expandNavigation" />

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

import { NavigationDrawer } from '@/components';

/** Whether the navigation drawer should be expanded. */
const expandNavigation = ref(true);
</script>
