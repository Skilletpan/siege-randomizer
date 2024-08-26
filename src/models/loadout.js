import Gadget from './gadget';
import WeaponClass from './weaponClass';

/**
 * The loadout of an operator.
 * 
 * Operator loadouts include primary weapons, secondary weapons and gadgets.
 */
export default class Loadout {
  // Instance properties
  #primaryWeaponKeys;
  #secondaryWeaponKeys;
  #gadgetKeys;

  /**
   * @param {Object}   loadoutData                  The raw loadout data.
   * @param {string[]} loadoutData.primaryWeapons   The keys of the primary weapons of the operator.
   * @param {string[]} loadoutData.secondaryWeapons The keys of the secondary weapons of the operator.
   * @param {string[]} loadoutData.gadgets          The keys of the gadgets of the operator.
   */
  constructor(loadoutData) {
    this.#primaryWeaponKeys = Array.from(loadoutData.primaryWeapons);
    this.#secondaryWeaponKeys = Array.from(loadoutData.secondaryWeapons);
    this.#gadgetKeys = Array.from(loadoutData.gadgets);
  }

  /**
   * The primary weapons of the operator.
   * @type {WeaponClass[]}
   */
  get primaryWeapons() { return this.#primaryWeaponKeys.map((key) => WeaponClass[key]); }

  /**
   * The secondary weapons of the operator.
   * @type {WeaponClass[]}
   */
  get secondaryWeapons() { return this.#secondaryWeaponKeys.map((key) => WeaponClass[key]); }

  /**
   * All weapons of the operator.
   * @type {WeaponClass[]}
   */
  get weapons() { return [...this.primaryWeapons, ...this.secondaryWeapons]; }

  /**
   * The gadgets of the operator.
   * @type {Gadget[]}
   */
  get gadgets() { return this.#gadgetKeys.map((key) => Gadget[key]); }
}
