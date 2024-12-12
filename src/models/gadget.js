import RAW_GADGETS from '@/data/gadgets';

/**
 * @typedef GadgetProperty The properties of the gadget.
 * @type {"CONTROLLABLE"|"DEPLOYABLE"|"ELECTRIC"|"EXPENDABLE"|"EXPLOSIVE"|"INFINITE"|"LETHAL"|"RECHARGABLE"|"THROWABLE"}
 */

/** A gadget in an operator's loadout. */
export default class Gadget {
  // Instance properties
  #key;
  #name;
  #amount;
  #ammunition;
  #uses;
  #properties;

  /**
   * @param {string}           key                     The key of the gadget.
   * @param {Object}           gadgetData              The raw gadget data.
   * @param {string}           gadgetData.name         The name of the gadget.
   * @param {number}           [gadgetData.amount]     The amount of instances of the gadget the player receives.
   * @param {number}           [gadgetData.ammunition] The amount of ammunition for the gadget the player receives.
   * @param {number}           [gadgetData.uses]       The amount of times the player can use the gadget.
   * @param {GadgetProperty[]} gadgetData.properties   The properties of the gadget.
   */
  constructor(key, gadgetData) {
    this.#key = key;
    this.#name = gadgetData.name;
    this.#amount = gadgetData.amount || null;
    this.#ammunition = gadgetData.ammunition || null;
    this.#uses = gadgetData.uses || null;
    this.#properties = Array.from(gadgetData.properties);
  }

  /**
   * The key of the gadget.
   * @type {string}
   */
  get key() { return this.#key; }

  /**
   * The name of the gadget.
   * @type {string}
   */
  get name() { return this.#name; }

  /**
   * The display name of the gadget.
   * @type {string}
   */
  get displayName() {
    let _displayName = this.#name;

    if (this.#amount) _displayName = `${_displayName} (x${this.#amount})`;
    if (this.#ammunition) _displayName = `${_displayName} (${this.#ammunition} shots)`;
    if (this.#uses) _displayName = `${_displayName} (${this.#uses} uses)`;

    return _displayName;
  }

  /**
   * The amount of instances of the gadget the player receives.
   * @type {number}
   */
  get amount() { return this.#amount; }

  /**
   * The amount of ammunition for the gadget the player receives.
   * @type {number}
   */
  get ammunition() { return this.#ammunition; }

  /**
   * The amount of times the player can use the gadget.
   * @type {number}
   */
  get uses() { return this.#uses; }

  get isControllable() { return this.#properties.includes('CONTROLLABLE'); }

  get isDeployable() { return this.#properties.includes('DEPLOYABLE'); }

  get isElectric() { return this.#properties.includes('ELECTRIC'); }

  get isExpendable() { return this.#properties.includes('EXPENDABLE'); }

  get isExplosive() { return this.#properties.includes('EXPLOSIVE'); }

  get isInfinite() { return this.#properties.includes('INFINITE'); }

  get isLethal() { return this.#properties.includes('LETHAL'); }

  get isThrowable() { return this.#properties.includes('THROWABLE'); }

  /**
   * A list of all secondary gadgets.
   * 
   * Primary Gadgets are not being listed.
   * 
   * @type {Gadget[]}
   */
  static get LIST() { return Object.values(Gadget); }

  // Register Gadgets
  static {
    Object.entries(RAW_GADGETS).forEach(([key, gadgetData]) => {
      this[key] = new Gadget(key, gadgetData);
    });
  }
}

console.debug(Gadget.LIST);
