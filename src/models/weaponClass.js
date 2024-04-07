import RAW_WEAPON_CLASSES from '@/data/weaponClasses';

export default class WeaponClass {
  // Instance properties
  #key;
  #name;

  /**
   * @param {string} key  The key of the weapon class.
   * @param {string} name The name of the weapon class.
   */
  constructor(key, name) {
    this.#key = key;
    this.#name = name;
  }

  /** @returns {string} The key of the weapon class. */
  get key() { return this.#key; }

  /** @returns {string} The name of the weapon class. */
  get name() { return this.#name; }

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
