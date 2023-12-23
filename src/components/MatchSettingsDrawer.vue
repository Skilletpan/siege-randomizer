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
        <playlist-picker v-model="settings.playlist" />
      </v-list-item>

      <!-- Banned Operators Picker -->
      <v-list-item
        class="mb-1"
        :disabled="!operatorBansEnabled"
      >
        <operator-picker
          v-model="settings.operatorBans"
          class="mb-1"
          :hide-details="operatorBansEnabled"
          hide-selected
          hint="Disabled by Playlist"
          :items="bannableOperators"
          label="Ban Operators"
          multiple
          :persistent-hint="!operatorBansEnabled"
          :readonly="operatorBans.MANUAL.length >= 4"
          v-bind="!operatorBansEnabled ? { modelValue: [] } : {}"
        >
          <!-- Selection Text -->
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">{{ operatorBans.MANUAL.length }}/4 Operators</template>
          </template>

          <!-- Random Bans Button -->
          <template
            v-slot:append-inner
            v-if="operatorBansEnabled"
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
              :append-icon="toRaw(item.raw).side.icon"
              :disabled="operatorBansBySide[toRaw(item.raw).side.key].length >= 2"
              :prepend-avatar="toRaw(item.raw).emblem"
            />
          </template>
        </operator-picker>

        <!-- Banned Operators -->
        <v-row
          class="align-center justify-space-between pa-2"
          no-gutters
        >
          <!-- Attackers Icon -->
          <v-icon
            color="grey"
            :icon="Side.ATT.icon"
          />

          <!-- Operator Emblems -->
          <template
            v-for="i in 4"
            :key="i"
          >
            <v-hover>
              <template v-slot="{ isHovering, props }">
                <operator-emblem
                  v-bind="props"
                  class="clickable-avatar"
                  :color="operatorBansBySide[i < 3 ? 'ATT' : 'DEF'][(i - 1) % 2] ? 'error' : null"
                  :icon="isHovering ? 'mdi-dice-multiple-outline' : 'mdi-help'"
                  :image="operatorBansBySide[i < 3 ? 'ATT' : 'DEF'][(i - 1) % 2]?.emblem"
                  rounded="rounded"
                  variant="tonal"
                  @click="onEmblemClick(i - 1)"
                />
              </template>
            </v-hover>

            <v-divider
              v-if="i === 2"
              vertical
            />
          </template>

          <!-- Defenders Icon -->
          <v-icon
            color="grey"
            :icon="Side.DEF.icon"
          />
        </v-row>
      </v-list-item>

      <v-divider class="my-1" />

      <!-- Player Settings -->
      <v-list-subheader>Players</v-list-subheader>

      <!-- Player Input -->
      <v-list-item class="mb-1">
        <v-combobox
          ref="playerInput"
          v-model="settings.playerList"
          :hide-details="false"
          hide-selected
          :hint="playerList.length < 5 ? 'Press ENTER to add' : null"
          :items="recentPlayerList"
          label="Add Players"
          multiple
          persistent-counter
          :readonly="playerList.length >= 5"
          @update:focused="$refs.playerInput.search = ''"
          @update:model-value="addRecentPlayer($refs.playerInput.search, AppSettings.storeRecentPlayers)"
        >
          <!-- Selection -->
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">{{ playerList.length }}/5 Players</template>
          </template>

          <!-- Recent Player Item -->
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
                  @click.stop="removeRecentPlayer(item.title)"
                />
              </template>
            </v-list-item>
          </template>
        </v-combobox>
      </v-list-item>

      <!-- Player List -->
      <template v-if="playerList.length > 0">
        <field-label class="ml-8">Current Players</field-label>
        <v-list-item class="mb-1">
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
                    @click="removePlayer(props.title)"
                  />
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, toRaw } from 'vue';

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
  settings,

  operatorBans,
  operatorBansEnabled,
  bannableOperators,

  playerList,
  recentPlayerList
} = storeToRefs(MatchSettings);

// Extract methods from MatchSettings
const { removeOperatorBan, addRecentPlayer, removePlayer, removeRecentPlayer } = MatchSettings;

/**
 * Splits the manually banned operators by side.
 * @type {import('vue').ComputedRef<{ [sideKey: string]: Operator[] }>}
 */
const operatorBansBySide = computed(() => operatorBans.value.MANUAL.reduce(
  (bans, operator) => {
    bans[operator.side.key].push(operator);
    return bans;
  },
  { [Side.ATT.key]: [], [Side.DEF.key]: [] }
));

/** Replaces all banned operators with random operators. */
function banRandomOperators() {
  // Clear banned operators
  settings.value.operatorBans.length = 0;

  // Select two random attackers and defenders to ban
  Side.SIDES.forEach((s) => {
    const pool = bannableOperators.value.filter((o) => o.side === s);
    const picks = Operator.pickRandomOperators(pool, { amount: 2, duplicates: false });
    settings.value.operatorBans.push(...picks.map((o) => o.key));
  });
}

/**
 * Handles clicks on the operator ban emblem.
 * 
 * This will either remove an existing operator ban or pick a random operator to ban.
 * 
 * @param {number} index The index of the clicked emblem.
 */
function onEmblemClick(index) {
  // Get clicked operator
  const side = Side.valueOf(index < 2 ? 'ATT' : 'DEF');
  const operator = operatorBansBySide.value[side.key][index % 2];

  // Remove operator if present
  if (operator) removeOperatorBan(operator);

  // Pick random operator
  else {
    // Build operator pool
    const pool = bannableOperators.value.filter((o) => {
      if (o.side !== side) return false;
      return !operatorBans.value.MANUAL.includes(o);
    });

    // Pick operator from pool
    const [pick] = Operator.pickRandomOperators(pool, { amount: 1 });
    if (pick) settings.value.operatorBans.push(pick.key);
  }
}
</script>

<style scoped>
.clickable-avatar {
  cursor: pointer;
}
</style>
