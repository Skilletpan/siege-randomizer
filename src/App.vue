<template>
  <v-app>
    <!-- Navigation Drawer -->
    <navigation-drawer />

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { NavigationDrawer } from '@/components';
</script>
