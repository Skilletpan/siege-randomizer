export default class SiegeMap {
  // Instance properties
  #key;
  #name;
  #thumbnail;

  /**
   * @param {Object} rawMap      The raw map object.
   * @param {string} rawMap.key  The key of the map.
   * @param {string} rawMap.name The name of the map.
   */
  constructor(rawMap) {
    this.#key = rawMap.key;
    this.#name = rawMap.name;
    this.#thumbnail = new URL(`/src/assets/maps/${rawMap.key}.jpg`, import.meta.url).href;
  }

  /** @returns {string} The key of the map. */
  get key() { return this.#key; }

  /** @returns {string} The name of the map. */
  get name() { return this.#name; }

  /** @returns {string} The URL of the thumbnail of the map. */
  get thumbnail() { return this.#thumbnail; }
};
