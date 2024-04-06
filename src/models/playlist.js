import RAW_PLAYLISTS from '@/data/playlists_v2';
import SiegeMap from './map';

// Define playlist categories
const CATEGORY = {
  TACTICAL: 0,
  QUICKPLAY: 1,
  TRAINING: 2
};

export default class Playlist {
  // Instance Properties
  #key;
  #category;
  #name;
  #mapKeys;

  /**
   * @param {string}   key                     The key of the playlist.
   * @param {number}   category                The ID of the category of the playlist.
   * @param {Object}   rawPlaylist             The raw playlist object.
   * @param {string}   rawPlaylist.name        The name of the playlist.
   * @param {string[]} rawPlaylist.maps        The keys of the maps in the playlist.
   */
  constructor(key, category, rawPlaylist) {
    this.#key = key;
    this.#category = category;
    this.#name = rawPlaylist.name;
    this.#mapKeys = Array.from(rawPlaylist.maps);
  }

  /** @returns {string} The key of the playlist. */
  get key() { return this.#key; }

  /** @returns {string} The name of the playlist. */
  get name() { return this.#name; }

  /** @returns {boolean} Whether this playlist belongs to the `TACTICAL` category. */
  get isTactical() { return this.#category === CATEGORY.TACTICAL; }

  /** @returns {boolean} Whether this playlist belongs to the `QUICKPLAY` category. */
  get isQuickplay() { return this.#category === CATEGORY.QUICKPLAY; }

  /** @returns {boolean} Whether this playlist belongs to the `TRAINING` category. */
  get isTraining() { return this.#category === CATEGORY.TRAINING; }

  /** @returns {SiegeMap[]} The maps in the playlist. */
  get maps() { return this.#mapKeys.map((key) => SiegeMap[key]); }

  /** @returns {Playlist[]} A list of all playlists. */
  static get LIST() { return Object.values(Playlist); }

  // Register Playlists
  static COMPETITIVE = new Playlist('COMPETITIVE', CATEGORY.TACTICAL, RAW_PLAYLISTS.COMPETITIVE);
  static RANKED = new Playlist('RANKED', CATEGORY.TACTICAL, RAW_PLAYLISTS.RANKED);
  static STANDARD = new Playlist('STANDARD', CATEGORY.TACTICAL, RAW_PLAYLISTS.STANDARD);
  static QUICKMATCH = new Playlist('QUICKMATCH', CATEGORY.QUICKPLAY, RAW_PLAYLISTS.QUICKMATCH);
  static ROULETTE = new Playlist('ROULETTE', CATEGORY.QUICKPLAY, RAW_PLAYLISTS.ROULETTE);
  static F4A = new Playlist('F4A', CATEGORY.QUICKPLAY, RAW_PLAYLISTS.F4A);
  static DEATHMATCH = new Playlist('DEATHMATCH', CATEGORY.QUICKPLAY, RAW_PLAYLISTS.DEATHMATCH);
  static SNIPERS = new Playlist('SNIPERS', CATEGORY.QUICKPLAY, RAW_PLAYLISTS.SNIPERS);
  static GOLDENGUN = new Playlist('GOLDENGUN', CATEGORY.QUICKPLAY, RAW_PLAYLISTS.GOLDENGUN);
  static HEADSHOTS = new Playlist('HEADSHOTS', CATEGORY.QUICKPLAY, RAW_PLAYLISTS.HEADSHOTS);
  static AI_EASY = new Playlist('AI_EASY', CATEGORY.TRAINING, RAW_PLAYLISTS.AI_EASY);
  static AI_HARD = new Playlist('AI_HARD', CATEGORY.TRAINING, RAW_PLAYLISTS.AI_HARD);
  static LANDMARK = new Playlist('LANDMARK', CATEGORY.TRAINING, RAW_PLAYLISTS.LANDMARK);
  static TARGET = new Playlist('TARGET', CATEGORY.TRAINING, RAW_PLAYLISTS.TARGET);
};

console.debug(Playlist.LIST);
