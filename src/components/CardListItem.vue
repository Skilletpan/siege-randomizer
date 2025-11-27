<template>
  <div class="d-flex flex-wrap ga-1 justify-end">
    <!-- Label -->
    <v-label
      class="me-auto text-caption"
      :text="label ?? 'Label'"
    />

    <!-- Content -->
    <slot>
      <!-- Item Chips -->
      <template v-if="chips">
        <display-chip
          v-for="chip in chips"
          label
          :prefix="typeof chip === 'object' ? chip.prefix : undefined"
          size="x-small"
          :suffix="typeof chip === 'object' ? chip.suffix : undefined"
          :text="typeof chip === 'object' ? chip.text : chip"
        />
      </template>

      <!-- Value Text -->
      <template v-else-if="text">
        <span class="font-weight-bold">{{ text }}</span>
      </template>

      <!-- Fallback -->
      <template v-else>Empty</template>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** The chip items of the item. */
  chips?: Array<string | number | { prefix?: string | number, suffix?: string | number, text: string | number }>;

  /** The label of the item. */
  label: string;

  /** The text of the item. */
  text?: string | number;
}>();
</script>
