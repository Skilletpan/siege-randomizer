import { MappedModel } from './Model';
import Playlist from './Playlist';

// export default class Map {
//   static {
//     const rawMaps = require('@/data/maps.json');

//     // Build map instances from raw data
//     Object.entries(rawMaps).forEach(([id, map]) => {
//       // Ignore disabled maps
//       if (map.disabled) return;

//       // Create map instance
//       this[id] = new Map({
//         id,
//         name: map.name
//       });
//     });

//     // Freeze map object
//     Object.freeze(this);

//     console.debug(
//       'Maps imported:',
//       this.LIST
//     );
//   }

//   // Instance properties
//   #id;
//   #name;

//   #thumbnail;

//   /**
//    * Creates a new Map instance.
//    * 
//    * @param {Object} map      The raw map data.
//    * @param {string} map.id   The ID of the map.
//    * @param {string} map.name The name of the map.
//    */
//   constructor(map) {
//     this.#id = map.id;
//     this.#name = map.name;

//     this.#thumbnail = require(`@/assets/maps/${map.id}.jpg`);
//   }

//   /** @returns {string} The ID of the map. */
//   get id() { return this.#id; }

//   /** @returns {string} The name of the map. */
//   get name() { return this.#name; }

//   /** @returns {Array<Playlist>} The playlists the map is included in. */
//   get playlists() { return Playlist.LIST.filter((playlist) => playlist.maps.includes(this)); }

//   /** @returns {string} The thumbnail image of the map. */
//   get thumbnail() { return this.#thumbnail; }

//   /** @returns {Array<Map>} A list of all maps. */
//   static get LIST() { return Object.values(this); }

//   /**
//    * Picks a random map from a given pool or all maps.
//    * 
//    * @param {Array<Map>} [mapPool] The maps to pick from.
//    * 
//    * @returns {Map} A randomly picked map from the given pool.
//    */
//   static pickRandomMap(mapPool = null) {
//     const pool = mapPool || Map.LIST;
//     return pool[Math.floor(Math.random() * pool.length)];
//   }
// }

export default class Map extends MappedModel {
  static {
    this._className = 'maps';
    const rawMaps = require('@/data/maps.json');

    // Build map instances from raw data
    Object.entries(rawMaps).forEach(([key, map], index) => {
      // Ignore disabled maps
      if (map.disabled) return;

      // Create map instance
      new Map({ id: index, key, name: map.name }, this._className);

      // Add getter
      MappedModel._addGetter(this, key);
    });

    console.debug('Maps imported:', Map.LIST);
  }

  // Instance properties
  #thumbnail;

  /** @returns {Playlist[]} The playlists that include this map. */
  get playlists() { return Playlist.LIST.filter((playlist) => playlist.maps.includes(this)); }

  /** @returns {string} The thumbnail image of the map. */
  get thumbnail() {
    if (!this.#thumbnail) this.#thumbnail = require(`@/assets/maps/${this.key}.jpg`);
    return this.#thumbnail;
  }
}
