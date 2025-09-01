<template>
  <v-dialog
    v-model="DialogStore.isLoading"
    persistent
    width="300"
  >
    <v-card :title="DialogStore.dialogTitle">
      <v-card-text>
        <!-- Loader -->
        <v-progress-linear
          :class="{ 'mb-1': DialogStore.currentStep?.title }"
          color="primary"
          indeterminate
          rounded
          rounded-bar
        />

        <!-- Step Text -->
        <span
          v-if="DialogStore.currentStep?.title"
          class="text-caption text-medium-emphasis"
        >
          {{ DialogStore.currentStep.title }}
        </span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDialogStore } from '@/stores';

const DialogStore = useDialogStore();
</script>
