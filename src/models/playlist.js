export default class Playlist {
  // Instance Properties
  #key;
  #name;
  #category;
  #maps;

  /**
   * @param {Object}                            rawPlaylist             The raw playlist object.
   * @param {string}                            rawPlaylist.key         The key of the playlist.
   * @param {string}                            rawPlaylist.name        The name of the playlist.
   * @param {"TACTICAL"|"QUICKPLAY"|"TRAINING"} rawPlaylist.category    The category of the playlist.
   * @param {string[]}                          rawPlaylist.maps        The maps in the playlist.
   * @param {string[]}                          [rawPlaylist.operators] The operator settings of the playlist.
   */
  constructor(rawPlaylist) {
    this.#key = rawPlaylist.key;
    this.#name = rawPlaylist.name;
    this.#category = rawPlaylist.category;
    this.#maps = Array.from(rawPlaylist.maps);
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

  /** @returns {string[]} The maps in the playlist. */
  get maps() { return this.#maps; }
};
