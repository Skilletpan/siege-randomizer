import loadImage from "@/utils/loadImage";

export default class Squad {
  // Instance properties
  #key;
  #name;
  #thumbnail;

  /**
   * @param {string} key  The key of the squad.
   * @param {string} name The name of the squad.
   */
  constructor(key, name) {
    this.#key = key;
    this.#name = name;
    this.#thumbnail = loadImage('squads', `${key}.png`);
  }

  /** @returns {string} The key of the squad. */
  get key() { return this.#key; }

  /** @returns {string} The name of the squad. */
  get name() { return this.#name; }

  /** @returns {string} The URL of the thumbnail of the squad. */
  get thumbnail() { return this.#thumbnail; }

  /** @returns {Squad[]} A list of all squads. */
  static get LIST() { return Object.values(Squad); }

  // Register Squads
  static GHOSTEYES = new Squad('GHOSTEYES', 'Ghosteyes');
  static NIGHTHAVEN = new Squad('NIGHTHAVEN', 'Nighthaven');
  static REDHAMMER = new Squad('REDHAMMER', 'Redhammer');
  static VIPERSTRIKE = new Squad('VIPERSTRIKE', 'Viperstrike');
  static WOLFGUARD = new Squad('WOLFGUARD', 'Wolfguard');
};

console.debug(Squad.LIST);
