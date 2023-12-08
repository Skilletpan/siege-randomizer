import Map from './Map';
import { MapModel } from './Model';
import Operator from './Operator';

export default class Playlist extends MapModel {
  static {
    const rawPlaylists = require('@/data/playlists.json');

    // Build playlist instances from raw data
    Object.entries(rawPlaylists).forEach(([key, playlist]) => {
      // Ignore disabled playlist
      if (playlist.disabled) return;

      // Create playlist instance
      new Playlist({ key, ...playlist });
    });

    console.debug('Playlists imported:', Playlist.LIST);
  }

  // Instance properties
  #name;
  #maps = [];
  #isArcade = false;
  #bannedOperators = [];
  #canBanOperators = false;

  /**
   * Creates new Playlist instance.
   * 
   * @param {Object}   rawPlaylist                 The raw playlist data.
   * @param {string}   rawPlaylist.key             The key of the playlist.
   * @param {string}   rawPlaylist.name            The name of the playlist.
   * @param {string[]} rawPlaylist.maps            The keys of the maps included in the playlist.
   * @param {?boolean} rawPlaylist.isArcade        Whether the playlist is an arcade playlist.
   * @param {string[]} rawPlaylist.bannedOperators The keys of the operators banned from this playlist.
   * @param {?boolean} rawPlaylist.canBanOperators Whether players can ban operators in this playlist.
   */
  constructor(rawPlaylist) {
    super(rawPlaylist.key, Playlist);

    // Set instance properties
    this.#name = rawPlaylist.name;
    this.#maps.push(...rawPlaylist.maps);
    this.#isArcade = Boolean(rawPlaylist.isArcade);
    this.#bannedOperators.push(...(rawPlaylist.bannedOperators || []));
    this.#canBanOperators = Boolean(rawPlaylist.canBanOperators);
  }

  /** @returns {string} The name of the playlist. */
  get name() { return this.#name; }

  /** @returns {Map[]} The maps included in the playlist. */
  get maps() { return this.#maps.map((map) => Map[map]); }

  /** @returns {boolean} Whether this playlist is an arcade playlist. */
  get isArcade() { return this.#isArcade; }

  /** @returns {Operator[]} The operators banned from this playlist. */
  get bannedOperators() { return this.#bannedOperators.map((operator) => Operator[operator]); }

  /** @returns {boolean} Whether players can ban operators in this playlist. */
  get canBanOperators() { return this.#canBanOperators; }
}
