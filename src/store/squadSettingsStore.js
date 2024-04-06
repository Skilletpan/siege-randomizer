import { defineStore } from 'pinia';
import { computed, ref, watch, watchEffect } from 'vue';

// Load data from browser storage
const local = JSON.parse(localStorage.getItem('squad-settings')) || {};
const session = JSON.parse(sessionStorage.getItem('squad-settings')) || {};

export default defineStore('squad-settings', () => {
  /**
   * The raw and editable squad setting values.
   * @type {import('vue').Ref<{ currentSquad: String[], recentPlayers: String[], saveRecentPlayers: Boolean }>}
   */
  const squadSettings = ref({
    currentSquad: session.current || [],
    recentPlayers: local.recent || [],
    saveRecentPlayers: Object.hasOwn(local, 'saveRecent') ? local.saveRecent : true
  });

  /**
   * The squad that is currently entered.
   * @type {import('vue').ComputedRef<String[]>}
   */
  const currentSquad = computed(() => Array.from(squadSettings.value.currentSquad));

  /**
   * The players that have been entered previously.
   * @type {import('vue').ComputedRef<String[]>}
   */
  const recentPlayers = computed(() => squadSettings.value.recentPlayers
    .filter((playerName) => !currentSquad.value.includes(playerName)));

  /**
   * Whether player names should be stored to pick from a list of recent players.
   * @type {import('vue').ComputedRef<Boolean>}
   */
  const saveRecentPlayers = computed(() => squadSettings.value.saveRecentPlayers);

  /**
   * Adds a new player to the current squad.
   * 
   * @param {string} playerName The name of the player.
   * 
   * @returns {boolean} Whether the player has been added.
   */
  function addPlayer(playerName) {
    // Skip empty entries and players already in squad
    if (!playerName || currentSquad.value.includes(playerName)) return false;

    // Add player
    squadSettings.value.currentSquad.push(playerName);
    squadSettings.value.currentSquad.sort();

    // Store player in recent list
    if (saveRecentPlayers.value && !recentPlayers.value.includes(playerName)) {
      squadSettings.value.recentPlayers.push(playerName);
      squadSettings.value.recentPlayers.sort();
    }

    return true;
  }

  /**
   * Removes a player from the current squad.
   * 
   * @param {string} playerName The name of the player to remove.
   */
  function removePlayer(playerName) {
    if (!playerName || !currentSquad.value.includes(playerName)) return;

    const index = currentSquad.value.indexOf(playerName);
    squadSettings.value.currentSquad.splice(index, 1);
  }

  /**
   * Removes a player from the recent players list.
   * 
   * @param {string} playerName The name of the player to remove.
   */
  function removeRecentPlayer(playerName) {
    if (!playerName || !recentPlayers.value.includes(playerName)) return;

    const index = recentPlayers.value.indexOf(playerName);
    squadSettings.value.recentPlayers.splice(index, 1);
  }

  // Handle `storeRecentPlayers` value change
  watch(saveRecentPlayers, (shouldStorePlayers) => {
    // Add current squad to recent players
    if (shouldStorePlayers) squadSettings.value.recentPlayers.push(...currentSquad.value);

    // Reset recent players list
    else squadSettings.value.recentPlayers.length = 0;
  });

  // Store updates in browser storage
  watchEffect(() => {
    const {
      currentSquad: _currentSquad,
      recentPlayers: _recentPlayers,
      saveRecentPlayers: _saveRecentPlayers
    } = squadSettings.value;

    // Store session storage values
    sessionStorage.setItem(
      'squad-settings',
      JSON.stringify({ current: _currentSquad })
    );

    // Store local storage values
    localStorage.setItem(
      'squad-settings',
      JSON.stringify({
        recent: _recentPlayers,
        saveRecent: _saveRecentPlayers
      })
    );
  });

  return {
    squadSettings,

    // Values
    currentSquad,
    recentPlayers,
    saveRecentPlayers,

    // Methods
    addPlayer,
    removePlayer,
    removeRecentPlayer
  };
});
