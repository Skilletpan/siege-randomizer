import RAW_SQUADS from '@/data/squads';
import loadImage from '@/utils/loadImage';

export default class Squad {
  // Instance properties
  #key;
  #name;
  #emblem;

  /**
   * @param {string} key  The key of the squad.
   * @param {string} name The name of the squad.
   */
  constructor(key, name) {
    this.#key = key;
    this.#name = name;
    this.#emblem = loadImage('squads', `${key}.png`);
  }

  /** @returns {string} The key of the squad. */
  get key() { return this.#key; }

  /** @returns {string} The name of the squad. */
  get name() { return this.#name; }

  /** @returns {string} The URL of the emblem of the squad. */
  get emblem() { return this.#emblem; }

  /** @returns {Squad[]} A list of all squads. */
  static get LIST() { return Object.values(Squad); }

  // Register Squads
  static {
    Object.entries(RAW_SQUADS).forEach(([key, name]) => {
      this[key] = new Squad(key, name);
    });
  }
}

console.debug(Squad.LIST);
