<template>
  <v-navigation-drawer :rail="!expanded">
    <v-list
      :items="navigationItems"
      nav
    />

    <v-select
      v-model="currentTheme"
      class="px-2"
      density="comfortable"
      :items="themes"
      label="Theme"
      prepend-inner-icon="mdi-palette-swatch"
      variant="solo-filled"
      @update:model-value="theme.global.name.value = $event"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const themes = [
  { title: 'Default', value: 'default' },
  { title: 'Dark', value: 'dark' },
  { title: 'Beautiful', value: 'cancer' }
];

const currentTheme = ref(themes[0].value);

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
