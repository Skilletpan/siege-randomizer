import { MapModel } from './Model';
import Operator from './Operator';

export default class Gadget extends MapModel {
  static {
    const rawGadgets = require('@/data/gadgets.json');

    // Build gadget instances from raw data
    Object.entries(rawGadgets).forEach(([key, gadget]) => {
      // Create gadget instance
      new Gadget({ key, ...gadget });
    });

    console.debug('Gadgets imported:', Gadget.LIST);
  }

  // Instance properties
  #name;
  #isDeployable = false;
  #isElectrical = false;
  #isLethal = false;
  #isThrowable = false;

  /**
   * Creates a new Gadget instance.
   * 
   * @param {Object}   rawGadget              The raw gadget data.
   * @param {string}   rawGadget.key          The key of the gadget.
   * @param {string}   rawGadget.name         The name of the gadget.
   * @param {?boolean} rawGadget.isDeployable Whether the gadget can be deployed.
   * @param {?boolean} rawGadget.isElectrical Whether the gadget is electrical.
   * @param {?boolean} rawGadget.isLethal     Whether the gadget is lethal.
   * @param {?boolean} rawGadget.isThrowable  Whether the gadget can be thrown.
   */
  constructor(rawGadget) {
    super(rawGadget.key, Gadget);

    // Set instance properties
    this.#name = rawGadget.name;
    this.#isDeployable = Boolean(rawGadget.isDeployable);
    this.#isElectrical = Boolean(rawGadget.isElectrical);
    this.#isLethal = Boolean(rawGadget.isLethal);
    this.#isThrowable = Boolean(rawGadget.isThrowable);
  }

  /** @returns {string} The name of the gadget. */
  get key() { return this.#name; }

  /** @returns {boolean} Whether the gadget is deployable. */
  get isDeployable() { return this.#isDeployable; }

  /** @returns {boolean} Whether the gadget is electrical. */
  get isElectrical() { return this.#isElectrical; }

  /** @returns {boolean} Whether the gadget is lethal. */
  get isLethal() { return this.#isLethal; }

  /** @returns {boolean} Whether the gadget is throwable. */
  get isThrowable() { return this.#isThrowable; }

  /** @returns {Operator[]} The operators who use this gadget. */
  get operators() { return Operator.getOperators({ gadgets: [this] }); }
}
