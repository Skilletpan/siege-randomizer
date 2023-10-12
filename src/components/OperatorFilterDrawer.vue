<template>
  <v-navigation-drawer location="right">
    <v-list>
      <!-- Presets Selector -->
      <v-list-item>
        <v-select
          clearable
          density="comfortable"
          hide-details
          :items="Object.keys(PRESETS)"
          label="Preset"
          persistent-placeholder
          placeholder="Casual"
          variant="solo-filled"
          @update:model-value="loadPreset($event)"
        >
          <!-- Preset Item -->
          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              lines="two"
              :subtitle="PRESETS[item.value].modes"
            />
          </template>
        </v-select>
      </v-list-item>

      <v-divider class="mt-2" />

      <!-- Banned Operators Selector -->
      <v-list-subheader title="Bans" />
      <v-list-item>
        <v-select
          v-model="settings.bans"
          clearable
          density="comfortable"
          hide-details
          :items="OPERATOR_LIST"
          item-title="name"
          item-value="key"
          label="Banned Operators"
          multiple
          persistent-placeholder
          placeholder="0 selected"
          variant="solo-filled"
        >
          <!-- Selection Display -->
          <template v-slot:selection="{ index }">
            <template v-if="index === 0">{{ settings.bans.length }} selected</template>
          </template>

          <!-- Operator Item -->
          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              :append-avatar="loadEmblem(item.value)"
            />
          </template>
        </v-select>
      </v-list-item>

      <v-divider class="mt-2" />

      <!-- Duplicate Picks Switch -->
      <v-list-subheader title="Picks" />
      <v-list-item class="pt-0">
        <v-switch
          v-model="settings.duplicates"
          density="comfortable"
          hide-details
          inset
          label="Duplicate Picks"
          @update:model-value="emit('update:duplicates', $event)"
        />
      </v-list-item>

      <v-divider />

      <!-- Speed & Health Checkboxes -->
      <v-list-subheader title="Speed & Health" />
      <v-list-item
        v-for="s in 3"
        :key="s"
        class="pl-3 py-0"
      >
        <v-checkbox
          v-model="settings.speed"
          density="comfortable"
          hide-details
          :label="`${s} Speed | ${4 - s} Health`"
          :value="s"
        />
      </v-list-item>

      <v-divider />

      <!-- Role Selectors -->
      <v-list-subheader title="Roles" />
      <v-list-item
        v-for="i in 2"
        :key="i"
      >
        <v-select
          v-model="settings.roles[i - 1]"
          class="mb-2"
          clearable
          density="comfortable"
          hide-details
          :items="ROLE_LIST.filter((r) => r.key !== settings.roles[i % 2])"
          item-title="name"
          item-value="key"
          label="Role"
          persistent-placeholder
          placeholder="Any"
          variant="solo-filled"
        />
      </v-list-item>

      <!-- Reset Role Selectors Button -->
      <v-list-item>
        <v-btn
          block
          color="primary"
          text="Reset Roles"
          @click="settings.roles = [null, null]"
        />
      </v-list-item>

      <v-divider class="mt-2" />

      <!-- Squad Selector -->
      <v-list-subheader title="Squad" />
      <v-list-item>
        <v-select
          v-model="settings.squad"
          clearable
          density="comfortable"
          hide-details
          :items="SQUAD_LIST"
          item-title="name"
          item-value="key"
          label="Squad"
          persistent-placeholder
          placeholder="Any"
          variant="solo-filled"
        >
          <!-- Squad Emblem -->
          <template
            v-if="settings.squad"
            v-slot:append-inner
          >
            <v-avatar
              :image="loadSquadEmblem(settings.squad)"
              rounded="0"
            />
          </template>

          <!-- Squad Item -->
          <template v-slot:item="{ item, props }">
            <v-list-item
              v-bind="props"
              :append-avatar="loadSquadEmblem(item.value)"
            />
          </template>
        </v-select>
      </v-list-item>

      <v-divider class="mt-2" />

      <!-- Reset Button -->
      <v-list-item>
        <v-btn
          block
          class="mt-2"
          color="primary"
          text="Reset Filters"
          @click="loadPreset()"
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, defineEmits, defineExpose, ref, watch } from 'vue';

import { loadEmblem, loadSquadEmblem } from '@/composables/imageLoader';
import { OPERATORS, OPERATOR_LIST, ROLE_LIST, SQUAD_LIST } from '@/data';

// Define static properties
const DEFAULT_PRESET = {
  bans: [],
  duplicates: false,
  roles: [null, null],
  speed: [1, 2, 3],
  squad: null
};

const PRESETS = {
  Competitive: {
    bans: [OPERATORS.RECRUIT_ATT.key, OPERATORS.RECRUIT_DEF.key],
    modes: 'Competitive, Ranked, Standard'
  },
  Casual: {
    modes: 'Quick Match'
  },
  'Arcade 1': {
    bans: [OPERATORS.RECRUIT_ATT.key, OPERATORS.RECRUIT_DEF.key],
    duplicates: true,
    modes: 'Weapons Roulette, Golden Gun, Snipers Only'
  },
  'Arcade 2': {
    bans: [OPERATORS.MONTAGNE.key, OPERATORS.BLITZ.key, OPERATORS.CLASH.key, OPERATORS.RECRUIT_ATT.key, OPERATORS.RECRUIT_DEF.key],
    duplicates: true,
    modes: 'Free for All, Deathmatch'
  }
}

// Define dynamic properties
const settings = ref(structuredClone(DEFAULT_PRESET));

// Define computed properties
const operatorPool = computed(() => {
  const { bans, roles, speed, squad } = settings.value;

  return OPERATOR_LIST.filter((o) => [
    !bans.includes(o.key),                          // Bans
    speed.includes(o.speed),                        // Speed
    roles.every((r) => !r || o.roles.includes(r)),  // Roles
    !squad || o.squad === squad                     // Squad
  ].every((isTrue) => isTrue));
});

// Define emits
const emit = defineEmits([
  'update:duplicates',
  'update:operators'
]);

// Emit operator pool update
watch(
  operatorPool,
  (newPool) => { emit('update:operators', newPool); },
  { immediate: true }
);

/**
 * Adds an operator to the ban list.
 * 
 * @param {String} operatorKey The operator key to add to the ban list.
 */
function addBan(operatorKey) {
  settings.value.bans.push(operatorKey);
}

/**
 * Loads preset filter settings.
 * 
 * @param {String} [preset] The preset to load. If omitted, default values are restored.
 */
function loadPreset(preset = null) {
  Object.assign(settings.value, structuredClone(DEFAULT_PRESET), structuredClone(PRESETS[preset]));
}

// Expose the addBan function
defineExpose({ addBan });
</script>
