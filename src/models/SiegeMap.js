import { MapModel } from './Model';
import Playlist from './Playlist';

export default class SiegeMap extends MapModel {
  // Static properties
  static {
    const rawMaps = require('@/data/maps.json');

    // Build map instances from raw data
    Object.entries(rawMaps).forEach(([key, map]) => {
      // Ignore disabled maps
      if (map.disabled) return;

      // Create map instance
      new SiegeMap({ key, ...map });
    });

    console.debug('Maps imported:', SiegeMap.LIST);
  }

  /** @returns {SiegeMap[]} A list of all maps. */
  static get LIST() { return super.LIST; }

  /**
   * Parses an input to a Map instance.
   * 
   * @param {SiegeMap | string} map The input to parse.
   * 
   * @returns {SiegeMap} The map derived from the input.
   */
  static valueOf(map) { return super.valueOf(map); }

  // Instance properties
  #name;
  #thumbnail;

  /**
   * Creates a new Map instance.
   * 
   * @param {Object} rawMap      The raw map data.
   * @param {string} rawMap.key  The key of the map.
   * @param {string} rawMap.name The name of the map.
   */
  constructor(rawMap) {
    super(rawMap.key, SiegeMap);

    // Set instance properties
    this.#name = rawMap.name;
  }

  /** @returns {string} The name of the map. */
  get name() { return this.#name; }

  /** @returns {Playlist[]} The playlists that include this map. */
  get playlists() { return Playlist.LIST.filter((playlist) => playlist.maps.includes(this)); }

  /** @returns {string} The thumbnail image of the map. */
  get thumbnail() {
    // Loads the thumbnail on first call
    if (!this.#thumbnail) this.#thumbnail = require(`@/assets/maps/${this.key}.jpg`);

    return this.#thumbnail;
  }
}
