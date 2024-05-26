import RAW_MAPS from '@/data/maps';
import loadImage from '@/utils/loadImage';

import Playlist from './playlist';

export default class SiegeMap {
  // Instance properties
  #key;
  #name;
  #thumbnail;

  /**
   * @param {string} key  The key of the map.
   * @param {string} name The name of the map.
   */
  constructor(key, name) {
    this.#key = key;
    this.#name = name;
    this.#thumbnail = loadImage('maps', `${key}.png`) || loadImage('maps', `${key}.jpg`);
  }

  /** @returns {string} The key of the map. */
  get key() { return this.#key; }

  /** @returns {string} The name of the map. */
  get name() { return this.#name; }

  /** @returns {string} The URL of the thumbnail of the map. */
  get thumbnail() { return this.#thumbnail; }

  /** @returns {Playlist[]} A list of all playlists containing this map. */
  get playlists() { return Playlist.LIST.filter((playlist) => playlist.maps.includes(this)); }

  /** @returns {SiegeMap[]} A list of all maps. */
  static get LIST() { return Object.values(SiegeMap); }

  /** @returns {SiegeMap} A randomly picked map. */
  static random() { return SiegeMap.LIST[Math.floor(Math.random() * SiegeMap.LIST.length)]; }

  // Register Maps
  static {
    Object.entries(RAW_MAPS).forEach(([key, name]) => {
      this[key] = new SiegeMap(key, name);
    });
  }
}

console.debug(SiegeMap.LIST);
