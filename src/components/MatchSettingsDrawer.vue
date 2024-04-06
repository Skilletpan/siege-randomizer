<template>
  <v-navigation-drawer
    v-model="MatchSettings2.show"
    location="right"
    order="0"
    width="300"
  >
    <!-- Match Settings -->
    <v-list>
      <v-list-subheader
        class="text-h6"
        title="Lobby Settings"
      />

      <v-list-subheader title="Match" />

      <!-- Playlist Picker -->
      <v-list-item>
        <playlist-picker
          v-model="matchSettings.playlistKey"
          placeholder="Custom"
        />
      </v-list-item>

      <!-- Map Picker -->
      <v-list-item>
        <map-picker
          v-model="matchSettings.mapKey"
          :items="MatchSettings2.playlist?.maps || SiegeMap.LIST"
        />
      </v-list-item>

      <v-divider class="mt-2" />

      <v-list-subheader title="Features" />

      <v-list-item
        density="compact"
        :disabled="!!MatchSettings2.playlist"
        title="Operator Bans"
        @click="matchSettings.features.bans = !MatchSettings2.features.operatorBans"
      >
        <template #prepend>
          <v-list-item-action start>
            <v-checkbox-btn
              density="compact"
              :model-value="MatchSettings2.features.operatorBans"
            />
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-list-item
        density="compact"
        :disabled="!!MatchSettings2.playlist"
        title="Recruits"
        @click="matchSettings.features.recruits = !MatchSettings2.features.recruits"
      >
        <template #prepend>
          <v-list-item-action start>
            <v-checkbox-btn
              density="compact"
              :model-value="MatchSettings2.features.recruits"
            />
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-list-item
        density="compact"
        :disabled="!!MatchSettings2.playlist"
        title="Duplicate Picks"
        @click="matchSettings.features.duplicates = !MatchSettings2.features.duplicateOperators"
      >
        <template #prepend>
          <v-list-item-action start>
            <v-checkbox-btn
              density="compact"
              :model-value="MatchSettings2.features.duplicateOperators"
            />
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-list-item
        density="compact"
        :disabled="!!MatchSettings2.playlist"
        title="Mixed Teams"
        @click="matchSettings.features.mixed = !MatchSettings2.features.mixedTeams"
      >
        <template #prepend>
          <v-list-item-action start>
            <v-checkbox-btn
              density="compact"
              :model-value="MatchSettings2.features.mixedTeams"
            />
          </v-list-item-action>
        </template>
      </v-list-item>



      <!-- Banned Operators Picker -->
      <filter-drawer-item
        v-if="false"
        :disabled="!operatorBansEnabled"
        reason="Disabled by Playlist"
      >
        <template #default="{ disabled }">
          <operator-picker
            v-model="MatchSettings2.matchSettings.mapKey"
            :disabled="disabled"
            hide-selected
            :items="bannableOperators"
            label="Ban Operators"
            multiple
            :readonly="MatchSettings2.bannedOperators.length >= 4"
          >
            <!-- Selection Text -->
            <template #selection="{ index }">
              <template v-if="index === 0">{{ MatchSettings2.bannedOperators.length }}/4 Operators</template>
            </template>

            <!-- Random Bans Button -->
            <template
              v-if="operatorBansEnabled"
              #append-inner
            >
              <v-btn
                density="comfortable"
                icon="$randomize"
                variant="text"
                @click.stop="banRandomOperators"
              />
            </template>

            <!-- Operator Item -->
            <template #item="{ item, props }">
              <v-list-item
                v-show="operatorBansBySide[toRaw(item.raw).side.key].length < 2"
                v-bind="props"
              >
                <template #prepend>
                  <operator-emblem :image="props.prependAvatar" />
                </template>
              </v-list-item>
            </template>
          </operator-picker>
        </template>
      </filter-drawer-item>

      <filter-drawer-item v-if="false && operatorBansEnabled">
        <v-row
          class="align-center justify-space-around"
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
              <template #default="{ isHovering, props }">
                <operator-emblem
                  v-bind="props"
                  class="clickable-avatar"
                  :color="operatorBansBySide[i < 3 ? 'ATT' : 'DEF'][(i - 1) % 2] ? 'error' : null"
                  :icon="isHovering ? '$randomize' : 'mdi-help'"
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
      </filter-drawer-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, toRaw } from 'vue';

import { FilterDrawerItem, MapPicker, OperatorPicker, PlaylistPicker } from '@/components';
import { Operator, Side, SiegeMap } from '@/models';
import { useAppSettings, useMatchSettings, useMatchSettings2 } from '@/store';

// Include settings
const MatchSettings = useMatchSettings();
const MatchSettings2 = useMatchSettings2();

// Extract refs from settings
const { storeRecentPlayers } = storeToRefs(useAppSettings());
const {
  settings,

  operatorBans,
  operatorBansEnabled,
  bannableOperators
} = storeToRefs(MatchSettings);
const { matchSettings } = storeToRefs(MatchSettings2);
const {
  removeOperatorBan,

  storeSettings
} = MatchSettings;

// Update match settings in browser storage on change
MatchSettings.$subscribe(() => { storeSettings(storeRecentPlayers.value); });

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
