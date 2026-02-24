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
          icon="$menu"
          @click="showNav = !showNav"
        />
      </template>

      <!-- Settings Button -->
      <template #append>
        <v-btn
          icon="$settings"
          @click="SettingsStore.show = true"
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
        :items="NAVIGATION_ITEMS.main"
        nav
      />

      <!-- Bottom Navigation Items -->
      <template #append>
        <v-list
          class="nav-list"
          :items="NAVIGATION_ITEMS.bottom"
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

    <!-- Settings Modal -->
    <settings-modal />

    <!-- Operator Inspector -->
    <operator-inspector />
  </v-app>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { useDisplay } from 'vuetify';

import { useSettingsStore, useSiegeStore } from '@/stores';
import { Env } from '@/utils';

// Display Breakpoints
const { mobile } = useDisplay();

// Stores
const SettingsStore = useSettingsStore();
const SiegeStore = useSiegeStore();

// Side navigation items
const NAVIGATION_ITEMS = {
  // Main navigation items
  main: [
    {
      title: 'Home',
      props: {
        prependIcon: '$home',
        to: '/'
      }
    },
    { type: 'divider' }
  ],

  // Bottom navigation items
  bottom: [
    {
      title: 'Settings',
      props: {
        prependIcon: '$settings',
        onClick: () => { SettingsStore.show = true; }
      }
    },
    { type: 'divider' },
    {
      title: 'GitHub',
      props: {
        disabled: !Env.URL.REPOSITORY,
        prependIcon: 'mdi-github',
        href: Env.URL.REPOSITORY,
        target: '_blank'
      }
    },
    {
      title: 'Release Notes',
      props: {
        disabled: !Env.URL.NOTES,
        prependIcon: 'mdi-creation',
        subtitle: `v${Env.APP.VERSION}`,
        href: Env.URL.NOTES,
        target: '_blank'
      }
    }
  ]
};

/** Whether the side navigation should be displayed. */
const showNav = shallowRef<boolean>(!mobile.value);

// Load Siege data
SiegeStore.fetchSiegeData();
</script>

<style lang="scss" scoped>
.nav-list {
  :deep(.v-divider) {
    margin-top: 4px;
  }
}
</style>
