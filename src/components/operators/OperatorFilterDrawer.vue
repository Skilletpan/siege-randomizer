<template>
  <v-navigation-drawer
    location="right"
    width="300"
  >
    <v-list class="pt-1">
      <!-- Picker Settings -->
      <v-list-subheader
        class="mb-n1"
        title="Picker Settings"
      />

      <!-- Preset Selector -->
      <v-list-item>
        <playlist-picker
          v-model="preset"
          label="Preset"
          placeholder="Custom"
        />
      </v-list-item>

      <!-- Pick Amount -->
      <v-list-item :disabled="useSquad">
        <v-card color="#FFFFFF10">
          <v-label
            class="ml-4 text-caption"
            text="Pick Amount"
          />
          <v-btn-toggle
            v-model="pickAmount"
            class="d-flex flex-row rounded-t-0"
            color="primary"
            density="compact"
            mandatory
            variant="text"
          >
            <v-btn
              v-for="amount in 5"
              :key="amount"
              class="flex-grow-1"
              :icon="`mdi-numeric-${amount}`"
              :value="amount"
            >
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </v-list-item>

      <!-- Repick Cooldown -->
      <v-list-item>
        <v-card color="#FFFFFF10">
          <v-label
            class="ml-4 text-caption"
            text="Repick Cooldown"
          />
          <v-btn-toggle
            v-model="repickCooldown"
            class="d-flex flex-row rounded-t-0"
            color="primary"
            density="compact"
            mandatory
            variant="text"
          >
            <v-btn
              v-for="amount in [0, 1, 3, 5, 10]"
              :key="amount"
              class="flex-grow-1"
              :icon="`mdi-numeric-${amount}`"
              :value="amount"
            >
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </v-list-item>

      <!-- Pick Duplicates -->
      <v-list-item
        :disabled="!!preset"
        :subtitle="preset ? 'Set by Playlist' : null"
        title="Allow Duplicate Picks"
        @click="pickDuplicates = !pickDuplicates"
      >
        <template #prepend>
          <v-list-item-action>
            <v-switch
              v-model="pickDuplicates"
              color="primary"
              density="comfortable"
              hide-details
            />
          </v-list-item-action>
        </template>
      </v-list-item>

      <!-- Use Squad -->
      <v-list-item
        v-if="Players.currentPlayers.length > 0"
        title="Use Current Squad"
        @click="useSquad = !useSquad"
      >
        <template #prepend>
          <v-list-item-action>
            <v-switch
              v-model="useSquad"
              color="primary"
              density="comfortable"
              hide-details
            />
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-divider />

      <!-- Operator Filters -->
      <v-list-subheader
        class="mb-n1"
        title="Operator Filters"
      />

      <!-- Operator Ban Picker -->
      <v-list-item>
        <operator-picker
          v-model="bans"
          :hide-details="!Playlist[preset]?.bannedOperators.length"
          :hint="`${Playlist[preset]?.bannedOperators.length} banned by playlist`"
          :items="bannableOperators"
          label="Bans"
          multiple
          persistent-hint
          placeholder="None"
        />
      </v-list-item>

      <!-- Operator Speed -->
      <v-list-item>
        <v-card color="#FFFFFF10">
          <v-label
            class="ml-4 text-caption"
            text="Speed"
          />
          <v-btn-toggle
            v-model="speed"
            class="d-flex flex-row rounded-t-0"
            color="primary"
            density="compact"
            mandatory
            multiple
            variant="text"
          >
            <v-btn
              v-for="speed in 3"
              :key="speed"
              class="flex-grow-1"
              :icon="`mdi-numeric-${speed}`"
              :value="speed"
            >
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </v-list-item>

      <!-- Operator Roles -->
      <v-list-item>
        <v-select
          v-model="roles"
          clearable
          :items="OperatorRole.LIST"
          item-title="name"
          item-value="key"
          label="Roles"
          multiple
          placeholder="Any"
        />
      </v-list-item>

      <!-- Operator Squad -->
      <v-list-item>
        <squad-picker
          v-model="squad"
          placeholder="Any"
        />
      </v-list-item>

      <!-- Loadout Filters -->
      <v-list-subheader
        class="mb-n1"
        title="Loadout"
      />

      <!-- Primary Weapons -->
      <v-list-item>
        <weapon-picker
          v-model="primaryWeapons"
          label="Primary Weapons"
          multiple
          placeholder="Any"
          primary
        />
      </v-list-item>

      <!-- Secondary Weapons -->
      <v-list-item>
        <weapon-picker
          v-model="secondaryWeapons"
          label="Secondary Weapons"
          multiple
          placeholder="Any"
          secondary
        />
      </v-list-item>

      <!-- Gadgets -->
      <v-list-item>
        <v-select
          v-model="gadgets"
          clearable
          :items="Gadget.LIST"
          item-title="name"
          item-value="key"
          label="Gadgets"
          multiple
          placeholder="Any"
        >
          <!-- Selection Text -->
          <template #selection="{ index, item }">
            <template v-if="index === 0">
              <template v-if="gadgets.length > 1">{{ gadgets.length }} selected</template>
              <template v-else>{{ item.title }}</template>
            </template>
          </template>
        </v-select>
      </v-list-item>

      <v-divider class="mb-1 mt-2" />

      <!-- Reset Button -->
      <v-list-item>
        <v-btn
          block
          color="error"
          text="Reset"
          variant="tonal"
          @click="resetSettings"
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, watch, watchEffect } from 'vue';

