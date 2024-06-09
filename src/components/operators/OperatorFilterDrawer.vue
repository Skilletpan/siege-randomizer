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

      <!-- Pick Duplicates -->
      <v-list-item
        :disabled="!!playlist"
        :subtitle="playlist ? 'Set by Playlist' : null"
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

      <v-divider />

      <!-- Match Settings -->
      <v-list-subheader
        class="mb-n1"
        title="Match Settings"
      />

      <!-- Playlist Selector -->
      <v-list-item>
        <playlist-picker
          v-model="playlist"
          placeholder="Custom"
        />
      </v-list-item>

      <!-- Operator Ban Picker -->
      <v-list-item>
        <v-autocomplete
          v-model="operatorBans"
          clearable
          clear-on-select
          :hide-details="!playlist?.bannedOperators.length"
          :hint="`${playlist?.bannedOperators.length} banned by playlist`"
          :items="bannableOperators"
          item-title="name"
          item-value="key"
          label="Operator Bans"
          multiple
          persistent-hint
          placeholder="None"
        >
          <!-- Selection Text -->
          <template #selection="{ index, item }">
            <template v-if="index === 0">
              <template v-if="operatorBans.length > 1">{{ operatorBans.length }} selected</template>
              <template v-else>{{ item.title }}</template>
            </template>
          </template>

          <!-- Operator Item -->
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-avatar
                  :image="toRaw(item.raw).emblem"
                  rounded="0"
                />
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-list-item>

      <v-divider class="mt-2" />

      <!-- Operator Filters -->
      <v-list-subheader
        class="mb-n1"
        title="Operator Filters"
      />

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
        <v-select
          v-model="primaryWeapons"
          clearable
          :items="WeaponClass.LIST"
          item-title="name"
          item-value="key"
          label="Primary Weapons"
          multiple
          placeholder="Any"
        >
          <!-- Selection Text -->
          <template #selection="{ index, item }">
            <template v-if="index === 0">
              <template v-if="primaryWeapons.length > 1">{{ primaryWeapons.length }} selected</template>
              <template v-else>{{ item.title }}</template>
            </template>
          </template>
        </v-select>
      </v-list-item>

      <!-- Secondary Weapons -->
      <v-list-item>
        <v-select
          v-model="secondaryWeapons"
          clearable
          :items="WeaponClass.LIST"
          item-title="name"
          item-value="key"
          label="Secondary Weapons"
          multiple
          placeholder="Any"
        >
          <!-- Selection Text -->
          <template #selection="{ index, item }">
            <template v-if="index === 0">
              <template v-if="secondaryWeapons.length > 1">{{ secondaryWeapons.length }} selected</template>
              <template v-else>{{ item.title }}</template>
            </template>
          </template>
        </v-select>
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
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, toRaw, watch, watchEffect } from 'vue';

import { PlaylistPicker, SquadPicker } from '@/components';
import { Gadget, Operator, OperatorRole, Playlist, Squad, WeaponClass } from '@/models';
import { usePlayers } from '@/stores';

// Register composables
const Players = usePlayers();

/**
 * The amount of operators to pick.
 * @type {import('vue').ModelRef<Number>}
 */
const pickAmount = defineModel('pickAmount', { default: 1, type: Number });

/**
 * Whether to use the current squad to determine the pick amount.
 * @type {import('vue').ModelRef<Boolean>}
 */
const useSquad = defineModel('useSquad', { default: 1, type: Boolean });

// Update pick amount if squad setting or squad size changes
watchEffect(() => {
  if (useSquad.value) {
    pickAmount.value = Math.max(Players.currentPlayers.length, 1);
  }
});

/**
 * Whether duplicate operator picks are allowed.
 * @type {import('vue').ModelRef<Boolean>}
 */
const pickDuplicates = defineModel('pickDuplicates', { type: Boolean });

/**
 * The playlist settings to use.
 * @type {import('vue').ModelRef<Playlist>}
 */
const playlist = defineModel('playlist', {
  get: (playlistKey) => Playlist[playlistKey] || null,
  type: String,
  validator: (v) => Object.keys(Playlist).includes(v)
});

// Watch for playlist updates
watch(playlist, (newPlaylist) => {
  if (newPlaylist) {
    // Set duplicate picks
    pickDuplicates.value = newPlaylist.isArcade;

    // Remove playlist banned operators from manual ban list
    operatorBans.value = operatorBans.value.filter((operator) => !newPlaylist.bannedOperators.includes(operator));
  }
});

/**
 * The manually banned operators.
 * @type {import('vue').ModelRef<Operator[]>}
 */
const operatorBans = defineModel('operatorBans', {
  default: [],
  get: (operatorKeys) => operatorKeys.map((operatorKey) => Operator[operatorKey]),
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(Operator).includes(_v))
});

/**
 * The manually bannable operators.
 * @type {import('vue').ComputedRef<Operator[]>}
 */
const bannableOperators = computed(() => {
  if (playlist.value) return playlist.value.allowedOperators;
  return Operator.LIST;
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
 * The roles of the operators.
 * @type {import('vue').ModelRef<OperatorRole[]>}
 */
const roles = defineModel('roles', {
  default: [],
  get: (roleKeys) => roleKeys.map((roleKey) => OperatorRole[roleKey]),
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(OperatorRole).includes(_v))
});

/**
 * The squad of the operators.
 * @type {import('vue').ModelRef<Squad>}
 */
const squad = defineModel('squad', {
  get: (squadKey) => Squad[squadKey] || null,
  type: String,
  validator: (v) => Object.keys(Squad).includes(v)
});

/**
 * The primary weapons of the operators.
 * @type {import('vue').ModelRef<WeaponClass[]>}
 */
const primaryWeapons = defineModel('primaryWeapons', {
  default: [],
  get: (primaryWeaponKeys) => primaryWeaponKeys.map((primaryWeaponKey) => WeaponClass[primaryWeaponKey]),
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(WeaponClass).includes(_v))
});

/**
 * The secondary weapons of the operators.
 * @type {import('vue').ModelRef<WeaponClass[]>}
 */
const secondaryWeapons = defineModel('secondaryWeapons', {
  default: [],
  get: (secondaryWeaponKeys) => secondaryWeaponKeys.map((secondaryWeaponKey) => WeaponClass[secondaryWeaponKey]),
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(WeaponClass).includes(_v))
});

/**
 * The gadgets of the operators.
 * @type {import('vue').ModelRef<Gadget[]>}
 */
const gadgets = defineModel('gadgets', {
  default: [],
  get: (gadgetKeys) => gadgetKeys.map((gadgetKey) => Gadget[gadgetKey]),
  type: Array,
  validator: (v) => v.every((_v) => Object.keys(Gadget).includes(_v))
});
</script>
