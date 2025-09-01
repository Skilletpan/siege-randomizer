<template>
  <v-app>
    <!-- Side Navigation -->
    <v-navigation-drawer>
      <!-- Name and Version -->
      <v-list-item class="pb-4 pt-3">
        <v-list-item-title class="font-weight-bold text-h5">{{ APP_NAME }}</v-list-item-title>
        <v-list-item-subtitle>{{ APP_VERSION }}</v-list-item-subtitle>
      </v-list-item>

      <v-divider />

      <!-- Navigation Items -->
      <v-list
        :items="NAV_ITEMS"
        nav
      />
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Loading Dialog -->
    <loading-dialog />
  </v-app>
</template>

<script setup lang="ts">
// App Information
const APP_NAME = 'Siege Randomizer';
const APP_VERSION = import.meta.env.VITE_VERSION;

// Navigation Items
const NAV_ITEMS = [
  { title: 'Home', props: { prependIcon: 'mdi-home', to: '/' } },
  { type: 'divider' },
  { title: 'GitHub', props: { prependIcon: 'mdi-github', href: 'https://github.com/Skilletpan/siege-randomizer', target: '_blank' } }
];
</script>
