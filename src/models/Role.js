import Operator from './Operator';

export default class Role {
  static {
    const rawRoles = require('@/data/roles.json');

    // Build role instances from raw data
    Object.entries(rawRoles).forEach(([id, role]) => {
      // Create role instance
      this[id] = new Role({
        id,
        name: role
      });
    });

    // Freeze role object
    Object.freeze(this);

    console.debug(
      'Roles imported:',
      this.LIST
    );
  }

  // Instance properties
  #id;
  #name;

  /**
   * Creates a new Role instance.
   * 
   * @param {Object} role      The raw role data.
   * @param {string} role.id   The ID of the role.
   * @param {string} role.name The name of the role.
   */
  constructor(role) {
    this.#id = role.id;
    this.#name = role.name;
  }

  /** @returns {string} The ID of the role. */
  get id() { return this.#id; }

  /** @returns {string} The name of the role. */
  get name() { return this.#name; }

  /** @returns {Array<Operator>} The operators fulfilling this role. */
  get operators() { return Operator.getOperators({ roles: [this] }); }

  /** @returns {Array<Role>} A list of all roles. */
  static get LIST() { return Object.values(this); }
}
