import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';

import useAppSettings from './appSettingsStore';

// Set default values
const RAW_VALUES = {
  currentPlayers: [],
  players: []
};

// Load values from localStorage and sessionStorage
const LOCAL_VALUES = JSON.parse(localStorage.getItem('players')) || {};
const SESSION_VALUES = JSON.parse(sessionStorage.getItem('players')) || {};
Object.keys(RAW_VALUES).forEach((key) => {
  if (LOCAL_VALUES && Object.hasOwn(LOCAL_VALUES, key)) RAW_VALUES[key] = LOCAL_VALUES[key];
  else if (LOCAL_VALUES && Object.hasOwn(SESSION_VALUES, key)) RAW_VALUES[key] = SESSION_VALUES[key];
});

export default defineStore('players', () => {
  // Register composables
  const AppSettings = useAppSettings();

  /**
   * The list of currently active players.
   * @type {import('vue').Ref<String[]>}
   */
  const currentPlayers = ref(RAW_VALUES.currentPlayers);

  /**
   * The list of stored player names.
   * @type {import('vue').Ref<String[]>}
   */
  const storedPlayers = ref(RAW_VALUES.players);

  /**
   * Adds a player to the `storedPlayers` list.
   * 
   * @param {string} playerName The player name to add.
   */
  function addPlayer(playerName) {
    // Abort if `storePlayerNames` is disabled
    if (!AppSettings.storePlayerNames) return;

    // Add player name to list
    const _players = new Set(Array.from(storedPlayers.value));
    _players.add(playerName);
    storedPlayers.value = Array.from(_players).sort();
  }

  /**
   * Removes a player from the `storedPlayers` list.
   * 
   * @param {string} playerName The player name to remove.
   */
  function removePlayer(playerName) {
    const index = storedPlayers.value.indexOf(playerName);
    if (index !== -1) storedPlayers.value.splice(index, 1);
  }

  // Clear recent players list if setting changes
  watchEffect(() => {
    if (!AppSettings.storePlayerNames) storedPlayers.value.length = 0;
  });

  // Update player list in localStorage
  watchEffect(() => {
    localStorage.setItem('players', JSON.stringify({
      players: storedPlayers.value
    }));
  });

  // Update current player list in sessionStorage
  watchEffect(() => {
    sessionStorage.setItem('players', JSON.stringify({
      currentPlayers: currentPlayers.value
    }));
  })

  return {
    currentPlayers,
    storedPlayers,
    addPlayer,
    removePlayer
  };
});
