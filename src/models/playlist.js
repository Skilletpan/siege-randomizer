import RAW_PLAYLISTS from '@/data/playlists';

import SiegeMap from './map';
import Operator from './operator';

/**
 * @typedef Category The category keys of the playlist.
 * 
 * @type {"COMPETITIVE"|"TACTICAL"|"QUICKPLAY"|"ARCADE"|"DEATHMATCH"|"TRAINING"}
 */

export default class Playlist {
  // Instance Properties
  #key;
  #category;
  #name;
  #mapKeys;
  #operatorKeys;
  #operators;

  /**
   * @param {string}   key                      The key of the playlist.
   * @param {Category} category                 The category of the playlist.
   * @param {Object}   playlistData             The raw playlist data.
   * @param {string}   playlistData.name        The name of the playlist.
   * @param {string[]} playlistData.maps        The keys of the maps in the playlist.
   * @param {string[]} [playlistData.operators] The keys of the operators available in / banned from the playlist.
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

  /** @returns {Category} The category of the playlist. */
  get category() { return this.#category; }

  /** @returns {boolean} Whether this playlist belongs to the `COMPETITIVE` category. */
  get isCompetitive() { return this.#category === 'COMPETITIVE'; }

  /** @returns {boolean} Whether this playlist belongs to the `TACTICAL` category. */
  get isTactical() { return this.#category === 'TACTICAL'; }

  /** @returns {boolean} Whether this playlist belongs to the `QUICKPLAY` category. */
  get isQuickplay() { return this.#category === 'QUICKPLAY' || this.#category === 'ARCADE'; }

  /** @returns {boolean} Whether this playlist belongs to the `ARCADE` category. */
  get isArcade() { return this.#category === 'ARCADE'; }

  /** @returns {boolean} Whether this playlist belongs to the `DEATHMATCH` category. */
  get isDeathmatch() { return this.#category === 'DEATHMATCH'; }

  /** @returns {boolean} Whether this playlist belongs to the `TRAINING` category. */
  get isTraining() { return this.#category === 'TRAINING'; }

  /** @returns {SiegeMap[]} The maps in the playlist. */
  get maps() { return this.#mapKeys.map((key) => SiegeMap[key]); }

  /** @returns {Operator[]} The operators allowed in this playlist. */
  get allowedOperators() {
    // Fetch operators on first call
    if (!this.#operators) this.#operators = Operator.findOperatorsByList(this.#operatorKeys);
    return this.#operators.allowed;
  }

  /** @returns {Operator[]} The operators banned from this playlist. */
  get bannedOperators() {
    // Fetch operators on first call
    if (!this.#operators) this.#operators = Operator.findOperatorsByList(this.#operatorKeys);
    return this.#operators.banned;
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
