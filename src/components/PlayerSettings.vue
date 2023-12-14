<template>
  <v-list v-bind="$props">
    <v-list-subheader>Players</v-list-subheader>

    <!-- Player Input -->
    <v-list-item class="mb-1">
      <v-text-field
        v-model="input"
        :append-inner-icon="input?.length ? 'mdi-send' : null"
        density="comfortable"
        :disabled="players.length >= 5"
        :hide-details="!input?.length"
        hint="Press ENTER to add"
        label="Add Player"
        persistent-placeholder
        placeholder="Enter player name..."
        variant="solo-filled"
        @click:append-inner="addPlayer"
        @update:focused="input = null"
        @keyup.enter="addPlayer"
      />
    </v-list-item>

    <!-- Player List -->
    <v-list-item v-if="players.length">
      <v-label class="d-block mb-1 text-caption">Player List</v-label>
      <v-list
        border
        class="py-0"
        rounded
        variant="plain"
      >
        <!-- Player Item -->
        <v-list-item
          v-for="player, index in players"
          :key="index"
          :title="player"
        >
          <!-- Remove Player Button -->
          <template v-slot:append>
            <v-list-item-action end>
              <v-btn
                density="comfortable"
                icon="mdi-delete"
                variant="text"
                @click="players.splice(index, 1); emit('update:players', players)"
              />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { ref } from 'vue';

// eslint-disable-next-line
const emit = defineEmits(['update:players']);

/** @type {import('vue').Ref<String>} The input value. */
const input = ref(null);

/** @type {import('vue').Ref<String[]>} The players in the list. */
const players = ref([]);

/** Adds a new player to the list. */
function addPlayer() {
  if (input.value) {
    players.value.push(input.value);
    input.value = null;

    emit('update:players', players.value);
  }
}
</script>
