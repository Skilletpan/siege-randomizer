<template>
  <v-dialog
    v-model="SettingsStore.show"
    max-width="700"
  >
    <v-card
      append-icon="$settings"
      max-height="500"
      title="Settings"
    >
      <v-divider />

      <v-card-text class="d-flex flex-column ga-3 pa-3">
        <!-- Colors -->
        <card-list-section label="Colors">
          <!-- Side Colors -->
          <div class="d-flex flex-wrap ga-3">
            <v-select
              v-for="side in SiegeStore.SIDES"
              v-model="side.color"
              density="comfortable"
              hide-details="auto"
              :items="COLOR_LIST"
              :label="`${side.name} Color`"
              min-width="200"
              variant="outlined"
              width="1"
            >
              <!-- Side Icon -->
              <template #append-inner>
                <v-icon
                  :color="side.color"
                  :icon="side.icon"
                />
              </template>

              <!-- Select Item -->
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <!-- Color Dot -->
                  <template #append>
                    <v-avatar
                      :color="item.value"
                      size="x-small"
                    />
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </card-list-section>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSettingsStore, useSiegeStore } from '@/stores';

// Composables
const SettingsStore = useSettingsStore();
const SiegeStore = useSiegeStore();

/** The available team colors to pick from. */
const COLOR_LIST = Object.freeze([
  { title: 'Blue', value: 'blue' },
  { title: 'Orange', value: 'orange-darken-1' },
  { title: 'Red', value: 'red' },
  { title: 'Green', value: 'green-darken-2' },
  { title: 'Yellow', value: 'yellow-darken-1' },
  { title: 'Purple', value: 'purple-darken-1' }
]);
</script>
