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
  static AR = new WeaponClass('AR', 'Assault Rifle');
  static SMG = new WeaponClass('SMG', 'Submachine Gun');
  static LMG = new WeaponClass('LMG', 'Light Machine Gun');
  static SG = new WeaponClass('SG', 'Shotgun');
  static SSG = new WeaponClass('SSG', 'Slug Shotgun');
  static DMR = new WeaponClass('DMR', 'Marksman Rifle');
  static MP = new WeaponClass('MP', 'Machine Pistol');
  static HG = new WeaponClass('HG', 'Handgun');
  static DE = new WeaponClass('DE', 'Deagle');
  static REV = new WeaponClass('REV', 'Revolver');
  static BAI = new WeaponClass('BAI', 'Bailiff');
  static HC = new WeaponClass('HC', 'Hand Cannon');
  static SH = new WeaponClass('SH', 'Shield');
};

console.debug(WeaponClass.LIST);
