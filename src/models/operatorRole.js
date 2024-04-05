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
  static ANTIENTRY = new OperatorRole('ANTIENTRY', 'Anti-Entry');
  static ANTIGADGET = new OperatorRole('ANTIGADGET', 'Anti-Gadget');
  static BREACH = new OperatorRole('BREACH', 'Breach');
  static CROWDCONTROL = new OperatorRole('CROWDCONTROL', 'Crowd Control');
  static FRONTLINE = new OperatorRole('FRONTLINE', 'Front Line');
  static INTEL = new OperatorRole('INTEL', 'Intel');
  static MAPCONTROL = new OperatorRole('MAPCONTROL', 'Map Control');
  static SUPPORT = new OperatorRole('SUPPORT', 'Support');
  static TRAPPER = new OperatorRole('TRAPPER', 'Trapper');
};

console.debug(OperatorRole.LIST);
