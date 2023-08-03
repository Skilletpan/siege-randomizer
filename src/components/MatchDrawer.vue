<template>
  <v-navigation-drawer location="right" :rail="!expanded">
    <v-list disabled nav>
      <!-- Menu Icon and Page Title -->
      <v-list-item prepend-icon="mdi-cog" @click="expanded = !expanded">
        <v-list-item-title class="text-body-1">Match Settings</v-list-item-title>
      </v-list-item>

      <v-divider class="mb-1" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';

// Define dynamic properties
const expanded = ref(false);
</script>
