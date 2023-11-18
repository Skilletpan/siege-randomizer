import GADGETS from '@/data/gadgets.json';

import Operator from './Operator';

export default class Gadget {
  static {
    // Build gadget instances from raw data
    Object.entries(GADGETS).forEach(([id, gadget]) => {
      // Create gadget instance
      this[id] = new Gadget({
        id,
        name: gadget.name,
        isLethal: gadget.isLethal
      });
    });
  }

  // Instance properties
  #id;
  #name;
  #isLethal;

  /**
   * Creates a new Gadget instance.
   * 
   * @param {Object}   gadget          The raw gadget data.
   * @param {String}   gadget.id       The ID of the gadget.
   * @param {String}   gadget.name     The name of the gadget.
   * @param {?Boolean} gadget.isLethal Whether the gadget is lethal. 
   */
  constructor(gadget) {
    this.#id = gadget.id;
    this.#name = gadget.name;
    this.#isLethal = Boolean(gadget.isLethal);
  }

  /** @returns {String} The ID of the gadget. */
  get id() { return this.#id; }

  /** @returns {String} The name of the gadget. */
  get name() { return this.#name; }

  /** @returns {Boolean} Whether the gadget is lethal. */
  get isLethal() { return this.#isLethal; }

  /** @returns {Operator[]} The operators who use this gadget. */
  get operators() { return Operator.getOperators({ gadgets: [this] }); }

  /** @returns {Gadget[]} A list of all gadgets. */
  static get LIST() { return Object.values(this); }
}