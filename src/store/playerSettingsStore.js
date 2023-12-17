import { defineStore } from 'pinia';
import { ref } from 'vue';

// Load data from local storage and session storage
const storedData = JSON.parse(localStorage.getItem('player-settings'));
const storedSessionData = JSON.parse(sessionStorage.getItem('player-settings'));

export default defineStore('players', () => {
  /**
   * The list of player names.
   * @type {import('vue').Ref<String[]>}
   */
  const playerList = ref(storedSessionData?.playerList || []);

  /**
   * The list of recent player names.
   * @type {import('vue').Ref<String[]>}
   */
  const recentPlayers = ref(storedData?.recentPlayers || []);

  /**
   * Removes a player from the player list.
   * 
   * @param {string|number} player             The name or index of the player to remove.
   * @param {boolean}       storeRecentPlayers Whether recent players should be stored in `localStorage`.
   */
  function removePlayer(player, storeRecentPlayers) {
    const index = typeof player === 'string' ? playerList.value.indexOf(player) : player;
    const [removedPlayer] = playerList.value.splice(index, 1);

    // Add player to `recentPlayers` if storing recent players is enabled
    if (storeRecentPlayers && !recentPlayers.value.includes(removedPlayer)) {
      recentPlayers.value.push(removedPlayer);
    }
  }

  /**
   * Removes a player from the recent players list.
   * 
   * @param {string|number} player The name or index of the player to remove.
   */
  function removeRecentPlayer(player) {
    const index = typeof player === 'string' ? recentPlayers.value.indexOf(player) : player;
    recentPlayers.value.splice(index, 1);
  }

  /**
   * Stores the current settings in the browser store.
   * 
   * @param {boolean} storeRecentPlayers Whether recent players should be stored in `localStorage`.
   */
  function storeSettings(storeRecentPlayers) {
    // Update player list settings
    sessionStorage.setItem(
      'player-settings',
      JSON.stringify({ playerList: playerList.value })
    );

    if (storeRecentPlayers) {
      // Update recent player list settings
      localStorage.setItem(
        'player-settings',
        JSON.stringify({ recentPlayers: recentPlayers.value })
      );
    } else {
      // Remove recent player list settings
      localStorage.removeItem('player-settings');
    }
  }

  /** Resets the store to its empty state. */
  function reset() {
    playerList.value.length = 0;
    recentPlayers.value.length = 0;
  }

  return { playerList, recentPlayers, removePlayer, removeRecentPlayer, storeSettings, reset };
});
