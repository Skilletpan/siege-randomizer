<template>
  <v-list v-bind="$props">
    <v-list-subheader>Operator Details</v-list-subheader>

    <!-- Speeds -->
    <v-list-item class="mb-1 text-center">
      <v-label class="d-flex text-caption">Speed</v-label>

      <v-btn-toggle
        color="primary"
        density="comfortable"
        divided
        multiple
        variant="plain"
        @update:model-value="emit('update:speed', $event)"
      >
        <v-btn
          v-for="i in 3"
          :key="i"
          :text="`${i} Speed`"
          :value="i"
        />
      </v-btn-toggle>
    </v-list-item>

    <!-- Roles -->
    <v-list-item class="mb-1">
      <v-select
        clearable
        density="comfortable"
        hide-details
        :items="Role.LIST"
        item-title="name"
        item-value="key"
        label="Roles"
        multiple
        persistent-placeholder
        placeholder="Select..."
        variant="solo-filled"
        @update:model-value="emit('update:role', $event)"
      />
    </v-list-item>

    <!-- Squad -->
    <v-list-item class="mb-1">
      <squad-picker @update:model-value="emit('update:squad', $event)" />
    </v-list-item>

    <v-divider class="my-2" />

    <v-list-subheader>Loadout</v-list-subheader>

    <!-- Primary Weapon -->
    <v-list-item class="mb-1">
      <v-select
        clearable
        density="comfortable"
        hide-details
        :items="Weapon.LIST.filter((w) => w.isPrimary)"
        item-title="name"
        item-value="key"
        label="Primary Weapon"
        multiple
        persistent-placeholder
        placeholder="All"
        variant="solo-filled"
        @update:model-value="emit('update:primary', $event)"
      />
    </v-list-item>

    <!-- Secondary Weapon -->
    <v-list-item class="mb-1">
      <v-select
        clearable
        density="comfortable"
        hide-details
        :items="Weapon.LIST.filter((w) => w.isSecondary)"
        item-title="name"
        item-value="key"
        label="Secondary Weapon"
        multiple
        persistent-placeholder
        placeholder="All"
        variant="solo-filled"
        @update:model-value="emit('update:secondary', $event)"
      />
    </v-list-item>

    <!-- Gadget -->
    <v-list-item class="mb-1">
      <v-select
        clearable
        density="comfortable"
        hide-details
        :items="Gadget.LIST"
        item-title="name"
        item-value="key"
        label="Gadget"
        multiple
        persistent-placeholder
        placeholder="All"
        variant="solo-filled"
        @update:model-value="emit('update:gadget', $event)"
      />
    </v-list-item>
  </v-list>
</template>

<script setup>
import { SquadPicker } from '@/components';
import { Gadget, Role, Weapon } from '@/models';

// eslint-disable-next-line
const props = defineProps({
  playlist: {
    type: String
  }
});

// eslint-disable-next-line
const emit = defineEmits([
  'update:speed',
  'update:role',
  'update:squad',
  'update:primary',
  'update:secondary',
  'update:gadget'
]);
</script>
