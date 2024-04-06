import Gadget from './Gadget';
import Weapon from './Weapon';

export default class Loadout {
  // Instance properties
  #weapons;
  #gadgets;

  /**
   * Creates a new Loadout instance.
   * 
   * @param {Object}   rawLoadout                   The raw loadout data.
   * @param {Object}   rawLoadout.weapons           The weapons of the loadout.
   * @param {string[]} rawLoadout.weapons.primary   The primary weapons of the loadout.
   * @param {string[]} rawLoadout.weapons.secondary The secondary weapons of the loadout.
   * @param {string[]} rawLoadout.gadgets           The gadgets of the loadout.
   */
  constructor(rawLoadout) {
    this.#weapons = rawLoadout.weapons;
    this.#gadgets = Array.from(rawLoadout.gadgets);
  }

  /** @returns {Weapon[]} The primary weapons of the loadout. */
  get primaryWeapons() { return this.#weapons.primary.map((weapon) => Weapon.valueOf(weapon)); }

  /** @returns {Weapon[]} The secondary weapons of the loadout. */
  get secondaryWeapons() { return this.#weapons.secondary.map((weapon) => Weapon.valueOf(weapon)); }

  /** @returns {Gadget[]} The gadgets of the loadout. */
  get gadgets() { return this.#gadgets.map((gadget) => Gadget.valueOf(gadget)); }

  /**
   * Checks whether a given weapon class is present in the loadout.
   * 
   * @param {Weapon|string}         weapon The weapon class to check for.
   * @param {'primary'|'secondary'} [slot] The slot to check. (if omitted, both slots are checked)
   * 
   * @returns {boolean} Whether the weapon class is present in the loadout.
   */
  hasWeapon(weapon, slot = null) {
    const _weapon = Weapon.valueOf(weapon);

    switch (slot) {
      case 'primary':
        return this.#weapons.primary.includes(_weapon.key);

      case 'secondary':
        return this.#weapons.secondary.includes(_weapon.key);

      default:
        return this.#weapons.primary.includes(_weapon.key) || this.#weapons.secondary.includes(_weapon.key);
    }
  }

  /**
   * Checks whether a given gadget is present in the loadout.
   * 
   * @param {Gadget|string} gadget The gadget to check for.
   * 
   * @returns {boolean} Whether the gadget is present in the loadout.
   */
  hasGadget(gadget) {
    const _gadget = Gadget.valueOf(gadget);
    return this.#gadgets.includes(_gadget.key);
  }

  /**
   * Checks whether a gadget with given properties is present in the loadout.
   * 
   * @param {{ [property: string]: boolean }} properties The gadget properties to check for.
   * 
   * @returns {boolean} Whether a matching gadget is present in the loadout.
   */
  hasGadgetWithProperties(properties) {
    return this.gadgets.some((gadget) => {
      return Object.keys(properties).every((p) => gadget.properties[p] === properties[p]);
    });
  }
}
