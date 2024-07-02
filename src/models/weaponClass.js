import RAW_WEAPON_CLASSES from '@/data/weaponClasses';

export default class WeaponClass {
  // Instance properties
  #key;
  #name;
  #slot;

  /**
   * @param {string}                key               The key of the weapon class.
   * @param {Object}                weaponData        The raw weapon class data.
   * @param {string}                weaponData.name   The name of the weapon class.
   * @param {"PRIMARY"|"SECONDARY"} [weaponData.slot] The slot of the weapon class.
   */
  constructor(key, weaponData) {
    this.#key = key;
    this.#name = weaponData.name;
    this.#slot = weaponData.slot;
  }

  /** @returns {string} The key of the weapon class. */
  get key() { return this.#key; }

  /** @returns {string} The name of the weapon class. */
  get name() { return this.#name; }

  /** @returns {boolean} Whether the weapon class is a primary weapon. */
  get isPrimary() { return !this.#slot || this.#slot === 'PRIMARY'; }

  /** @returns {boolean} Whether the weapon class is a secondary weapon. */
  get isSecondary() { return !this.#slot || this.#slot === 'SECONDARY'; }

  /** @returns {WeaponClass[]} A list of all weapon classes. */
  static get LIST() { return Object.values(WeaponClass); }

  // Register Weapon Classes
  static {
    Object.entries(RAW_WEAPON_CLASSES).forEach(([key, name]) => {
      this[key] = new WeaponClass(key, name);
    });
  }
}

console.debug(WeaponClass.LIST);
