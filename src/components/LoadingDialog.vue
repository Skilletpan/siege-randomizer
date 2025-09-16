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
          :class="{ 'mb-1': LoadingStore.currentStepName }"
          color="primary"
          indeterminate
          rounded
          rounded-bar
        />

        <!-- Step Text -->
        <span
          v-if="LoadingStore.currentStepName"
          class="text-caption text-medium-emphasis"
        >
          {{ LoadingStore.currentStepName }}
        </span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores';

const LoadingStore = useLoadingStore();
</script>
