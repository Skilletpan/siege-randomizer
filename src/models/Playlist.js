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
  #allowedOperators;
  #bannedOperators;

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

  /** @returns {string} The name of the playlist. */
  get name() { return this.#name; }

  /** @returns {'Standard'|'Arcade'|'Practice'} The type of the playlist. */
  get playlistType() { return PLAYLIST_TYPES[this.#type]; }

  /** @returns {boolean} Whether the playlist is a `STANDARD` playlist. */
  get isStandard() { return this.#type === 'STANDARD'; }

  /** @returns {boolean} Whether the playlist is an `ARCADE` playlist. */
  get isArcade() { return this.#type === 'ARCADE'; }

  /** @returns {boolean} Whether the playlist is a `PRACTICE` playlist. */
  get isPractice() { return this.#type === 'PRACTICE'; }

  /** @returns {{ [feature: string]: boolean }} The features of this playlist. */
  get features() {
    return {
      duplicateOperators: this.#features.includes('DUPLICATE_OPERATORS'),
      mixedTeams: this.#features.includes('MIXED_TEAMS'),
      operatorBans: this.#features.includes('OPERATOR_BANS'),
      recruits: this.#features.includes('RECRUITS')
    };
  }

  /** @returns {SiegeMap[]} The maps included in the playlist. */
  get maps() { return this.#maps.map((map) => SiegeMap.valueOf(map)); }

  /** @returns {Operator[]} The operators allowed in the playlist. */
  get allowedOperators() {
    // Maps operators on first call
    if (!this.#allowedOperators) this.#mapOperators();
    return this.#allowedOperators;
  }

  /** @returns {Operator[]} The operators banned from this playlist. */
  get bannedOperators() {
    // Maps operators on first call
    if (!this.#bannedOperators) this.#mapOperators();
    return this.#bannedOperators;
  }

  /** Builds the allowed and banned operator lists. */
  #mapOperators() {
    const { allowed, banned } = this.#operators;
    const { recruits } = this.features;

    // Create empty lists
    const _allowed = [], _banned = [];

    Operator.LIST.forEach((operator) => {
      // Set explicitly allowed and implicitly disallowed operators
      if (allowed.length) {
        if (allowed.includes(operator.key)) _allowed.push(operator);
        else _banned.push(operator);
        return;
      }

      // Set explicitly disallowed operators
      if (banned.length && banned.includes(operator.key)) {
        _banned.push(operator);
        return;
      }

      // Set recruits
      if (operator.key.startsWith('RECRUIT')) {
        if (recruits) _allowed.push(operator);
        else _banned.push(operator);
      }

      // Set implicitly allowed operators
      _allowed.push(operator);
    });

    // Assign lists to instance properties
    this.#allowedOperators = _allowed;
    this.#bannedOperators = _banned;
  }
}
