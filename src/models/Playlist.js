import { MapModel } from "./Model";
import Operator from './Operator';
import SiegeMap from './SiegeMap';

const PLAYLIST_TYPES = {};

export default class Playlist extends MapModel {
  // Static properties
  static {
    const rawPlaylists = require('@/data/playlists.json');

    // Build playlist instances from raw data
    Object.entries(rawPlaylists).forEach(([playlistTypeKey, playlistType]) => {
      PLAYLIST_TYPES[playlistTypeKey] = playlistType.name;

      Object.entries(playlistType.playlists).forEach(([key, playlist]) => {
        // Ignore disabled playlist
        if (playlist.disabled) return;

        // Create playlist instance
        new Playlist({ key, type: playlistTypeKey, ...playlist });
      });
    });

    console.debug('Playlists imported:', Playlist.LIST);
  }

  /** @returns {Playlist[]} A list of all playlists. */
  static get LIST() { return super.LIST; }

  /**
   * Parses an input to a playlist instance.
   * 
   * @param {Playlist|string} playlist The input to parse.
   * 
   * @returns {Playlist} The playlist derived from the input.
   */
  static valueOf(playlist) { return super.valueOf(playlist); }

  // Instance properties
  #name;
  #type;
  #features;
  #maps;
  #operators = {
    allowed: null,
    banned: null
  }

  /**
   * Creates a new Playlist instance.
   * 
   * @param {Object}   rawPlaylist                     The raw playlist data.
   * @param {string}   rawPlaylist.key                 The key of the playlist.
   * @param {string}   rawPlaylist.name                The name of the playlist.
   * @param {string}   rawPlaylist.type                The type of the playlist.
   * @param {string[]} [rawPlaylist.features]          The features of the playlist.
   * @param {string[]} rawPlaylist.maps                The keys of the maps included in the playlist.
   * @param {Object}   [rawPlaylist.operators]         The operator settings for the playlist.
   * @param {string[]} [rawPlaylist.operators.allowed] The keys of the operators allowed in the playlist.
   * @param {string[]} [rawPlaylist.operators.banned]  The keys of the operators banned from the playlist.
   */
  constructor(rawPlaylist) {
    super(rawPlaylist.key, Playlist);

    // Set instance properties
    this.#name = rawPlaylist.name;
    this.#type = rawPlaylist.type;
    this.#features = Array.from(rawPlaylist.features || []);

    this.#maps = Array.from(rawPlaylist.maps);

    this.#operators.allowed = Array.from(rawPlaylist.operators?.allowed || []);
    this.#operators.banned = Array.from(rawPlaylist.operators?.banned || []);
  }

  /**
   * The name of the playlist.
   */
  get name() { return this.#name; }

  /**
   * The type of the playlist.
   * @returns {'Standard'|'Arcade'|'Practice'}
   */
  get playlistType() { return PLAYLIST_TYPES[this.#type]; }

  /**
   * Whether the playlist is a `STANDARD` playlist.
   */
  get isStandard() { return this.#type === 'STANDARD'; }

  /**
   * Whether the playlist is an `ARCADE` playlist.
   */
  get isArcade() { return this.#type === 'ARCADE'; }

  /**
   * Whether the playlist is a `PRACTICE` playlist.
   */
  get isPractice() { return this.#type === 'PRACTICE'; }

  /**
   * The features of this playlist.
   */
  get features() {
    return Object.freeze({
      duplicateOperators: this.#features.includes('DUPLICATE_OPERATORS'),
      mixedTeams: this.#features.includes('MIXED_TEAMS'),
      operatorBans: this.#features.includes('OPERATOR_BANS'),
      recruits: this.#features.includes('RECRUITS')
    });
  }

  /**
   * The maps included in the playlist.
   */
  get maps() { return SiegeMap.LIST.filter((map) => this.#maps.includes(map.key)); }

  /**
   * The operators allowed in the playlist.
   */
  get allowedOperators() {
    const { allowed, banned } = this.#operators;
    const { recruits: allowRecruits } = this.#features;

    return Operator.LIST.filter((operator) => {
      if (allowed.length) {
        // Include explicitly allowed operators
        if (allowed.includes(operator.key)) return true;
      } else {
        // Exclude recruits if the `RECRUIT` feature is disabled
        if (!allowRecruits && operator.key.startsWith('RECRUIT')) return false;

        // Exclude explicitly banned recruits
        return !banned.includes(operator.key);
      }
    });
  }

  /**
   * The operators banned from this playlist.
   */
  get bannedOperators() {
    const { allowed, banned } = this.#operators;
    const { recruits: allowRecruits } = this.#features;

    return Operator.LIST.filter((operator) => {
      // Include explicitly banned operators
      if (banned.includes(operator.key)) return true;

      if (allowed.length) {
        // Include operators missing from explicit allowed list
        if (!allowed.includes(operator.key)) return true;
      }

      // Include recruits if the `RECRUIT` feature is disabled
      return !allowRecruits && operator.key.startsWith('RECRUIT');
    });
  }
}
