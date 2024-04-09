import RAW_PLAYLISTS from '@/data/playlists';

import SiegeMap from './map';
import Operator from './operator';

export default class Playlist {
  // Instance Properties
  #key;
  #category;
  #name;
  #mapKeys;
  #operatorKeys;
  #operators;

  /**
   * @param {string}                            key                      The key of the playlist.
   * @param {"TACTICAL"|"QUICKPLAY"|"TRAINING"} category                 The category of the playlist.
   * @param {Object}                            playlistData             The raw playlist data.
   * @param {string}                            playlistData.name        The name of the playlist.
   * @param {string[]}                          playlistData.maps        The keys of the maps in the playlist.
   * @param {string[]}                          [playlistData.operators] The keys of the operators available in / banned from the playlist.
   */
  constructor(key, category, playlistData) {
    this.#key = key;
    this.#category = category;
    this.#name = playlistData.name;
    this.#mapKeys = Array.from(playlistData.maps);
    this.#operatorKeys = Array.from(playlistData.operators || []);
  }

  /** @returns {string} The key of the playlist. */
  get key() { return this.#key; }

  /** @returns {string} The name of the playlist. */
  get name() { return this.#name; }

  /** @returns {"TACTICAL"|"QUICKPLAY"|"TRAINING"} The category of the playlist. */
  get category() { return this.#category; }

  /** @returns {boolean} Whether this playlist belongs to the `TACTICAL` category. */
  get isTactical() { return this.#category === 'TACTICAL'; }

  /** @returns {boolean} Whether this playlist belongs to the `QUICKPLAY` category. */
  get isQuickplay() { return this.#category === 'QUICKPLAY'; }

  /** @returns {boolean} Whether this playlist belongs to the `TRAINING` category. */
  get isTraining() { return this.#category === 'TRAINING'; }

  /** @returns {SiegeMap[]} The maps in the playlist. */
  get maps() { return this.#mapKeys.map((key) => SiegeMap[key]); }

  /** @returns {{ allowed: Operator[], banned: Operator[] }} The operator restrictions for the playlist. */
  get operators() {
    if (!this.#operators) this.#operators = Operator.findOperatorsByList(this.#operatorKeys);
    return this.#operators;
  }

  /** @returns {Playlist[]} A list of all playlists. */
  static get LIST() { return Object.values(Playlist); }

  // Register Playlists
  static {
    Object.entries(RAW_PLAYLISTS).forEach(([category, playlists]) => {
      Object.entries(playlists).forEach(([key, playlistData]) => {
        this[key] = new Playlist(key, category, playlistData);
      });
    });
  }
}

console.debug(Playlist.LIST);
