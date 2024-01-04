import { MapModel } from './Model';
import Operator from './Operator';

export default class Role extends MapModel {
  // Static properties
  static {
    const rawRoles = require('@/data/roles.json');

    // Build role instances from raw data
    Object.entries(rawRoles).forEach(([key, role]) => {
      // Create role instance
      new Role({ key, name: role });
    });

    console.debug('Roles imported:', Role.LIST);
  }

  /** @returns {Role[]} A list of all roles. */
  static get LIST() { return super.LIST; }

  /**
   * Parses an input to a Role instance.
   * 
   * @param {Role | string} role The input to parse.
   * 
   * @returns {Role} The role derived from the input.
   */
  static valueOf(role) { return super.valueOf(role); }

  // Instance properties
  #name;

  /**
   * Creates a new Role instance.
   * 
   * @param {Object} rawRole      The raw role data.
   * @param {string} rawRole.key  The key of the role.
   * @param {string} rawRole.name The name of the role.
   */
  constructor(rawRole) {
    super(rawRole.key, Role);

    // Set instance properties
    this.#name = rawRole.name;
  }

  /** @returns {string} The name of the role. */
  get name() { return this.#name; }

  /** @returns {Operator[]} The operators fulfilling this role. */
  get operators() { return Operator.getOperators({ roles: [this] }); }
}
