import { MapModel } from './Model';
import Playlist from './Playlist';

export default class Map extends MapModel {
  static {
    const rawMaps = require('@/data/maps.json');

    // Build map instances from raw data
    Object.entries(rawMaps).forEach(([key, map]) => {
      // Ignore disabled maps
      if (map.disabled) return;

      // Create map instance
      new Map({ key, ...map });
    });

    console.debug('Maps imported:', Map.LIST);
  }

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
    super(rawMap.key, Map);

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
