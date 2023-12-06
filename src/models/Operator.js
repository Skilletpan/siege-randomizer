import Gadget from './Gadget';
import Loadout from './Loadout';
import Role from './Role';
import Side from './Side';
import Squad from './Squad';
import Weapon from './Weapon';

export default class Operator {
  static {
    const rawOperators = require('@/data/operators.json');

    // Build operator instances from raw data
    Object.entries(rawOperators).forEach(([side, operators]) => {
      Object.entries(operators).forEach(([id, operator]) => {
        // Ignore disabled operators
        if (operator.disabled) return;

        // Create operator instance
        this[id] = new Operator({
          id,
          name: operator.name,
          roles: operator.roles,
          side,
          speed: operator.speed,
          squad: operator.squad,
          loadout: operator.loadout
        });
      });
    });

    // Freeze operator object
    Object.freeze(this);

    console.debug(
      'Operators imported:',
      this.LIST
    );
  }

  // Instance properties
  #id;
  #name;
  #roles = [];
  #side;
  #speed;
  #squad;

  #loadout;

  #portrait;
  #emblem;
  #easterEggs = [];

  /**
   * Creates a new Operator instance.
   * 
   * @param {Object}        operator            The raw operator data.
   * @param {string}        operator.id         The ID of the operator.
   * @param {string}        operator.name       The name of the operator.
   * @param {Array<string>} operator.roles      The role(s) of the operator.
   * @param {string}        operator.side       The side of the operator.
   * @param {number}        operator.speed      The speed of the operator.
   * @param {?string}       [operator.squad]    The squad of the operator.
   * @param {Object}        operator.loadout    The raw loadout data of the operator.
   */
  constructor(operator) {
    this.#id = operator.id;
    this.#name = operator.name;
    this.#roles.push(...operator.roles);
    this.#side = operator.side;
    this.#speed = operator.speed;
    this.#squad = operator.squad || null;
    this.#loadout = new Loadout(operator.loadout);

    const imageName = operator.id.replace(/_[A-Z]{3}/, '');
    this.#portrait = require(`@/assets/portraits/${imageName}.png`);
    this.#emblem = require(`@/assets/emblems/${imageName}.png`);

    // Check for alternate portraits
    for (let counter = 1; ; counter++) {
      try {
        this.#easterEggs.push(require(`@/assets/portraits/${imageName}_${counter}.png`));
      } catch (e) {
        break;
      }
    }
  }

  /** @returns {string} The ID of the operator. */
  get id() { return this.#id; }

  /** @returns {string} The name of the operator. */
  get name() { return this.#name; }

  /** @returns {Side} The side of the operator. */
  get side() { return Side[this.#side]; }

  /** @returns {number} The speed of the operator. */
  get speed() { return this.#speed; }

  /** @returns {number} The health of the operator. */
  get health() { return 4 - this.#speed; }

  /** @returns {Array<Role>} The role(s) of the operator. */
  get roles() { return this.#roles.map((role) => Role[role]); }

  /** @returns {Squad} The squad of the operator. */
  get squad() { return Squad[this.#squad] || null; }

  /** @returns {Loadout} The loadout of the operator. */
  get loadout() { return this.#loadout; }

  /** @returns {string} The emblem (or icon) of the operator. */
  get emblem() { return this.#emblem; }

  /** @returns {string} The portrait of the operator. */
  get portrait() { return this.#portrait; }

  /** @returns {string} The portrait of the operator with a 1 in 20 chance of loading an alternate portrait. */
  get easterEggPortrait() {
    // 1 in 50 chance to set an alternate portrait if available
    if (this.#easterEggs.length && Math.floor(Math.random() * 50) === 0) {
      return this.#easterEggs[Math.floor(Math.random() * this.#easterEggs.length)];
    }
    // Set default portrait
    return this.#portrait;
  }

  /** @returns {Array<Operator>} A list of all operators. */
  static get LIST() { return Object.values(this); }

  /**
   * Picks a random operator from a given pool or all operators.
   * 
   * @param {Array<Operator>} [operatorPool] The operators to pick from.
   * 
   * @returns {Operator} A randomly picked operator from the given pool.
   */
  static pickRandomOperator(operatorPool = null) {
    const pool = operatorPool || Operator.LIST;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Get operators by details.
   * 
   * @param {Object}               details           The details to filter operators by.
   * @param {number|Array<number>} [details.speed]   The speed the operator should have.
   * @param {number|Array<number>} [details.health]  The health the operator should have.
   * @param {Side|string}          [details.side]    The side the operator should be from.
   * @param {Array<Role|string>}   [details.roles]   The roles the operator should fulfill.
   * @param {Squad|string}         [details.squad]   The squad the operator should be part of.
   * @param {Array<Weapon|string>} [details.weapons] The weapons the operator should have.
   * @param {Array<Gadget|string>} [details.gadgets] The gadgets the operator should have.
   * 
   * @returns {Array<Operator>} The operators that match the provided details.
   */
  static getOperators(details) {
    const { speed, health, side, roles, squad, weapons, gadgets } = details;

    // Map keys to instances
    const si = side ? (typeof side === 'string' ? Side[side] : side) : null;
    const ro = roles ? (roles.map((r) => typeof r === 'string' ? Role[r] : r)) : null;
    const sq = squad ? (typeof squad === 'string' ? Squad[squad] : squad) : null;
    const we = weapons ? (weapons.map((w) => typeof w === 'string' ? Weapon[w] : w)) : null;
    const ga = gadgets ? (gadgets.map((g) => typeof g === 'string' ? Gadget[g] : g)) : null;

    // Return filtered operator list
    return Operator.LIST.filter((o) => {
      // Filter by speed
      if (Array.isArray(speed)) {
        if (!speed.includes(o.speed)) return false;
      } else if (speed && o.speed !== speed) return false;

      // Filter by health
      if (Array.isArray(health)) {
        if (!health.includes(o.health)) return false;
      } else if (health && o.health !== health) return false;

      // Filter by side
      if (side && o.side !== si) return false;

      // Filter by roles
      if (roles && !ro.every((r) => o.roles.includes(r))) return false;

      // Filter by squad
      if (squad && o.squad !== sq) return false;

      // Filter by weapon
      if (weapons && !we.some((w) => o.loadout.hasWeapon(w))) return false;

      // Filter by gadgets
      if (gadgets && !ga.some((g) => o.loadout.hasGadget(g))) return false;

      return true;
    });
  }

  /**
   * @typedef OperatorFilter
   * @type {Object}
   * @property {*}                             value
   * @property {'either'|'every'|'none'|'not'} [modifier='either']
   */

  /**
   * @param {Object<string, OperatorFilter>} filters
   * 
   * @returns {Array<Operator>}
   */
  static getOperators2(filters) {
  }
}
