<template>
  <v-menu
    activator="parent"
    :close-on-content-click="false"
    location="bottom right"
    width="250"
  >
    <v-list>
      <v-list-item>
        <v-list class="border-thin py-0 rounded">
          <v-list-subheader
            class="mb-n2 text-caption"
            title="Current Squad"
          />

          <v-list-item
            v-for="player, index in Players.currentPlayers"
            :key="index"
            :title="player"
          >
            <template #append>
              <v-list-item-action end>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  variant="flat"
                  @click="Players.currentPlayers.splice(index, 1)"
                />
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-list-item
            v-if="Players.currentPlayers.length === 0"
            disabled
            title="No players"
          />
        </v-list>
      </v-list-item>

      <v-list-item
        v-if="Players.currentPlayers.length < 5"
        class="mt-2"
      >
        <v-combobox
          label="Add Player"
          :items="Players.recentPlayers"
          :model-value="Players.currentPlayers"
          multiple
          placeholder="Type player name"
          @update:model-value="Players.addPlayer($event[$event.length - 1])"
        >
          <template #selection></template>

          <template #item="{ props }">
            <v-list-item v-bind="props">
              <template #append>
                <v-list-item-action end>
                  <v-btn
                    density="comfortable"
                    icon="mdi-history"
                    variant="flat"
                    @click.stop="() => { }"
                  />
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
        </v-combobox>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { usePlayers } from '@/stores';

const Players = usePlayers();
</script>
