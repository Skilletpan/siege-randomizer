<template>
  <!-- Label -->
  <h5 class="text-uppercase">{{ label }}</h5>

  <!-- Content -->
  <slot></slot>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const { label = 'Label' } = defineProps<{
  /** The label of the section. */
  label?: string;
}>();
</script>
