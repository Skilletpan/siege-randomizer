import { MappedModel } from './Model';
import Operator from './Operator';

// export default class Gadget {
//   static {
//     const rawGadgets = require('@/data/gadgets.json');

//     // Build gadget instances from raw data
//     Object.entries(rawGadgets).forEach(([id, gadget]) => {
//       // Create gadget instance
//       this[id] = new Gadget({
//         id,
//         name: gadget.name,
//         isDeployable: gadget.isDeployable,
//         isElectrical: gadget.isElectrical,
//         isLethal: gadget.isLethal,
//         isThrowable: gadget.isThrowable
//       });
//     });

//     // Freeze gadget object
//     Object.freeze(this);

//     console.debug(
//       'Gadgets imported:',
//       this.LIST
//     );
//   }

//   // Instance properties
//   #id;
//   #name;
//   #isDeployable;
//   #isElectrical;
//   #isLethal;
//   #isThrowable;

//   /**
//    * Creates a new Gadget instance.
//    * 
//    * @param {Object}   gadget              The raw gadget data.
//    * @param {string}   gadget.id           The ID of the gadget.
//    * @param {string}   gadget.name         The name of the gadget.
//    * @param {?boolean} gadget.isDeployable Whether the gadget can be deployed.
//    * @param {?boolean} gadget.isElectrical Whether the gadget is electrical.
//    * @param {?boolean} gadget.isLethal     Whether the gadget is lethal.
//    * @param {?boolean} gadget.isThrowable  Whether the gadget can be thrown.
//    */
//   constructor(gadget) {
//     this.#id = gadget.id;
//     this.#name = gadget.name;
//     this.#isDeployable = Boolean(gadget.isDeployable);
//     this.#isElectrical = Boolean(gadget.isElectrical);
//     this.#isLethal = Boolean(gadget.isLethal);
//     this.#isThrowable = Boolean(gadget.isThrowable);
//   }

//   /** @returns {string} The ID of the gadget. */
//   get id() { return this.#id; }

//   /** @returns {string} The name of the gadget. */
//   get name() { return this.#name; }

//   /** @returns {boolean} Whether the gadget is deployable. */
//   get isDeployable() { return this.#isDeployable; }

//   /** @returns {boolean} Whether the gadget is electrical. */
//   get isElectrical() { return this.#isElectrical; }

//   /** @returns {boolean} Whether the gadget is lethal. */
//   get isLethal() { return this.#isLethal; }

//   /** @returns {boolean} Whether the gadget is throwable. */
//   get isThrowable() { return this.#isThrowable; }

//   /** @returns {Array<Operator>} The operators who use this gadget. */
//   get operators() { return Operator.getOperators({ gadgets: [this] }); }

//   /** @returns {Array<Gadget>} A list of all gadgets. */
//   static get LIST() { return Object.values(this); }
// }

export default class Gadget extends MappedModel {
  static {
    this._className = 'gadgets';
    const rawGadgets = require('@/data/gadgets.json');

    // Build gadget instances from raw data
    Object.entries(rawGadgets).forEach(([key, gadget], index) => {
      // Create gadget instance
      new Gadget({
        id: index,
        key,
        name: gadget.name,
        isDeployable: gadget.isDeployable,
        isElectrical: gadget.isElectrical,
        isLethal: gadget.isLethal,
        isThrowable: gadget.isThrowable
      });

      // Add getter
      MappedModel._addGetter(this, key);
    });

    console.debug('Gadgets imported:', Gadget.LIST);
  }

  // Instance properties
  #isDeployable = false;
  #isElectrical = false;
  #isLethal = false;
  #isThrowable = false;

  /**
   * Creates a new Gadget instance.
   * 
   * @param {Object}   rawGadget              The raw gadget data.
   * @param {number}   rawGadget.id           The ID of the gadget.
   * @param {string}   rawGadget.key          The key of the gadget.
   * @param {string}   rawGadget.name         The name of the gadget.
   * @param {?boolean} rawGadget.isDeployable Whether the gadget can be deployed.
   * @param {?boolean} rawGadget.isElectrical Whether the gadget is electrical.
   * @param {?boolean} rawGadget.isLethal     Whether the gadget is lethal.
   * @param {?boolean} rawGadget.isThrowable  Whether the gadget can be thrown.
   */
  constructor(rawGadget) {
    super(rawGadget, Gadget._className);

    // Set instance properties
    this.#isDeployable = Boolean(rawGadget.isDeployable);
    this.#isElectrical = Boolean(rawGadget.isElectrical);
    this.#isLethal = Boolean(rawGadget.isLethal);
    this.#isThrowable = Boolean(rawGadget.isThrowable);
  }

  /** @returns {boolean} Whether the gadget is deployable. */
  get isDeployable() { return this.#isDeployable; }

  /** @returns {boolean} Whether the gadget is electrical. */
  get isElectrical() { return this.#isElectrical; }

  /** @returns {boolean} Whether the gadget is lethal. */
  get isLethal() { return this.#isLethal; }

  /** @returns {boolean} Whether the gadget is throwable. */
  get isThrowable() { return this.#isThrowable; }
}
