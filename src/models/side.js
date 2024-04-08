export default class Side {
  // Instance properties
  #key;
  #name;
  #icon;

  /**
   * @param {string} key  The key of the side.
   * @param {string} name The name of the side.
   */
  constructor(key, name) {
    this.#key = key;
    this.#name = name;
    this.#icon = `$siege-${name.toLowerCase()}`;
  }

  /** @returns {string} The key of the side. */
  get key() { return this.#key; }

  /** @returns {string} The name of the side. */
  get name() { return this.#name; }

  /** @returns {string} The icon of the side. */
  get icon() { return this.#icon; }

  /** @returns {Side[]} A list of all sides. */
  static get LIST() { return Object.values(Side); }

  // Register Sides
  static ATT = new Side('ATT', 'Attack');
  static DEF = new Side('DEF', 'Defense');
};

console.debug(Side.LIST);
