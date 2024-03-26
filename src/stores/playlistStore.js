import { defineStore } from 'pinia';
import { shallowRef } from 'vue';

import RAW_PLAYLISTS from '@/data/playlists_v2';
import { Playlist } from '@/models';

// Map raw playlists
const _playlists = [];
Object.entries(RAW_PLAYLISTS).forEach(([category, playlists]) => {
  playlists.forEach((playlist) => {
    _playlists.push(new Playlist({ ...playlist, category }));
  });
});

export default defineStore('playlists-store', () => {
  /** @type {import('vue').ShallowRef<Playlist[]>} */
  const PLAYLISTS = shallowRef(_playlists);
  console.debug(PLAYLISTS.value);

  /**
   * Gets a single playlist by key.
   * 
   * @param {string} key The key of the playlist.
   * 
   * @returns {Playlist} The corresponding playlist instance.
   */
  function get(key) { return PLAYLISTS.value.find((playlist) => playlist.key === key); }

  /**
   * Gets a list of playlists by keys.
   * 
   * @param {string[]} keys The keys of the playlists.
   * 
   * @returns {Playlist[]} The corresponding playlist instances.
   */
  function map(keys) { return keys.map((key) => get(key)); }

  return {
    // State
    PLAYLISTS,

    // Methods
    get,
    map
  };
});
