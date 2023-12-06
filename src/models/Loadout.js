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
   * @param {Object}        loadout           The raw loadout data.
   * @param {Array<string>} loadout.primary   The primary weapons of the loadout.
   * @param {Array<string>} loadout.secondary The secondary weapons of the loadout.
   * @param {Array<string>} loadout.gadgets   The gadgets of the loadout.
   */
  constructor(loadout) {
    this.#primary.push(...loadout.primary);
    this.#secondary.push(...loadout.secondary);
    this.#gadgets.push(...loadout.gadgets);
  }

  /** @returns {Array<Weapon>} The primary weapons of the loadout. */
  get primaryWeapons() { return this.#primary.map((w) => Weapon[w]); }

  /** @returns {Array<Weapon>} The secondary weapons of the loadout. */
  get secondaryWeapons() { return this.#secondary.map((w) => Weapon[w]); }

  /** @returns {Array<Gadget>} The gadgets of the loadout. */
  get gadgets() { return this.#gadgets.map((g) => Gadget[g]); }

  /**
   * Checks whether a weapon is present in the loadout.
   * 
   * @param {Weapon}                  weapon The weapon to check for.
   * @param {"primary" | "secondary"} [slot] The weapon slot to check in.
   * 
   * @returns {boolean} Whether the weapon is present in the loadout.
   */
  hasWeapon(weapon, slot = null) {
    const pool = [];
    if (!slot || slot === 'primary') pool.push(...this.#primary);
    if (!slot || slot === 'secondary') pool.push(...this.#secondary);

    return pool.includes(weapon.id);
  }

  /**
   * Checks whether a gadget is present in the loadout.
   * 
   * @param {Gadget} gadget The gadget to check for.
   * 
   * @returns {boolean} Whether the gadget is present in the loadout.
   */
  hasGadget(gadget) { return this.#gadgets.includes(gadget.id); }
}