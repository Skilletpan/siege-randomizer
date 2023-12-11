import Gadget from './Gadget';
import Weapon from './Weapon';

export default class Loadout {
  // Instance properties
  #primary = [];
  #secondary = [];
  #gadgets = [];

  /**
   * Creates a new Loadout instance.
   * 
   * @param {Object}   loadout           The raw loadout data.
   * @param {string[]} loadout.primary   The primary weapons of the loadout.
   * @param {string[]} loadout.secondary The secondary weapons of the loadout.
   * @param {string[]} loadout.gadgets   The gadgets of the loadout.
   */
  constructor(loadout) {
    this.#primary.push(...loadout.primary);
    this.#secondary.push(...loadout.secondary);
    this.#gadgets.push(...loadout.gadgets);
  }

  /** @returns {Weapon[]} The primary weapons of the loadout. */
  get primaryWeapons() { return Weapon.LIST.filter((weapon) => this.#primary.includes(weapon.key)); }

  /** @returns {Weapon[]} The secondary weapons of the loadout. */
  get secondaryWeapons() { return Weapon.LIST.filter((weapon) => this.#secondary.includes(weapon.key)); }

  /** @returns {Gadget[]} The gadgets of the loadout. */
  get gadgets() { return Gadget.LIST.filter((gadget) => this.#gadgets.includes(gadget.key)); }
}