import { OperatorPicker, PlaylistPicker, SquadPicker, WeaponPicker } from '@/components';
import { Gadget, Operator, OperatorRole, Playlist, Squad, WeaponClass } from '@/models';
import { usePlayers } from '@/stores';

// Register composables
const Players = usePlayers();

/**
 * The key of the playlist to use the settings from.
 * @type {import('vue').ModelRef<String>}
 */
const preset = defineModel('preset', {
  type: String,
  validator: (v) => Object.keys(Playlist).includes(v)
});

/**
 * The amount of operators to pick.
 * @type {import('vue').ModelRef<Number>}
 */
const pickAmount = defineModel('pickAmount', {
  default: 1,
  type: Number
});

/**
 * The amount of picks until an operator can be picked again for the same player.
 * @type {import('vue').ModelRef<Number>}
 */
const repickCooldown = defineModel('repickCooldown', {
  default: 5,
  type: Number
});

/**
 * Whether duplicate operator picks are allowed.
 * @type {import('vue').ModelRef<Boolean>}
 */
const pickDuplicates = defineModel('pickDuplicates', { type: Boolean });

/**
 * Whether to use the current squad to determine the pick amount.
 * @type {import('vue').ModelRef<Boolean>}
 */
const useSquad = defineModel('useSquad', { type: Boolean });

/**
 * The keys of the manually banned operators.
 * @type {import('vue').ModelRef<String[]>}
 */
const bans = defineModel('bans', {
  default: [],
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(Operator).includes(_v))
});

/**
 * The speed of the operators.
 * @type {import('vue').ModelRef<Number[]>}
 */
const speed = defineModel('speed', {
  default: [1, 2, 3],
  type: Array,
  validator: (v) => v.every((_v) => [1, 2, 3].includes(_v))
});

/**
 * The keys of the roles of the operators.
 * @type {import('vue').ModelRef<OperatorRole[]>}
 */
const roles = defineModel('roles', {
  default: [],
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(OperatorRole).includes(_v))
});

/**
 * The key of the squad of the operators.
 * @type {import('vue').ModelRef<String>}
 */
const squad = defineModel('squad', {
  type: String,
  validator: (v) => Object.keys(Squad).includes(v)
});

/**
 * The keys of the primary weapons of the operators.
 * @type {import('vue').ModelRef<String[]>}
 */
const primaryWeapons = defineModel('primaryWeapons', {
  default: [],
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(WeaponClass).includes(_v))
});

/**
 * The keys of the secondary weapons of the operators.
 * @type {import('vue').ModelRef<String[]>}
 */
const secondaryWeapons = defineModel('secondaryWeapons', {
  default: [],
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(WeaponClass).includes(_v))
});

/**
 * The keys of the gadgets of the operators.
 * @type {import('vue').ModelRef<String[]>}
 */
const gadgets = defineModel('gadgets', {
  default: [],
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(Gadget).includes(_v))
});

/**
 * The manually bannable operators.
 * @type {import('vue').ComputedRef<Operator[]>}
 */
const bannableOperators = computed(() => {
  if (preset.value) return Playlist[preset.value].allowedOperators;
  return Operator.LIST;
});

// Watch for preset updates
watch(preset, (playlistKey) => {
  if (playlistKey) {
    const playlist = Playlist[playlistKey];

    // Set duplicate picks
    pickDuplicates.value = playlist.isArcade;

    // Remove playlist banned operators from manual ban list
    bans.value = bans.value.filter((operatorKey) => !playlist.bannedOperators.includes(Operator[operatorKey]));
  }
});

// Update pick amount if squad setting or squad size changes
watchEffect(() => {
  if (useSquad.value) {
    // Update pick amount according to squad size
    pickAmount.value = Math.max(Players.currentPlayers.length, 1);

    // Reset `useSquad` when squad is emptied
    if (Players.currentPlayers.length === 0) useSquad.value = false;
  }
});

/**
 * Resets all filters to their default value.
 * 
 * Squad settings are preserved.
 */
function resetSettings() {
  // Picker settings
  preset.value = null;
  repickCooldown.value = 5;
  pickDuplicates.value = false;

  // Operator filters
  bans.value.length = 0;
  speed.value = [1, 2, 3];
  roles.value.length = 0;
  squad.value = null;

  // Loadout filters
  primaryWeapons.value.length = 0;
  secondaryWeapons.value.length = 0;
  gadgets.value.length = 0;
}
</script>
