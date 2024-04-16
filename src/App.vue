<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="showNavigation = !showNavigation" />
      <v-app-bar-title text="Siege Randomizer" />

      <v-toolbar-items class="pr-3">
        <!-- Squad Menu -->
        <v-btn>
          <v-icon
            icon="mdi-account-group"
            size="x-large"
          />

          <squad-menu />
        </v-btn>
      </v-toolbar-items>
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

import { NavigationDrawer, SquadMenu } from '@/components';

/**
 * Whether to show the navigation drawer.
 * @type {import('vue').ShallowRef<Boolean>}
 */
const showNavigation = shallowRef(null);
</script>
