import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { Operator, Playlist } from '@/models';

// Load data from sessionStorage
const storedLocalData = JSON.parse(localStorage.getItem('recent-players'));
const storedSessionData = JSON.parse(sessionStorage.getItem('match-settings'));

export default defineStore('match-settings', () => {
  /**
   * The key of the playlist selected in the match settings.
   * @type {import('vue').Ref<String>}
   */
  const playlistKey = ref(storedSessionData?.playlist || null);

  /**
   * The keys of the operators banned in the match settings.
   * @type {import('vue').Ref<String[]>}
   */
  const bannedOperatorKeys = ref(storedSessionData?.bannedOperators || []);

  /**
   * The players added in the match settings.
   * @type {import('vue').Ref<String[]>}
   */
  const playerList = ref(storedSessionData?.playerList || []);

  /**
   * The players that were recently added in the match settings.
   * @type {import('vue').Ref<String[]>}
   */
  const recentPlayerList = ref(storedLocalData || []);

  /**
   * The playlist selected in the match settings.
   * @type {import('vue').ComputedRef<Playlist>}
   */
  const playlist = computed(() => Playlist.valueOf(playlistKey.value));

  /**
   * All banned operators.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedOperators = computed(() => Operator.LIST.filter((o) => {
    if (playlist.value && playlist.value.bannedOperators.includes(o)) return true;
    if ((!playlist.value || playlist.value.canBanOperators) && bannedOperatorKeys.value.includes(o.key)) return true;
    return false;
  }));

  /**
   * Stores the current settings in the browser store.
   * 
   * @param {boolean} storeRecentPlayers Whether to store recent player names in browser storage.
   */
  function storeSettings(storeRecentPlayers) {
    // Store match settings in session storage
    const matchSettings = JSON.stringify({
      playlist: playlistKey.value,
      bannedOperators: bannedOperatorKeys.value,
      playerList: playerList.value
    });
    sessionStorage.setItem('match-settings', matchSettings);

    // Store recent players in local storage
    if (storeRecentPlayers) localStorage.setItem('recent-players', JSON.stringify(recentPlayerList.value));
  }

  /** Resets the store to its empty state. */
  function reset() {
    playlistKey.value = null;
    bannedOperatorKeys.value = null;
    playerList.value.length = 0;
    recentPlayerList.value.length = 0;
  }

  return {
    // Playlist
    playlistKey,
    playlist,

    // Banned Operators
    bannedOperatorKeys,
    bannedOperators,

    // Players
    playerList,
    recentPlayerList,

    storeSettings,

    reset
  };
});
