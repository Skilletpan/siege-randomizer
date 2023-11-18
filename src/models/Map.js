import MAPS from '@/data/maps.json';

import Playlist from './Playlist';

export default class Map {
  #id;
  #name;

  static {
    // Build map instances from raw data
    Object.entries(MAPS).forEach(([id, map]) => {
      // Ignore disabled maps
      if (map.disabled) return;

      // Create map instance
      this[id] = new Map({
        id,
        name: map.name
      });
    });

    // Freeze map object
    Object.freeze(Map);

    console.debug(
      'Maps imported:',
      Map.LIST
    );
  }

  /**
   * Creates a new Map instance.
   * 
   * @param {Object} map      The raw map data.
   * @param {String} map.id   The ID of the map.
   * @param {String} map.name The name of the map.
   */
  constructor(map) {
    this.#id = map.id;
    this.#name = map.name;
  }

  /** @returns {String} The ID of the map. */
  get id() { return this.#id; }

  /** @returns {String} The name of the map. */
  get name() { return this.#name; }

  /** @returns {Playlist[]} The playlists the map is included in. */
  get playlists() { return Playlist.LIST.filter((playlist) => playlist.maps.includes(this)); }

  /** @returns {String} The thumbnail image of the map. */
  get thumbnail() { return require(`@/assets/maps/${this.#id}.jpg`); }

  /** @returns {Map[]} A list of all maps. */
  static get LIST() { return Object.values(this); }

  /**
   * Picks a random map from a given pool or all maps.
   * 
   * @param {Map[]} [mapPool] The maps to pick from.
   * 
   * @returns {Map} A randomly picked map from the given pool.
   */
  static pickRandomMap(mapPool) {
    const pool = mapPool || Map.LIST;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}
