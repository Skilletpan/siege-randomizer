import RAW_ROLES from '@/data/roles';

export default class OperatorRole {
  // Instance properties
  #key;
  #name;

  /**
   * @param {string} key  The key of the operator role.
   * @param {string} name The name of the operator role.
   */
  constructor(key, name) {
    this.#key = key;
    this.#name = name;
  }

  /** @returns {string} The key of the operator role. */
  get key() { return this.#key; }

  /** @returns {string} The name of the operator role. */
  get name() { return this.#name; }

  /** @returns {OperatorRole[]} A list of all operator roles. */
  static get LIST() { return Object.values(OperatorRole); }

  // Register Operator Roles
  static {
    Object.entries(RAW_ROLES).forEach(([key, name]) => {
      this[key] = new OperatorRole(key, name);
    });
  }
}

console.debug(OperatorRole.LIST);
