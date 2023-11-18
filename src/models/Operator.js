import OPERATORS from '@/data/operators.json';

import Role from './Role';
import Side from './Side';
import Squad from './Squad';

export default class Operator {
  #id;
  #name;
  #roles = [];
  #side;
  #speed;
  #squad;

  #portrait;
  #emblem;
  #easterEggs = [];

  static {
    // Build operator instances from raw data
    Object.entries(OPERATORS).forEach(([side, operators]) => {
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
          squad: operator.squad
        });
      });
    });

    // Freeze operator object
    Object.freeze(Operator);

    console.debug(
      'Operators imported:',
      Operator.LIST
    );
  }

  /**
   * Creates a new Operator instance.
   * 
   * @param {Object}   operator         The raw operator data.
   * @param {String}   operator.id      The ID of the operator.
   * @param {String}   operator.name    The name of the operator.
   * @param {String[]} operator.roles   The role(s) of the operator.
   * @param {String}   operator.side    The side of the operator.
   * @param {Number}   operator.speed   The speed of the operator.
   * @param {String}   [operator.squad] The squad of the operator.
   */
  constructor(operator) {
    this.#id = operator.id;
    this.#name = operator.name;
    this.#roles.push(...operator.roles);
    this.#side = operator.side;
    this.#speed = operator.speed;
    this.#squad = operator.squad || null;

    const imageName = operator.id.replace(/_[A-Z]{3}/, '');
    this.#portrait = require(`@/assets/portraits/${imageName}.png`);
    this.#emblem = require(`@/assets/emblems/${imageName}.png`);

    // Check for alternate portraits
    for (let counter = 2; ; counter++) {
      try {
        this.#easterEggs.push(require(`@/assets/portraits/${imageName}_${counter}.png`));
      } catch (e) {
        break;
      }
    }
  }

  /** @returns {String} The ID of the operator. */
  get id() { return this.#id; }

  /** @returns {String} The name of the operator. */
  get name() { return this.#name; }

  /** @returns {Side} The side of the operator. */
  get side() { return Side[this.#side]; }

  /** @returns {Number} The speed of the operator. */
  get speed() { return this.#speed; }

  /** @returns {Number} The health of the operator. */
  get health() { return 4 - this.#speed; }

  /** @returns {Role[]} The role(s) of the operator. */
  get roles() { return this.#roles.map((role) => Role[role]); }

  /** @returns {String} The role(s) of the operator as a string. */
  get rolesString() { return this.roles.map((role) => role.name).join(' • '); }

  /** @returns {Squad} The squad of the operator. */
  get squad() { return Squad[this.#squad] || null; }

  /** @returns {String} The emblem (or icon) of the operator. */
  get emblem() { return this.#emblem; }

  /** @returns {String} The portrait of the operator. */
  get portrait() { return this.#portrait; }

  /** @returns {String} The portrait of the operator with a 1 in 50 chance of loading an alternate portrait. */
  get easterEggPortrait() {
    // 1 in 50 chance to set an alternate portrait if available
    if (this.#easterEggs.length && Math.floor(Math.random() * 50) === 0) {
      return this.#easterEggs[Math.floor(Math.random() * this.#easterEggs.length)];
    }
    // Set default portrait
    return this.#portrait;
  }

  /** @returns {Operator[]} A list of all operators. */
  static get LIST() { return Object.values(this); }

  /**
   * Get operators by details.
   * 
   * @param {Object}          details          The details to filter operators by.
   * @param {Number}          [details.speed]  The speed of the operator.
   * @param {Number}          [details.health] The health of the operator.
   * @param {Side|String}     [details.side]   The side of the operator.
   * @param {Role[]|String[]} [details.roles]  The roles of the operator.
   * @param {Squad|String}    [details.squad]  The squad of the operator.
   * 
   * @returns {Operator[]} The operators that match the provided details.
   */
  static getOperators(details) {
    const { speed, health, side, roles, squad } = details;

    const si = side ? (typeof side === 'string' ? Side[side] : side) : null;
    const ro = roles ? (roles.map((r) => typeof r === 'string' ? Role[r] : r)) : null;
    const sq = squad ? (typeof squad === 'string' ? Squad[squad] : squad) : null;

    return Operator.LIST.filter((o) => {
      if (speed && o.speed !== speed) return false;
      if (health && o.health !== health) return false;
      if (side && o.side !== si) return false;
      if (roles && !ro.every((r) => o.roles.includes(r))) return false;
      if (squad && o.squad !== sq) return false;

      return true;
    });
  }
}
