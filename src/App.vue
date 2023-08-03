<template>
  <v-app>
    <!-- Navigation Drawer -->
    <navigation-drawer />

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Match Drawer -->
    <match-drawer />
  </v-app>
</template>

<script setup>
import { MatchDrawer, NavigationDrawer } from '@/components';
</script>
