import { MapModel } from './Model';
import Operator from './Operator';

export default class Gadget extends MapModel {
  // Static properties
  static {
    const rawGadgets = require('@/data/gadgets.json');

    // Build gadget instances from raw data
    Object.entries(rawGadgets).forEach(([key, gadget]) => new Gadget({ key, ...gadget }));

    console.debug('Gadgets imported:', Gadget.LIST);
  }

  /** @returns {Gadget[]} A list of all gadgets. */
  static get LIST() { return super.LIST; }

  /**
   * Parses an input to a Gadget instance.
   * 
   * @param {Gadget | string} gadget The input to parse.
   * 
   * @returns {Gadget} The gadget derived from the input.
   */
  static valueOf(gadget) { return super.valueOf(gadget); }

  // Instance properties
  #name;
  #amount;
  #properties;
  #operators;

  /**
   * Creates a new Gadget instance.
   * 
   * @param {Object}   rawGadget                         The raw gadget data.
   * @param {string}   rawGadget.key                     The key of the gadget.
   * @param {string}   rawGadget.name                    The name of the gadget.
   * @param {number}   rawGadget.amount                  The amount of copies of the gadget the player gets.
   * @param {string[]} rawGadget.properties              The properties of the gadget.
   */
  constructor(rawGadget) {
    super(rawGadget.key, Gadget);

    // Set instance properties
    this.#name = rawGadget.name;
    this.#amount = rawGadget.amount;
    this.#properties = {
      deployable: rawGadget.properties.includes('DEPLOYABLE'),
      electrical: rawGadget.properties.includes('ELECTRICAL'),
      lethal: rawGadget.properties.includes('LETHAL'),
      throwable: rawGadget.properties.includes('THROWABLE')
    };
  }

  /** @returns {string} The name of the gadget. */
  get name() { return this.#name; }

  /** @returns {number} The amount of copies of the gadget the player gets. */
  get amount() { return this.#amount; }

  /** @returns {{ [feature: string]: boolean }} The properties of the gadget. */
  get properties() { return this.#properties; }

  /** @returns {Operator[]} The operators who use this gadget. */
  get operators() {
    // Maps operators on first call
    if (!this.#operators) this.#operators = Operator.LIST.filter((operator) => operator.loadout.hasGadget(this));
    return this.#operators;
  }
}
