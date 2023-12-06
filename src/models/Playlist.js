import Map from './Map';
import Operator from './Operator';

export default class Playlist {
  static {
    const rawPlaylists = require('@/data/playlists.json');

    // Build playlist instances from raw data
    Object.entries(rawPlaylists).forEach(([id, playlist]) => {
      // Ignore disabled playlist
      if (playlist.disabled) return;

      // Create playlist instance
      this[id] = new Playlist({
        id,
        name: playlist.name,
        maps: playlist.maps,
        isArcade: playlist.isArcade || false,
        bannedOperators: playlist.bannedOperators || [],
        canBanOperators: playlist.canBanOperators
      });
    });

    // Freeze playlist object
    Object.freeze(this);

    console.debug(
      'Playlists imported:',
      this.LIST
    );
  }

  // Instance properties
  #id;
  #name;
  #maps;
  #isArcade;
  #bannedOperators = [];
  #canBanOperators;

  /**
   * Creates new Playlist instance.
   * 
   * @param {Object}        playlist                 The raw playlist data.
   * @param {string}        playlist.id              The ID of the playlist.
   * @param {string}        playlist.name            The name of the playlist.
   * @param {Array<string>} playlist.maps            The maps included in the playlist.
   * @param {?boolean}      playlist.isArcade        Whether the playlist is an arcade playlist.
   * @param {Array<string>} playlist.bannedOperators The operators banned from this playlist.
   * @param {?boolean}      playlist.canBanOperators Whether operator bans are enabled in this playlist.
   */
  constructor(playlist) {
    this.#id = playlist.id;
    this.#name = playlist.name;
    this.#maps = [...playlist.maps];
    this.#isArcade = playlist.isArcade;
    this.#bannedOperators = [...playlist.bannedOperators];
    this.#canBanOperators = playlist.canBanOperators;
  }

  /** @returns {string} The ID of the playlist. */
  get id() { return this.#id; }

  /** @returns {string} The name of the playlist. */
  get name() { return this.#name; }

  /** @returns {Array<Map>} The maps included in the playlist. */
  get maps() { return this.#maps.map((map) => Map[map]); }

  /** @returns {boolean} Whether the playlist is an arcade playlist. */
  get isArcade() { return this.#isArcade; }

  /** @returns {Array<Operator>} The operators banned from this playlist. */
  get bannedOperators() { return this.#bannedOperators.map((operator) => Operator[operator]); }

  /** @returns {boolean} Whether operator bans are enabled in this playlist. */
  get canBanOperators() { return this.#canBanOperators; }

  /** @returns {Array<Playlist>} A list of all playlists. */
  static get LIST() { return Object.values(this); }
}
