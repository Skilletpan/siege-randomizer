<template>
  <v-app>
    <v-navigation-drawer>
      <v-list :items="NAVIGATION_ITEMS" item-value="title" />
    </v-navigation-drawer>
    <v-app-bar align="center">
      <v-toolbar-title>Siege Randomizer</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
const NAVIGATION_ITEMS = [
  {
    title: 'Welcome',
    props: {
      class: 'mb-2',
      prependIcon: 'mdi-human-greeting',
      to: '/'
    }
  },
  { type: 'divider' },
  {
    type: 'subheader',
    title: 'Randomizers'
  },
  {
    title: 'Team Picker',
    props: {
      prependIcon: 'mdi-account-group',
      to: 'teams'
    }
  },
  {
    title: 'Operator Picker',
    props: {
      prependIcon: 'mdi-account',
      to: 'operators'
    }
  },
  {
    title: 'Lineup Picker',
    props: {
      prependIcon: 'mdi-account-group',
      to: 'lineup'
    }
  },
  {
    title: 'Map Picker',
    props: {
      prependIcon: 'mdi-warehouse',
      to: 'maps'
    }
  },
  {
    title: 'Strat Roulette',
    props: {
      prependIcon: 'mdi-strategy',
      to: 'strats'
    }
  }
];
</script>
