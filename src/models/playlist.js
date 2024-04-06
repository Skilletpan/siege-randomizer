import RAW_PLAYLISTS from '@/data/playlists_v2';
import SiegeMap from './map';

// Playlist pre-mapping
const PLAYLISTS = {};
Object.entries(RAW_PLAYLISTS).forEach(([category, playlists]) => {
  Object.entries(playlists).forEach(([playlistKey, playlist]) => {
    PLAYLISTS[playlistKey] = { key: playlistKey, category, ...playlist };
  });
});

export default class Playlist {
  // Instance Properties
  #key;
  #category;
  #name;
  #mapKeys;

  /**
   * @param {Object}                            rawPlaylist.key      The raw playlist object.
   * @param {string}                            rawPlaylist.name     The name of the playlist.
   * @param {string[]}                          rawPlaylist.maps     The keys of the maps in the playlist.
   * @param {"TACTICAL"|"QUICKPLAY"|"TRAINING"} rawPlaylist.category The category of the playlist.
   */
  constructor(rawPlaylist) {
    this.#key = rawPlaylist.key;
    this.#name = rawPlaylist.name;
    this.#mapKeys = Array.from(rawPlaylist.maps);
    this.#category = rawPlaylist.category;
  }

  /** @returns {string} The key of the playlist. */
  get key() { return this.#key; }

  /** @returns {string} The name of the playlist. */
  get name() { return this.#name; }

  /** @returns {boolean} Whether this playlist belongs to the `TACTICAL` category. */
  get isTactical() { return this.#category === 'TACTICAL'; }

  /** @returns {boolean} Whether this playlist belongs to the `QUICKPLAY` category. */
  get isQuickplay() { return this.#category === 'QUICKPLAY'; }

  /** @returns {boolean} Whether this playlist belongs to the `TRAINING` category. */
  get isTraining() { return this.#category === 'TRAINING'; }

  /** @returns {SiegeMap[]} The maps in the playlist. */
  get maps() { return this.#mapKeys.map((key) => SiegeMap[key]); }

  /** @returns {Playlist[]} A list of all playlists. */
  static get LIST() { return Object.values(Playlist); }

  // Register Playlists
  static COMPETITIVE = new Playlist(PLAYLISTS.COMPETITIVE);
  static RANKED = new Playlist(PLAYLISTS.RANKED);
  static STANDARD = new Playlist(PLAYLISTS.STANDARD);
  static QUICKMATCH = new Playlist(PLAYLISTS.QUICKMATCH);
  static ROULETTE = new Playlist(PLAYLISTS.ROULETTE);
  static F4A = new Playlist(PLAYLISTS.F4A);
  static DEATHMATCH = new Playlist(PLAYLISTS.DEATHMATCH);
  static SNIPERS = new Playlist(PLAYLISTS.SNIPERS);
  static GOLDENGUN = new Playlist(PLAYLISTS.GOLDENGUN);
  static HEADSHOTS = new Playlist(PLAYLISTS.HEADSHOTS);
  static AI_EASY = new Playlist(PLAYLISTS.AI_EASY);
  static AI_HARD = new Playlist(PLAYLISTS.AI_HARD);
  static LANDMARK = new Playlist(PLAYLISTS.LANDMARK);
  static TARGET = new Playlist(PLAYLISTS.TARGET);
};

console.debug(Playlist.LIST);
