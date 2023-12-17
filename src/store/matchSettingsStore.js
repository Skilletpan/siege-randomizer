import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { Operator, Playlist, Side } from '@/models';

// Load data from sessionStorage
const storedData = JSON.parse(sessionStorage.getItem('match-settings'));

export default defineStore('match-settings', () => {
  /**
   * The key of the playlist selected in the match settings.
   * @type {import('vue').Ref<String>}
   */
  const playlistKey = ref(storedData?.playlist || null);

  /**
   * The playlist selected in the match settings.
   * @type {import('vue').ComputedRef<Playlist>}
   */
  const playlist = computed(() => playlistKey.value ? Playlist.valueOf(playlistKey.value) : null);

  /**
   * The keys of the manually banned operators.
   * @type {import('vue').Ref<String[]>}
   */
  const manualBanKeys = ref(storedData?.bans || []);

  /**
   * The manually banned operators.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const manualBans = computed(() => Operator.LIST.filter((o) => manualBanKeys.value.includes(o.key)));

  /**
   * All banned operators.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedOperators = computed(() => {
    const bans = [];
    if (playlist.value) bans.push(...playlist.value.bannedOperators);
    if (!playlist.value || playlist.value.canBanOperators) bans.push(...manualBans.value);

    return Operator.LIST.filter((o) => bans.includes(o));
  });

  /**
   * The attacker operators banned in the match settings.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedAttackers = computed(() => bannedOperators.value.filter((o) => o.side === Side.ATT && o.bannable));

  /**
   * The defender operators banned in the match settings.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedDefenders = computed(() => bannedOperators.value.filter((o) => o.side === Side.DEF && o.bannable));

  /**
   * Removes an operator from the manual ban list.
   * 
   * @param {string|number} operator The operator key or index to remove.
   */
  function removeOperatorBan(operator) {
    const index = typeof operator === 'string' ? manualBanKeys.value.indexOf(operator) : operator;
    manualBanKeys.value.splice(index, 1);
  }

  /** Resets the store to its empty state. */
  function reset() {
    playlistKey.value = null;
    manualBanKeys.value.length = 0;
  }

  return {
    // Playlist
    playlistKey,
    playlist,

    // Banned Operators
    manualBanKeys,
    manualBans,
    bannedOperators,
    bannedAttackers,
    bannedDefenders,

    removeOperatorBan,

    reset
  };
});
