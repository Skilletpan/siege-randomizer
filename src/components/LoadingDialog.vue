<template>
  <v-dialog
    v-model="LoadingStore.isLoading"
    persistent
    width="300"
  >
    <v-card :title="LoadingStore.dialogTitle">
      <v-card-text>
        <!-- Loader -->
        <v-progress-linear
          :class="{ 'mb-1': LoadingStore.dialogStep }"
          color="primary"
          indeterminate
          rounded
          rounded-bar
        />

        <!-- Step Text -->
        <span
          v-if="LoadingStore.dialogStep"
          class="text-caption text-medium-emphasis"
        >
          {{ LoadingStore.dialogStep }}
        </span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores';

const LoadingStore = useLoadingStore();
</script>
