import loadImage from "@/utils/loadImage";
import Playlist from "./playlist";

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
    this.#thumbnail = loadImage('maps', `${key}.jpg`);
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

  // Register Maps
  static HOUSE = new SiegeMap('HOUSE', 'House');
  static OREGON = new SiegeMap('OREGON', 'Oregon');
  static HEREFORD = new SiegeMap('HEREFORD', 'Hereford Base');
  static CLUBHOUSE = new SiegeMap('CLUBHOUSE', 'Club House');
  static PLANE = new SiegeMap('PLANE', 'Presidential Plane');
  static CONSULATE = new SiegeMap('CONSULATE', 'Consulate');
  static BANK = new SiegeMap('BANK', 'Bank');
  static KANAL = new SiegeMap('KANAL', 'Kanal');
  static CHALET = new SiegeMap('CHALET', 'Chalet');
  static KAFE = new SiegeMap('KAFE', 'Kafe Dostoyevsky');
  // static BARTLETT = new SiegeMap('BARTLETT', 'Bartlett University');
  static YACHT = new SiegeMap('YACHT', 'Yacht');
  static BORDER = new SiegeMap('BORDER', 'Border');
  static FAVELA = new SiegeMap('FAVELA', 'Favela');
  static SKYSCRAPER = new SiegeMap('SKYSCRAPER', 'Skyscraper');
  static COASTLINE = new SiegeMap('COASTLINE', 'Coastline');
  static THEMEPARK = new SiegeMap('THEMEPARK', 'Theme Park');
  static TOWER = new SiegeMap('TOWER', 'Tower');
  static VILLA = new SiegeMap('VILLA', 'Villa');
  static FORTRESS = new SiegeMap('FORTRESS', 'Fortress');
  static OUTBACK = new SiegeMap('OUTBACK', 'Outback');
  static EMERALD = new SiegeMap('EMERALD', 'Emerald Plains');
  static CLOSEQUARTER = new SiegeMap('CLOSEQUARTER', 'Close Quarter');
  static STADIUM = new SiegeMap('STADIUM', 'Stadium Bravo');
  static LABS = new SiegeMap('LABS', 'Nighthaven Labs');
  static LAIR = new SiegeMap('LAIR', 'Lair');
};

console.debug(SiegeMap.LIST);
