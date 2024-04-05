<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="showNavigation = !showNavigation" />
      <v-app-bar-title
        class="cursor-pointer"
        text="Siege Randomizer"
        @click="$router.push('/')"
      />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <navigation-drawer v-model="showNavigation" />

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { shallowRef } from 'vue';

import { NavigationDrawer } from '@/components';

/**
 * Whether to show the navigation drawer.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const showNavigation = shallowRef(null);
</script>
