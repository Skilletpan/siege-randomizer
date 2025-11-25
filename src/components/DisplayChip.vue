<template>
  <v-chip>
    <!-- Prefix -->
    <span
      v-if="!!prefix"
      class="me-1 text-medium-emphasis"
    >
      {{ prefix }}
    </span>

    <!-- Main Text -->
    {{ text }}

    <!-- Suffix -->
    <span
      v-if="!!suffix"
      class="ms-1 text-medium-emphasis"
    >
      {{ suffix }}
    </span>
  </v-chip>
</template>

<script setup lang="ts">
defineProps<{
  /** The prefix of the chip. */
  prefix?: string | number;

  /** The suffix of the chip. */
  suffix?: string | number;

  /** The main text of the chip. */
  text: string | number;
}>();
</script>
