import { MapModel } from './Model';

export default class Weapon extends MapModel {
  // Static properties
  static {
    const rawWeapons = require('@/data/weapons.json');

    // Build weapon instances from raw data
    Object.entries(rawWeapons).forEach(([key, weapon]) => {
      // Create weapon instance
      new Weapon({ key, ...weapon });
    });

    console.debug('Weapons imported:', Weapon.LIST);
  }

  /** @returns {Weapon[]} A list of all weapons. */
  static get LIST() { return super.LIST; }

  /**
   * Parses an input to a Weapon instance.
   * 
   * @param {Weapon | string} weapon The input to parse.
   * 
   * @returns {Weapon} The weapon derived from the input.
   */
  static valueOf(weapon) { return super.valueOf(weapon); }

  // Instance properties
  #name;
  #slot;

  /**
   * Creates a new Weapon instance.
   * 
   * @param {Object}                rawWeapon      The raw weapon data.
   * @param {string}                rawWeapon.key  The key of the weapon.
   * @param {string}                rawWeapon.name The name of the weapon.
   * @param {'primary'|'secondary'} [rawWeapon.slot] The weapon slot the weapon belongs in.
   */
  constructor(rawWeapon) {
    super(rawWeapon.key, Weapon);

    // Set instance properties
    this.#name = rawWeapon.name;
    this.#slot = rawWeapon.slot || null;
  }

  /** @returns {string} The name of the weapon. */
  get name() { return this.#name; }

  /** @returns {boolean} Whether the weapon is a primary weapon. */
  get isPrimary() { return !this.#slot || this.#slot === 'primary'; }

  /** @returns {boolean} Whether the weapon is a secondary weapon. */
  get isSecondary() { return !this.#slot || this.#slot === 'secondary'; }
}
