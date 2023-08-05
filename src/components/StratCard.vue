<template>
  <v-card :subtitle="strat.description" :title="strat.title" width="1000">
    <template v-if="props.value">
      <v-divider />

      <v-card-text>
        <!-- Rules -->
        <v-textarea auto-grow hide-details label="Rules" :model-value="rules.join('\n')" readonly rows="1"
          variant="solo-filled" />

        <!-- Required Operators -->
        <v-text-field v-if="strat.requiredOperators" class="mt-4" hide-details label="Required Operators"
          :model-value="strat.requiredOperators.join(' • ')" readonly variant="solo-filled" />
      </v-card-text>
    </template>

  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue';

// Define input properties
const props = defineProps({
  value: {
    type: Object,
  }
});

// Define computed properties
const rules = computed(() => props.value ? strat.value.rules.map((r) => `• ${r}`) : null);
const strat = computed(() => props.value || { title: 'None', description: 'None' });
</script>
