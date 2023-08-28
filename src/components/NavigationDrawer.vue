<template>
  <v-navigation-drawer :rail="!expanded">
    <v-list
      :items="navigationItems"
      nav
    />
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref } from 'vue';

// Define dynamic properties
const expanded = ref(true);

// Define computed properties
const navigationItems = computed(() => [
  {
    title: 'Siege Randomizer',
    props: {
      prependIcon: 'mdi-menu',
      onClick: () => expanded.value = !expanded.value
    }
  },
  {
    type: 'divider',
    props: {
      class: 'mb-1'
    }
  },
  {
    title: 'Randomizers',
    type: 'subheader',
    expandedOnly: true
  },
  {
    title: 'Maps',
    props: {
      prependIcon: 'mdi-warehouse',
      to: 'maps'
    }
  },
  {
    title: 'Teams',
    props: {
      prependIcon: 'mdi-account-group',
      to: 'teams'
    }
  },
  {
    title: 'Operators',
    props: {
      prependIcon: 'mdi-account',
      to: 'operators'
    }
  },
  {
    title: 'Strats',
    props: {
      prependIcon: 'mdi-strategy',
      to: 'strats'
    }
  }
].filter((i) => i.expandedOnly ? expanded.value : true));
</script>
