<template>
  <v-dialog
    :model-value="!!operator"
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
        :aspect-ratio="2 / 3"
        content-class="d-flex flex-column justify-end"
        cover
        position="center top"
        :src="operator.portrait.href"
      >
        <!-- Nameplate -->
        <operator-nameplate
          class="inspector-nameplate px-2 py-3"
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
            >
              <template #item="{ item }">
                <!-- Details -->
                <v-tabs-window-item :value="item.value">
                  <v-divider />
                  <v-card-text class="d-flex flex-column ga-3 pa-3">
                    <!-- Details -->
                    <template v-if="item.value === 1">
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
                    </template>

                    <!-- Loadout -->
                    <template v-else-if="item.value === 2">
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
                    </template>

                    <!-- Bio -->
                    <template v-else>
                      <!-- Name -->
                      <card-list-item
                        v-if="operator.biography.name"
                        :chips="[operator.biography.name]"
                        label="Name"
                      />

                      <!-- Birthplace -->
                      <card-list-item
                        v-if="operator.biography.birthplace"
                        :chips="[{ prefix: birthplace!.prefix, text: birthplace!.text }]"
                        label="Birthplace"
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
                    </template>
                  </v-card-text>
                </v-tabs-window-item>
              </template>
            </v-tabs>
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
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import { useModalStore, useSiegeStore } from '@/stores';

// Composables
const ModalStore = useModalStore();
const SiegeStore = useSiegeStore();

/** The operator to inspect. */
const { inspectOperator: operator } = storeToRefs(ModalStore);

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
