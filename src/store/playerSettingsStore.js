import { defineStore } from 'pinia';
import { ref } from 'vue';

// Load data from local storage and session storage
const storedData = JSON.parse(localStorage.getItem('players'));
const storedSessionData = JSON.parse(sessionStorage.getItem('players'));

export default defineStore('players', () => {
  /**
   * The list of player names.
   * @type {import('vue').Ref<String[]>}
   */
  const playerList = ref(storedSessionData?.players || []);

  /**
   * The list of recent player names.
   * @type {import('vue').Ref<String[]>}
   */
  const recentPlayers = ref(storedData?.recentPlayers || []);

  /**
   * Removes a player from the player list.
   * 
   * @param {string|number} player The name or index of the player to remove.
   */
  function removePlayer(player) {
    const index = typeof player === 'string' ? playerList.value.indexOf(player) : player;
    const [removedPlayer] = playerList.value.splice(index, 1);

    if (!recentPlayers.value.includes(removedPlayer)) recentPlayers.value.push(removedPlayer);
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

  /** Resets the store to its empty state. */
  function reset() {
    playerList.value.length = 0;
    recentPlayers.value.length = 0;
  }

  return { playerList, recentPlayers, removePlayer, removeRecentPlayer, reset };
});
