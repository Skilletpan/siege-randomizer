<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar v-if="mobile">
      <!-- Title -->
      <v-app-bar-title>
        Siege Randomizer
        <span class="text-caption text-grey">{{ versionNumber }}</span>
      </v-app-bar-title>

      <!-- Settings -->
      <v-btn
        icon="mdi-cog"
        @click="() => { }"
      />
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-else>
      <!-- Title -->
      <v-list-item class="my-2">
        <v-list-item-title class="text-h6">Siege Randomizer</v-list-item-title>
        <v-list-item-subtitle class="text-caption text-grey">{{ versionNumber }}</v-list-item-subtitle>
      </v-list-item>

      <v-divider />

      <!-- App Routes -->
      <v-list nav>
        <v-list-item
          v-for="route, index in ROUTES"
          :active="route.path === $route.path"
          :class="{ 'mb-0': index === (ROUTES.length - 1) }"
          :prepend-icon="route.icon"
          :title="route.title"
          :to="route.path"
        />
      </v-list>

      <v-list
        class="position-absolute bottom-0 w-100"
        nav
      >
        <!-- Settings -->
        <v-list-item
          disabled
          prepend-icon="mdi-cog"
          title="Settings"
          @click="() => { }"
        />

        <!-- GitHub -->
        <v-list-item
          :active="false"
          class="bottom-0 mb-0"
          href="https://github.com/Skilletpan/siege-randomizer"
          prepend-icon="mdi-github"
          target="_blank"
          title="Find Me on GitHub"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation v-if="mobile">
      <v-btn
        v-for="route in ROUTES"
        :active="route.path === $route.path"
        stacked
        :to="route.path"
      >
        <v-icon :icon="route.icon" />
        <span>{{ route.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const versionNumber = import.meta.env.VITE_VERSION;

const ROUTES = [
  { title: 'Matchup', path: '/matchup', icon: 'mdi-soccer-field' },
  { title: 'Operators', path: '/operators', icon: 'mdi-account' },
  { title: 'Maps', path: '/maps', icon: 'mdi-domain' },
  { title: 'Strats', path: '/strats', icon: 'mdi-strategy' }
];
</script>
