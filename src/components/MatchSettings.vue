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

        <!-- Operator Item -->
        <template v-slot:item="{ item, props }">
          <v-list-item
            v-bind="props"
            :append-icon="Operator.valueOf(item.value).side.icon"
            :disabled="isDisabled(item.value)"
            :prepend-avatar="Operator.valueOf(item.value).emblem"
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

        <template
          v-for="list, i in [MatchSettings.bannedAttackers, MatchSettings.bannedDefenders]"
          :key="i"
        >
          <operator-emblem
            v-for="j in 2"
            :key="j"
            :class="{ 'clickable-avatar': !!list[j - 1] }"
            :color="list[j - 1] ? 'error' : null"
            :image="list[j - 1]?.emblem"
            rounded="rounded"
            variant="tonal"
            v-on="list[j - 1] ? { click: () => MatchSettings.removeOperatorBan(list[j - 1].key) } : {}"
          />

          <v-divider
            v-if="i === 0"
            vertical
          />
        </template>

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

// Update match settings in session storage
MatchSettings.$subscribe(() => {
  MatchSettings.storeSettings();
});

/** The items that are available in the operator picker. */
const operatorPickerItems = computed(() => Operator.LIST.filter((o) => (
  o.bannable && (!MatchSettings.playlist || !MatchSettings.playlist.bannedOperators.includes(o))
)));

/**
 * Checks whether an operator should be disabled in the ban picker.
 * 
 * @param {string} operatorKey The key of the operator to check.
 */
function isDisabled(operatorKey) {
  const operator = Operator.valueOf(operatorKey);

  if (operator.side === Side.ATT && MatchSettings.bannedAttackers.length >= 2) return true;
  if (operator.side === Side.DEF && MatchSettings.bannedDefenders.length >= 2) return true;
  return false;
}

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
</script>

<style scoped>
.clickable-avatar {
  cursor: pointer;
}
</style>
