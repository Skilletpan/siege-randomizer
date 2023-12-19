<template>
  <v-navigation-drawer
    v-model="AppSettings.showMatchDrawer"
    location="right"
    width="350"
  >
    <v-list>
      <!-- Match Settings -->
      <v-list-subheader>Match Settings</v-list-subheader>

      <!-- Playlist Picker -->
      <v-list-item class="mb-1">
        <playlist-picker v-model="playlistKey" />
      </v-list-item>

      <!-- Banned Operators Picker -->
      <v-list-item
        class="mb-1"
        :disabled="playlist && !playlist.canBanOperators"
      >
        <operator-picker
          v-model="bannedOperatorKeys"
          :hide-details="!playlist || playlist.canBanOperators"
          hide-selected
          hint="Disabled by Playlist"
          :items="bannableOperators"
          label="Ban Operators"
          multiple
          :persistent-hint="playlist && !playlist.canBanOperators"
          :readonly="bannedOperatorKeys.length >= 4"
        >
          <!-- Selection Text -->
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">{{ bannedOperatorKeys.length }}/4 Operators</template>
          </template>

          <template
            v-if="!playlist || playlist.canBanOperators"
            v-slot:append-inner
          >
            <v-btn
              density="comfortable"
              icon="mdi-dice-multiple-outline"
              variant="text"
              @click.capture.stop="banRandomOperators"
            />
          </template>

          <!-- Operator Item -->
          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              :append-icon="Operator.valueOf(item.value).side.icon"
              :disabled="bannedOperators[Operator.valueOf(item.value).side.key].length >= 2"
              :prepend-avatar="Operator.valueOf(item.value).emblem"
            />
          </template>
        </operator-picker>
      </v-list-item>

      <!-- Banned Operators -->
      <v-list-item
        v-if="!playlist || playlist.canBanOperators"
        class="mb-1 px-8"
      >
        <field-label>Banned Operators</field-label>
        <v-row
          class="align-center justify-space-between"
          no-gutters
        >
          <!-- Attackers Icon -->
          <v-icon :icon="Side.ATT.icon" />

          <template
            v-for="s, i in Side.ALL.included"
            :key="s.key"
          >
            <!-- Operator Emblem -->
            <v-hover
              v-for="j in 2"
              :key="j"
            >
              <template v-slot="{ isHovering, props }">
                <operator-emblem
                  v-bind="props"
                  class="clickable-avatar"
                  :color="bannedOperators[s.key][j - 1] ? 'error' : null"
                  :icon="isHovering ? 'mdi-dice-multiple-outline' : 'mdi-help'"
                  :image="bannedOperators[s.key][j - 1]?.emblem"
                  rounded="rounded"
                  variant="tonal"
                  @click="onEmblemClick(s, j - 1)"
                />
              </template>
            </v-hover>

            <v-divider
              v-if="i === 0"
              vertical
            />
          </template>

          <!-- Defenders Icon -->
          <v-icon :icon="Side.DEF.icon" />
        </v-row>
      </v-list-item>

      <v-divider class="my-1" />

      <!-- Player Settings -->
      <v-list-subheader>Players</v-list-subheader>

      <!-- Player Input -->
      <v-list-item class="mb-1">
        <v-combobox
          ref="playerInput"
          v-model="playerList"
          counter="5"
          :hide-details="false"
          hide-selected
          hint="Press ENTER to add"
          :items="recentPlayerList"
          label="Add Players"
          multiple
          persistent-counter
          :readonly="playerList.length >= 5"
          @update:focused="$refs.playerInput.search = ''"
          @update:model-value="addRecentPlayer"
        >
          <!-- Selection -->
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">{{ playerList.length }}/5 Players</template>
          </template>

          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-history"
            >
              <template v-slot:append>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  variant="text"
                  @click.stop="recentPlayerList.splice(recentPlayerList.indexOf(item.title), 1)"
                />
              </template>
            </v-list-item>
          </template>
        </v-combobox>
      </v-list-item>

      <!-- Player List -->
      <v-list-item
        v-if="playerList.length > 0"
        class="mb-1"
      >
        <field-label class="ml-4">Current Players</field-label>
        <v-list
          border
          class="py-0"
          :items="playerList"
          rounded
        >
          <!-- Player Item -->
          <template v-slot:item="{ props }">
            <v-list-item v-bind="props">
              <!-- Remove Button -->
              <template v-slot:append>
                <v-btn
                  density="comfortable"
                  icon="mdi-close"
                  variant="text"
                  @click="playerList.splice(playerList.indexOf(props.title), 1)"
                />
              </template>
            </v-list-item>
          </template>
        </v-list>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { OperatorPicker, PlaylistPicker } from '@/components';
import { Operator, Side } from '@/models';
import { useAppSettings, useMatchSettings } from '@/store';

// Include settings
const AppSettings = useAppSettings();
const MatchSettings = useMatchSettings();

// Update match settings in browser storage on change
MatchSettings.$subscribe(() => { MatchSettings.storeSettings(AppSettings.storeRecentPlayers); });

// Extract refs from MatchSettings
const {
  playlistKey,
  playlist,
  bannedOperatorKeys,
  playerList,
  recentPlayerList
} = storeToRefs(MatchSettings);

/**
 * The list of operators that can be banned in the picker.
 * @type {import('vue').ComputedRef<Operator[]>}
 */
const bannableOperators = computed(() => Operator.LIST.filter((o) => {
  if (playlist.value?.bannedOperators.includes(o)) return false;
  return o.bannable;
}));

/**
 * The lists of operators that were banned in the picker, split by side.
 * @type {import('vue').ComputedRef<{ [sideKey: string]: Operator[] }>}
 */
const bannedOperators = computed(() => {
  const bans = {};

  Side.ALL.included.forEach((side) => {
    bans[side.key] = Operator.LIST.filter((o) => o.side === side && bannedOperatorKeys.value.includes(o.key));
  });

  return bans;
});

/**
 * Either random picks an operator for empty slots or removes an operator for filled slots.
 * 
 * @param {Side}   side  The side of the clicked operator emblem.
 * @param {number} index The index of the clicked operator emblem.
 */
function onEmblemClick(side, index) {
  const operator = bannedOperators.value[side.key][index];

  // Remove present operator
  if (operator) bannedOperatorKeys.value.splice(bannedOperatorKeys.value.indexOf(operator.key), 1);

  // Randomly pick another operator
  else {
    const pool = bannableOperators.value.filter((o) => o.side === side && !bannedOperatorKeys.value.includes(o.key));
    const [pick] = Operator.pickRandomOperators(pool, { amount: 1 });
    if (pick) bannedOperatorKeys.value.push(pick.key);
  }
}

/** Replaces all banned operators with random operators. */
function banRandomOperators() {
  // Clear banned operators
  bannedOperatorKeys.value.length = 0;

  // Select two random attackers and defenders to ban
  Side.ALL.included.forEach((s) => {
    const pool = bannableOperators.value.filter((o) => o.side === s);
    const picks = Operator.pickRandomOperators(pool, { amount: 2, duplicates: false });
    bannedOperatorKeys.value.push(...picks.map((o) => o.key));
  });
}

/** Adds a newly entered player to the `MatchSettings.recentPlayerList`. */
function addRecentPlayer() {
  // Exit if storing recent players is disabled
  if (!AppSettings.storeRecentPlayers) return;

  // Add new players to `recentPlayerList`
  playerList.value.forEach((player) => {
    if (!recentPlayerList.value.includes(player)) recentPlayerList.value.push(player);
  });
}
</script>

<style scoped>
.clickable-avatar {
  cursor: pointer;
}
</style>
