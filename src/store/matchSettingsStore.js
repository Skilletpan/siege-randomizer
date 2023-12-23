import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { Map, Operator, Playlist } from '@/models';

// Load data from sessionStorage
const storedLocalData = JSON.parse(localStorage.getItem('recent-players'));
const storedSessionData = JSON.parse(sessionStorage.getItem('match-settings'));

export default defineStore('match-settings', () => {
  /**
   * @typedef {Object} Settings The raw settings values.
   * 
   * @prop {string}   playlist         The key of the playlist selected in the match settings.
   * @prop {string}   map              The key of the map selected in the match settings.
   * @prop {string[]} operatorBans     The keys of the banned operators in the match settings.
   * @prop {string[]} playerList       The list of players added in the match settings.
   * @prop {string[]} recentPlayerList The list of recent players.
   */

  /**
   * The raw settings values.
   * @type {import('vue').Ref<Settings>}
   */
  const settings = ref({
    // Match Settings
    playlist: storedSessionData?.playlist || null,
    map: storedSessionData?.map || null,

    // Operator Bans
    operatorBans: storedSessionData?.operatorBans || [],

    // Players
    playerList: storedSessionData?.playerList || [],
    recentPlayerList: storedLocalData || []
  });

  // #region Match Settings
  /**
   * The playlist selected in the match settings.
   * @type {import('vue').ComputedRef<Playlist>}
   */
  const playlist = computed(() => Playlist.valueOf(settings.value.playlist));

  /**
   * The map selected in the match settings.
   * @type {import('vue').ComputedRef<Map>}
   */
  const map = computed(() => Map.valueOf(settings.value.map));

  /**
   * The maps available to pick in the match settings.
   * @type {import('vue').ComputedRef<Map[]>}
   */
  const pickableMaps = computed(() => playlist.value?.maps || Map.LIST);
  // #endregion

  // #region Operator Bans
  /**
   * Whether manual operator bans are enabled.
   * @type {import('vue').ComputedRef<Boolean>}
   */
  const operatorBansEnabled = computed(() => !playlist.value || playlist.value.canBanOperators);

  /**
   * All operators that are banned in the current match.
   * 
   * This includes playlist bans and manual bans.
   * 
   * @type {import('vue').ComputedRef<{ ALL: Operator[], PLAYLIST: Operator[], MANUAL: Operator[] }>}
   */
  const operatorBans = computed(() => Operator.LIST.reduce(
    (bans, operator) => {
      // Include playlist banned operators
      if (playlist.value?.bannedOperators.includes(operator)) {
        bans.ALL.push(operator);
        bans.PLAYLIST.push(operator);
      }

      // Skip manual bans if disabled
      if (!operatorBansEnabled.value) return bans;

      // Include manually banned operators
      if (settings.value.operatorBans.includes(operator.key)) {
        bans.ALL.push(operator);
        bans.MANUAL.push(operator);
      }

      return bans;
    },
    { ALL: [], PLAYLIST: [], MANUAL: [] }
  ));

  /**
   * The operators available to pick in the current match.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const pickableOperators = computed(() => Operator.LIST.filter((o) => !operatorBans.value.ALL.includes(o)));

  /**
   * The operators available to ban in the current match.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannableOperators = computed(() => Operator.LIST.filter((o) => {
    // Filter unbannable operators
    if (!o.bannable) return false;

    // Filter pre-banned operators
    if (playlist.value?.bannedOperators.includes(o)) return false;

    return true;
  }));

  /**
   * Removes an operator ban from `operatorBans`.
   * 
   * @param {Operator|string} operator The operator or operator key to remove.
   */
  function removeOperatorBan(operator) {
    const index = settings.value.operatorBans.indexOf(typeof operator === 'string' ? operator : operator.key);
    settings.value.operatorBans.splice(index, 1);
  }
  // #endregion

  // #region Player Settings
  /**
   * The list of players currently added in the match settings.
   * @type {import('vue').ComputedRef<String[]>}
   */
  const playerList = computed(() => settings.value.playerList.sort());

  /**
   * The list of players that were added but are not in the current `playerList`.
   * @type {import('vue').ComputedRef<String[]>}
   */
  const recentPlayerList = computed(() => settings.value.recentPlayerList
    .filter((p) => !settings.value.playerList.includes(p))
    .sort()
  );

  /**
   * If `storeRecentPlayers` is enabled, adds a player to the `recentPlayerList`.
   * 
   * @param {string}  player             The player to add to the list.
   * @param {boolean} storeRecentPlayers Whether `storeRecentPlayers` is enabled in the App settings.
   */
  function addRecentPlayer(player, storeRecentPlayers) {
    if (!storeRecentPlayers || !player) return;
    if (!settings.value.recentPlayerList.includes(player)) settings.value.recentPlayerList.push(player);
  }

  /**
   * Removes a player from the `playerList`.
   * 
   * @param {string} player The player to remove from the list.
   */
  function removePlayer(player) {
    const index = settings.value.playerList.indexOf(player);
    settings.value.playerList.splice(index, 1);
  }

  /**
   * Removes a player from the `recentPlayerList`.
   * 
   * @param {string} player The player to remove from the list.
   */
  function removeRecentPlayer(player) {
    const index = settings.value.recentPlayerList.indexOf(player);
    settings.value.recentPlayerList.splice(index, 1);
  }
  // #endregion

  // #region Store Management
  /**
   * Stores the current settings in the browser store.
   * 
   * @param {boolean} storeRecentPlayers Whether to store recent player names in browser storage.
   */
  function storeSettings(storeRecentPlayers) {
    // Store match settings in session storage
    const matchSettings = JSON.stringify({
      playlist: settings.value.playlist,
      operatorBans: settings.value.operatorBans,
      playerList: settings.value.playerList
    });
    sessionStorage.setItem('match-settings', matchSettings);

    // Store recent players in local storage
    if (storeRecentPlayers) localStorage.setItem('recent-players', JSON.stringify(recentPlayerList.value));
  }

  /** Resets the store to its empty state. */
  function reset() {
    Object.assign(
      settings.value,
      {
        playlist: null,
        map: null,
        operatorBans: [],
        playerList: [],
        recentPlayerList: []
      }
    );
  }
  // #endregion

  return {
    // Raw Settings
    settings,

    // Match Settings
    playlist,
    map,
    pickableMaps,

    // Operators
    operatorBans,
    operatorBansEnabled,
    pickableOperators,
    bannableOperators,
    removeOperatorBan,

    // Players
    playerList,
    recentPlayerList,
    addRecentPlayer,
    removePlayer,
    removeRecentPlayer,

    // Store Management
    storeSettings,
    reset
  };
});
