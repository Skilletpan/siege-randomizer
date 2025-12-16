<template>
  <v-dialog
    :model-value="!!operator"
    height="450"
    width="300"
    @after-leave="cleanup"
  >
    <v-card v-if="operator">
      <!-- Background Image -->
      <template #image>
        <v-img
          cover
          :src="SiegeStore.LEVEL_LIST[0].thumbnail.href"
        />
      </template>

      <!-- Portrait -->
      <v-img
        content-class="d-flex flex-column justify-end"
        cover
        position="center top"
        :src="operator.portrait.href"
      >
        <!-- Nameplate -->
        <operator-nameplate
          class="inspector-nameplate"
          :operator
        />

        <!-- Details -->
        <v-expand-transition>
          <div
            v-if="showDetails"
            class="inspector-details"
          >
            <v-divider />

            <!-- Tabs -->
            <v-tabs
              v-model="tab"
              :color="operator.side.color"
              density="compact"
              fixed-tabs
              :items="TABS"
            />

            <v-divider />

            <v-tabs-window v-model="tab">
              <!-- Details -->
              <v-tabs-window-item :value="1">
                <v-card-text class="d-flex flex-column ga-3 pa-3">
                  <!-- Speed & Armor Icons -->
                  <card-list-item
                    v-if="false"
                    label="Speed | Armor"
                  >
                    <v-icon
                      v-for="i in operator.speed"
                      color="green"
                      icon="mdi-run-fast"
                      size="20"
                    />

                    <v-divider vertical />

                    <v-icon
                      v-for="i in 4 - operator.speed"
                      color="blue"
                      icon="mdi-shield-half-full"
                      size="20"
                    />
                  </card-list-item>

                  <template v-else>
                    <!-- Speed -->
                    <card-list-item label="Speed">
                      <v-icon
                        v-for="i in operator.speed"
                        color="green"
                        icon="mdi-run-fast"
                        size="20"
                      />
                    </card-list-item>

                    <!-- Armor -->
                    <card-list-item label="Armor">
                      <v-icon
                        v-for="i in 4 - operator.speed"
                        color="blue"
                        icon="mdi-shield-half-full"
                        size="20"
                      />
                    </card-list-item>
                  </template>

                  <!-- Roles -->
                  <card-list-item
                    :chips="operator.roles"
                    label="Roles"
                  />

                  <v-divider />

                  <!-- Release -->
                  <card-list-item
                    :chips="[{ prefix: operator.metadata.released.key, text: operator.metadata.released.name }]"
                    label="Release"
                  />

                  <!-- Rework -->
                  <card-list-item
                    v-if="operator.metadata.reworked"
                    :chips="[{ prefix: operator.metadata.reworked.key, text: operator.metadata.reworked.name }]"
                    label="Rework"
                  />
                </v-card-text>
              </v-tabs-window-item>

              <!-- Loadout -->
              <v-tabs-window-item :value="2">
                <v-card-text class="d-flex flex-column ga-3 pa-3">
                  <!-- Shield -->
                  <card-list-item
                    v-if="operator.loadout.shield"
                    :chips="[{ prefix: operator.loadout.shield.category.key, text: operator.loadout.shield.name }]"
                    label="Shield"
                  />

                  <!-- Primary Weapons -->
                  <card-list-item
                    v-if="operator.loadout.primaries"
                    :chips="operator.loadout.primaries.map((w) => ({ prefix: w.category.key, text: w.name }))"
                    label="Primaries"
                  />

                  <!-- Secondary Weapons -->
                  <card-list-item
                    v-if="operator.loadout.secondaries"
                    :chips="operator.loadout.secondaries.map((w) => ({ prefix: w.category.key, text: w.name }))"
                    label="Secondaries"
                  />

                  <v-divider />

                  <!-- Gadgets -->
                  <card-list-item
                    :chips="gadgets"
                    label="Gadgets"
                  />
                </v-card-text>
              </v-tabs-window-item>

              <!-- Bio -->
              <v-tabs-window-item :value="3">
                <v-card-text class="d-flex flex-column ga-3 pa-3">
                  <!-- Name -->
                  <card-list-item
                    v-if="operator.biography.name"
                    :chips="[operator.biography.name]"
                    label="Name"
                  />

                  <!-- Birthplace -->
                  <card-list-item
                    v-if="operator.biography.birthplace"
                    label="Birthplace"
                    :chips="[{ prefix: birthplace!.prefix, text: birthplace!.text }]"
                  />

                  <v-divider v-if="operator.biography.name || operator.biography.birthplace" />

                  <!-- Organization -->
                  <card-list-item
                    v-if="operator.biography.organization"
                    :chips="[operator.biography.organization]"
                    label="Organization"
                  />

                  <!-- Squad -->
                  <card-list-item
                    v-if="operator.biography.squad"
                    label="Squad"
                  >
                    <v-chip
                      label
                      :prepend-avatar="operator.biography.squad.icon.href"
                      size="x-small"
                      :text="operator.biography.squad.name"
                    />
                  </card-list-item>
                </v-card-text>
              </v-tabs-window-item>
            </v-tabs-window>
          </div>
        </v-expand-transition>

        <!-- Details/Portrait Toggle -->
        <v-btn
          class="inspector-details-toggle"
          :class="{ expanded: showDetails }"
          :color="operator.side.color"
          flat
          icon="mdi-chevron-up"
          size="32"
          @click="showDetails = !showDetails"
        />
      </v-img>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import type { Operator } from '@/models';
import { useSiegeStore } from '@/stores';

// Composables
const SiegeStore = useSiegeStore();

/** The operator to inspect. */
const operator = defineModel<Operator>();

/** Controls visibility of operator details. */
const showDetails = ref(false);

/** The detail tabs. */
const TABS = [
  { text: 'Info', value: 1 },
  { text: 'Loadout', value: 2 },
  { text: 'Bio', value: 3 }
];

/** The currently active tab. */
const tab = ref(1);

/** The operator gadgets mapped to display chips. */
const gadgets = computed(() => operator.value?.loadout.gadgets.map((gadget) => ({
  text: gadget.name,
  suffix: gadget.amount > 1 ? `(x${gadget.amount})` : undefined
})));

/** The operator birthplace mapped to a display chip. */
const birthplace = computed(() => {
  if (!operator.value?.biography.birthplace) return undefined;

  const parts = operator.value.biography.birthplace.split(', ');
  return { text: parts.pop(), prefix: parts.join(', ') };
});

/** Resets the dialog to its empty state. */
function cleanup() {
  operator.value = undefined;
  showDetails.value = false;
  tab.value = 1;
}
</script>

<style lang="scss" scoped>
.inspector-nameplate,
.inspector-details {
  background-color: rgba(33, 33, 33, .95);
}

.inspector-details {
  height: calc(100%);
}

.inspector-details-toggle {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -150%);

  &.expanded {
    transform: translate(-50%, -37.5%) rotate(180deg);
  }
}
</style>
