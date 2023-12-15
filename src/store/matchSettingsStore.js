import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { Map, Operator, Playlist, Side } from '@/models';

export default defineStore('match-settings', () => {
  /**
   * The key of the playlist selected in the match settings.
   * @type {import('vue').Ref<string>}
   */
  const playlistKey = ref(null);

  /**
   * The playlist selected in the match settings.
   * @type {import('vue').ComputedRef<Playlist>}
   */
  const playlist = computed(() => playlistKey.value ? Playlist.valueOf(playlistKey.value) : null);

  /**
   * The key of the map selected in the match settings.
   * @type {import('vue').Ref<string>}
   */
  const mapKey = ref(null);

  /**
   * The map selected in the match settings.
   * @type {import('vue').ComputedRef<Map>}
   */
  const map = computed(() => mapKey.value ? Map.valueOf(mapKey.value) : null);

  /**
   * The keys of the operators banned in the match settings.
   * @type {import('vue').Ref<string[]>}
   */
  const bannedOperatorKeys = ref([]);

  /**
   * The operators banned in the match settings.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedOperators = computed(() => Operator.LIST.filter((o) => {
    if (playlist.value?.bannedOperators.includes(o)) return true;
    if (bannedOperatorKeys.value.includes(o.key)) return true;
    return false;
  }));

  /**
   * The attacker operators banned in the match settings.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedAttackers = computed(() => bannedOperators.value.filter((o) => o.side === Side.ATT));

  /**
   * The defender operators banned in the match settings.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedDefenders = computed(() => bannedOperators.value.filter((o) => o.side === Side.DEF));

  /** Resets the store to its empty state. */
  function reset() {
    playlistKey.value = null;
    mapKey.value = null;
    bannedOperatorKeys.value.length = 0;
  }

  return {
    // Playlist
    playlistKey,
    playlist,

    // Map
    mapKey,
    map,

    // Banned Operators
    bannedOperatorKeys,
    bannedOperators,
    bannedAttackers,
    bannedDefenders,

    reset
  };
});
