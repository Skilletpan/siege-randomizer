import ROLES from '@/data/roles.json';

import Operator from './Operator';

export default class Role {
  static {
    // Build role instances from raw data
    Object.entries(ROLES).forEach(([id, role]) => {
      // Ignore disabled roles
      if (role.disabled) return;

      // Create role instance
      this[id] = new Role({
        id,
        name: role.name
      });
    });

    // Freeze role object
    Object.freeze(Role);

    console.debug(
      'Roles imported:',
      Role.LIST
    );
  }

  // Instance properties
  #id;
  #name;

  /**
   * Creates a new Role instance.
   * 
   * @param {Object} role      The raw role data.
   * @param {String} role.id   The ID of the role.
   * @param {String} role.name The name of the role.
   */
  constructor(role) {
    this.#id = role.id;
    this.#name = role.name;
  }

  /** @returns {String} The ID of the role. */
  get id() { return this.#id; }

  /** @returns {String} The name of the role. */
  get name() { return this.#name; }

  /** @returns {Operator[]} The operators fulfilling this role. */
  get operators() { return Operator.getOperators({ roles: [this] }); }

  /** @returns {Role[]} A list of all roles. */
  static get LIST() { return Object.values(this); }
}
