<template>
  <v-dialog
    v-model="show"
    max-width="700"
  >
    <v-card title="Settings">
      <v-card-text class="d-flex flex-wrap mx-n2">
        <!-- Side Color Pickers -->
        <v-col
          v-for="side, index in Side.LIST"
          :key="side.key"
          class="pa-2"
          cols="12"
          sm="6"
          :order-sm="index"
        >
          <v-select
            v-model="AppSettings.colors[side.key]"
            :items="TEAM_COLORS"
            item-title="name"
            :label="`${side.name} Color`"
            placeholder="Default"
          >
            <!-- Select Field Avatar -->
            <template #append-inner>
              <v-avatar
                :color="AppSettings.colors[side.key]"
                size="x-small"
              />
            </template>

            <!-- List Item Avatar -->
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #append>
                  <v-avatar
                    :color="item.value"
                    size="x-small"
                  />
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>

        <!-- Player Name Storing Toggle -->
        <v-col
          class="pa-2"
          cols="12"
          sm="6"
        >
          <v-switch
            v-model="AppSettings.storePlayerNames"
            color="primary"
            density="comfortable"
            hide-details
            label="Store Player Names"
          />
        </v-col>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import COLORS from 'vuetify/util/colors';

import { Side } from '@/models';
import { useAppSettings } from '@/stores';

// Register composables
const AppSettings = useAppSettings();

/** The available team color options. */
const TEAM_COLORS = [
  { name: 'Blue', value: COLORS.blue.darken2 },
  { name: 'Orange', value: COLORS.orange.darken2 },
  { name: 'Red', value: COLORS.red.darken1 },
  { name: 'Green', value: COLORS.green.darken2 },
  { name: 'Yellow', value: COLORS.yellow.darken1 },
  { name: 'Purple', value: COLORS.purple.darken1 }
];

/**
 * Whether to show the settings dialog.
 * @type {import('vue').ModelRef<Boolean>}
 */
const show = defineModel({ type: Boolean });
</script>
