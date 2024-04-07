import RAW_GADGETS from '@/data/gadgets';

export default class Gadget {
  // Instance properties
  #key;
  #name;
  #amount;

  /**
   * @param {string} key               The key of the gadget.
   * @param {Object} gadgetData        The raw gadget data.
   * @param {string} gadgetData.name   The name of the gadget.
   * @param {number} gadgetData.amount The amount of gadgets the player gets.
   */
  constructor(key, gadgetData) {
    this.#key = key;
    this.#name = gadgetData.name;
    this.#amount = gadgetData.amount;
  }

  /** @returns {string} The key of the gadget. */
  get key() { return this.#key; }

  /** @returns {string} The name of the gadget. */
  get name() { return this.#name; }

  /** @returns {number} The amount of gadgets the player gets. */
  get amount() { return this.#amount; }

  /** @returns {Gadget[]} A list of all gadgets. */
  static get LIST() { return Object.values(Gadget); }

  // Register Gadgets
  static {
    Object.entries(RAW_GADGETS).forEach(([key, gadgetData]) => {
      this[key] = new Gadget(key, gadgetData);
    });
  }
}

console.debug(Gadget.LIST);
