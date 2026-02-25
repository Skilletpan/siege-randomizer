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
          class="inspector-overlay px-2 py-3"
          :operator
        />

        <!-- Details -->
        <v-expand-transition>
          <div
            v-if="showDetails"
            class="inspector-details inspector-overlay"
          >
            <!-- Tabs -->
            <v-tabs
              v-model="tab"
              :color="operator.gameplay.side.color"
              density="compact"
              fixed-tabs
              :items="TABS"
            >
              <template #item="{ item }">
                <!-- Details -->
                <v-tabs-window-item :value="item.value">
                  <!-- Info -->
                  <template v-if="item.value === 1">
                    <!-- Gameplay -->
                    <display-list-section label="Gameplay">
                      <!-- Role -->
                      <display-list-item
                        label="Role"
                        :items="operator.gameplay.side"
                        item-text="roleName"
                        :item-props="(side: Side) => ({ appendIcon: side.icon })"
                      />

                      <!-- Specialties -->
                      <display-list-item
                        label="Specialties"
                        :items="operator.gameplay.specialties"
                      />

                      <!-- Speed & Armor -->
                      <display-list-item label="Speed & Armor">
                        <!-- Speed / Armor Icon -->
                        <v-icon
                          v-for="i in 4"
                          :class="`order-${i}`"
                          :color="i > operator.gameplay.speed ? 'blue' : 'green'"
                          :icon="i > operator.gameplay.speed ? 'mdi-shield-half-full' : 'mdi-run-fast'"
                          size="20"
                        />

                        <!-- Divider -->
                        <v-divider
                          class="mx-1"
                          :class="`order-${operator.gameplay.speed}`"
                          vertical
                        />
                      </display-list-item>
                    </display-list-section>

                    <!-- Metadata -->
                    <display-list-section label="Metadata">
                      <!-- Release Season -->
                      <display-list-item
                        label="Release"
                        :items="operator.metadata.released"
                        :item-prefix="(season: Season) => season.id === 0 ? undefined : season.key"
                        item-text="fullName"
                        divided
                      />

                      <!-- Rework Season -->
                      <display-list-item
                        v-if="operator.metadata.reworked"
                        label="Rework"
                        :items="operator.metadata.reworked"
                        item-prefix="key"
                        item-text="fullName"
                        divided
                      />
                    </display-list-section>
                  </template>

                  <!-- Loadout -->
                  <template v-else-if="item.value === 2">
                    <!-- Weapons -->
                    <display-list-section label="Weapons">
                      <!-- Shield -->
                      <display-list-item
                        v-if="operator.loadout.weapons.shield"
                        label="Shield"
                        :items="operator.loadout.weapons.shield"
                        item-prefix="category.key"
                        item-text="name"
                        divided
                      />

                      <!-- Primary Weapons -->
                      <display-list-item
                        v-if="operator.loadout.weapons.primary"
                        label="Primary"
                        :items="operator.loadout.weapons.primary"
                        item-prefix="category.key"
                        item-text="name"
                        divided
                      />

                      <!-- Secondary Weapons -->
                      <display-list-item
                        v-if="operator.loadout.weapons.secondary"
                        label="Secondary"
                        :items="operator.loadout.weapons.secondary"
                        item-prefix="category.key"
                        item-text="name"
                        divided
                      />
                    </display-list-section>

                    <!-- Gadgets & Abilities -->
                    <display-list-section label="Gadgets & Abilities">
                      <!-- Unique Ability -->
                      <display-list-item
                        label="Unique Ability"
                        :items="operator.loadout.gadgets.primary"
                      />

                      <!-- Gadgets -->
                      <display-list-item
                        label="Gadgets"
                        :items="operator.loadout.gadgets.secondary"
                        item-text="name"
                        :item-suffix="(gadget: Gadget) => 'x' + gadget.amount"
                        divided
                      />
                    </display-list-section>
                  </template>

                  <!-- Lore -->
                  <template v-else>
                    <!-- Biography -->
                    <display-list-section
                      v-if="operator.lore.biography"
                      label="Biography"
                    >
                      <!-- Name -->
                      <display-list-item
                        v-if="operator.lore.biography.lastName"
                        label="Name"
                        :items="operator.lore.biography"
                        item-prefix="givenName"
                        item-text="lastName"
                        item-suffix="givenNameRight"
                      />

                      <!-- Birthplace -->
                      <display-list-item
                        v-if="operator.lore.biography.nationality"
                        label="Birthplace"
                        :items="operator.lore.biography"
                        item-prefix="birthplace"
                        item-text="nationality"
                        divided
                      />

                      <!-- Birthday -->
                      <display-list-item
                        label="Birthday"
                        :items="operator.lore.biography"
                        item-text="birthday"
                        :item-suffix="(bio: Operator['lore']['biography']) => bio!.age ? 'Age ' + bio!.age : undefined"
                        divided
                      />
                    </display-list-section>

                    <!-- Affiliations -->
                    <display-list-section
                      v-if="operator.lore.affiliations"
                      label="Affiliations"
                    >
                      <!-- Organization -->
                      <display-list-item
                        v-if="operator.lore.affiliations.organization"
                        label="Organization"
                        :items="operator.lore.affiliations.organization"
                      />

                      <!-- Squad -->
                      <display-list-item
                        v-if="operator.lore.affiliations.squad"
                        label="Squad"
                        :items="operator.lore.affiliations.squad"
                        divided
                      />
                    </display-list-section>
                  </template>
                </v-tabs-window-item>
              </template>
            </v-tabs>
          </div>
        </v-expand-transition>

        <!-- Details/Portrait Toggle -->
        <v-btn
          class="inspector-details-toggle"
          :class="{ expanded: showDetails }"
          :color="operator.gameplay.side.color"
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
import { ref } from 'vue';

import type { Gadget, Operator, Season, Side } from '@/models';
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
  { text: 'Lore', value: 3 }
];

/** The currently active tab. */
const tab = ref(1);

/** Resets the dialog to its empty state. */
function cleanup() {
  operator.value = undefined;
  showDetails.value = false;
  tab.value = 1;
}
</script>

<style lang="scss" scoped>
.inspector-overlay {
  background-color: rgba(var(--v-theme-surface), .95);
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
