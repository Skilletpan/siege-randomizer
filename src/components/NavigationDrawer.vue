<template>
  <v-navigation-drawer :rail="!expanded">
    <v-list nav>
      <!-- Menu Icon and Page Title -->
      <v-list-item prepend-icon="mdi-menu" @click="expanded = !expanded">
        <v-list-item-title class="font-weight-bold text-body-1">Siege Randomizer</v-list-item-title>
      </v-list-item>

      <v-divider class="mb-1" />


      <!-- Navigation Items -->
      <v-list-item v-for="n in navigationItems" :key="n.title" :prepend-icon="n.prependIcon" :title="n.title"
        :to="n.to" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';

// Define static properties
const navigationItems = [
  {
    title: 'Map Picker',
    prependIcon: 'mdi-warehouse',
    to: 'maps'
  },
  {
    title: 'Team Picker',
    prependIcon: 'mdi-account-group',
    to: 'teams'
  },
  {
    title: 'Operator Picker',
    prependIcon: 'mdi-account',
    to: 'operators'
  },
  {
    title: 'Lineup Picker',
    prependIcon: 'mdi-account-group',
    to: 'lineups'
  },
  {
    title: 'Strat Roulette',
    prependIcon: 'mdi-strategy',
    to: 'strats'
  }
];

// Define dynamic properties
const expanded = ref(true);
</script>
