<template>
  <v-app>
    <!-- App Bar (mobile only) -->
    <v-app-bar
      v-if="mobile"
      :title="Env.APP.NAME"
    >
      <!-- Side Navigation Toggle -->
      <template #prepend>
        <v-btn
          icon="mdi-menu"
          @click="showNav = !showNav"
        />
      </template>

      <!-- Settings Button -->
      <template #append>
        <v-btn
          :active="false"
          icon="mdi-cog"
          @click="showSettings = true"
        />
      </template>
    </v-app-bar>

    <!-- Side Navigation -->
    <v-navigation-drawer v-model="showNav">
      <!-- App Name -->
      <v-list-item class="py-4">
        <v-list-item-title class="font-weight-bold text-h5">{{ Env.APP.NAME }}</v-list-item-title>
      </v-list-item>

      <v-divider />

      <!-- Navigation Items -->
      <v-list
        class="nav-list"
        :items="NAV_ITEMS"
        nav
      />

      <!-- Bottom Navigation Items -->
      <template #append>
        <v-list
          class="nav-list"
          :items="BOTTOM_NAV_ITEMS"
          nav
        />

        <!-- Name and Version -->
        <v-list-item class="text-caption text-medium-emphasis">
          {{ Env.APP.NAME }} v{{ Env.APP.VERSION }}
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Loading Dialog -->
    <loading-dialog />

    <!-- Settings Dialog -->
    <settings-dialog v-model="showSettings" />

    <!-- Operator Inspector -->
    <operator-inspector />
  </v-app>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { useDisplay } from 'vuetify';

import { useSiegeStore } from '@/stores';
import { Env } from '@/utils';

// Display Breakpoints
const { mobile } = useDisplay();

// Stores
const SiegeStore = useSiegeStore();

// Navigation Items
const NAV_ITEMS = [
  {
    title: 'Home',
    props: { prependIcon: 'mdi-home', to: '/' }
  },
  { type: 'divider' }
];

// Navigation Items at the bottom of the sidebar
const BOTTOM_NAV_ITEMS = [
  {
    title: 'GitHub',
    props: { disabled: !Env.URL.REPOSITORY, prependIcon: 'mdi-github', href: Env.URL.REPOSITORY, target: '_blank' }
  },
  { type: 'divider' },
  {
    title: 'Settings',
    props: { active: false, prependIcon: 'mdi-cog', onClick: () => { showSettings.value = true } }
  }
];

/** Whether the side navigation should be displayed. */
const showNav = shallowRef<boolean>(!mobile.value);

/** Whether the settings dialog should be displayed. */
const showSettings = shallowRef<boolean>(false);

// Load Siege data
SiegeStore.fetchSiegeData();
</script>

<style lang="scss" scoped>
.nav-list {
  :deep(.v-divider) {
    margin-bottom: 4px;
  }

  :deep(.v-list-item:last-child) {
    margin-bottom: 0;
  }
}
</style>
