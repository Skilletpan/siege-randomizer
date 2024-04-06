import { defineStore } from 'pinia';
import { computed, ref, shallowRef, watchEffect } from 'vue';

import { Operator, Playlist, SiegeMap } from '@/models';

// Load data from browser storage
const session = JSON.parse(sessionStorage.getItem('match-settings-2')) || {};

export default defineStore('match-settings-2', () => {
  /**
   * Whether to show the match settings.
   * @type {import('vue').ShallowRef<Boolean>}
   */
  const show = shallowRef(false);

  /**
   * The raw and editable match setting values.
   * @type {import('vue').Ref<{ playlistKey: String, mapKey: String, bannedOperatorKeys: String[] }>}
   */
  const matchSettings = ref({
    enabled: true,
    playlistKey: session.playlist || null,
    mapKey: session.map || null,
    features: {
      bans: true,
      duplicates: false,
      mixed: false,
      recruits: true
    },
    bannedOperatorKeys: session.bans || []
  });

  /**
   * The playlist selected in the match settings.
   * @type {import('vue').ComputedRef<Playlist>}
   */
  const playlist = computed(() => Playlist.valueOf(matchSettings.value.playlistKey));

  /**
   * The map selected in the match settings.
   * @type {import('vue').ComputedRef<SiegeMap>}
   */
  const map = computed(() => SiegeMap.valueOf(matchSettings.value.mapKey));

  const features = computed(() => {
    if (playlist.value) return playlist.value.features;

    const { features: _features } = matchSettings.value;

    return {
      duplicateOperators: _features.duplicates,
      mixedTeams: _features.mixed,
      operatorBans: _features.bans,
      recruits: _features.recruits
    };
  });

  /**
   * The operators banned in the match settings.
   * @type {import('vue').ComputedRef<Operator[]>}
   */
  const bannedOperators = computed(() => {
    if (playlist.value && !playlist.value.features.operatorBans) return [];
    return matchSettings.value.bannedOperatorKeys.map((operatorKey) => Operator.valueOf(operatorKey));
  });

  // Store updates in browser storage
  watchEffect(() => {
    const { playlistKey, mapKey, bannedOperatorKeys } = matchSettings.value;

    // Store session storage values
    sessionStorage.setItem(
      'match-settings-2',
      JSON.stringify({
        playlist: playlistKey,
        map: mapKey,
        bans: bannedOperatorKeys
      })
    );
  });

  return {
    // Values
    show,

    matchSettings,

    playlist,
    map,
    features,
    bannedOperators
  };
});
