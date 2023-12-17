<template>
  <v-list v-bind="$attrs">
    <v-list-subheader>Match Settings</v-list-subheader>

    <!-- Playlist Picker -->
    <v-list-item class="mb-1">
      <playlist-picker v-model="MatchSettings.playlistKey" />
    </v-list-item>

    <!-- Operator Bans -->
    <v-list-item
      class="mb-1"
      :disabled="MatchSettings.playlist && !MatchSettings.playlist.canBanOperators"
    >
      <operator-picker
        v-model="MatchSettings.manualBanKeys"
        hide-selected
        :items="operatorPickerItems"
        label="Banned Operators"
        multiple
        :readonly="MatchSettings.manualBans.length >= 4"
        :selection-text="`${MatchSettings.manualBans.length} selected`"
      >
        <template v-slot:append-inner>
          <v-icon
            icon="mdi-dice-multiple-outline"
            @click.prevent="banRandomOperators"
          />
        </template>
      </operator-picker>
    </v-list-item>

    <!-- Banned Operators -->
    <v-list-item
      v-if="!MatchSettings.playlist || MatchSettings.playlist.canBanOperators"
      class="mb-1"
    >
      <v-list-item-title class="align-center d-flex justify-space-around">
        <v-icon :icon="Side.ATT.icon" />

        <v-avatar
          v-for="i in 2"
          :key="i"
          :color="MatchSettings.bannedAttackers[i - 1] ? 'error' : null"
          icon="mdi-help"
          :image="MatchSettings.bannedAttackers[i - 1]?.emblem"
          rounded="rounded"
          variant="tonal"
        />

        <v-divider vertical />

        <v-avatar
          v-for="i in 2"
          :key="i"
          :color="MatchSettings.bannedDefenders[i - 1] ? 'error' : null"
          icon="mdi-help"
          :image="MatchSettings.bannedDefenders[i - 1]?.emblem"
          rounded="rounded"
          variant="tonal"
        />

        <v-icon :icon="Side.DEF.icon" />
      </v-list-item-title>
    </v-list-item>

    <!-- Reset Button -->
    <v-list-item class="mb-1">
      <v-btn
        block
        color="primary"
        text="Reset"
        @click="MatchSettings.reset"
      />
    </v-list-item>
  </v-list>
</template>

<script setup>
import { computed } from 'vue';

import { OperatorPicker, PlaylistPicker } from '@/components';
import { Operator, Side } from '@/models';
import { useMatchSettings } from '@/store';

// Create match settings store
const MatchSettings = useMatchSettings();

/** The items that are available in the operator picker. */
const operatorPickerItems = computed(() => Operator.LIST.filter((o) => (
  o.bannable && (!MatchSettings.playlist || !MatchSettings.playlist.bannedOperators.includes(o))
)));

/** Bans random operators from the `operatorPickerItems` list. */
function banRandomOperators() {
  const operators = [];

  Side.ALL.included.forEach((s) => {
    const pool = operatorPickerItems.value.filter((o) => o.side === s);
    operators.push(...Operator.pickRandomOperators(pool, { amount: 2, duplicates: false }));
  });

  MatchSettings.manualBanKeys.length = 0;
  MatchSettings.manualBanKeys.push(...operators.map((o) => o.key));
}

// Update app settings in session storage
MatchSettings.$subscribe(
  (_, state) => {
    sessionStorage.setItem('match-settings', JSON.stringify({
      playlist: state.playlistKey,
      bans: [...state.manualBanKeys]
    }));
  }
);
</script>
