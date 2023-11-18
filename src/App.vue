<template>
  <v-app>
    <v-app-bar v-if="false" class="text-center" title="Siege Randomizer" />
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
