import Gadget from './Gadget';
import Loadout from './Loadout';
import { MapModel } from './Model';
import Role from './Role';
import Side from './Side';
import Squad from './Squad';
import Weapon from './Weapon';

export default class Operator extends MapModel {
  static {
    const rawOperators = require('@/data/operators.json');

    // Build operator instances from raw data
    Object.entries(rawOperators).forEach(([side, operators]) => {
      Object.entries(operators).forEach(([key, operator]) => {
        // Ignore disabled operators
        if (operator.disabled) return;

        // Create operator instance
        new Operator({ key, side, ...operator });
      });
    });

    console.debug('Operators imported:', Operator.LIST);
  }

  // Instance properties
  #name;
  #side;
  #speed;
  #roles = [];
  #squad;

  #loadout;

  #imageKey;
  #emblem;
  #portrait;
  #easterEggs = [];
  #hasLoadedEasterEggs = false;

  /**
   * Creates a new Operator instance.
   * 
   * @param {Object}   rawOperator         The raw operator data.
   * @param {string}   rawOperator.key     The key of the operator.
   * @param {string}   rawOperator.name    The name of the operator.
   * @param {string[]} rawOperator.roles   The role(s) of the operator.
   * @param {string}   rawOperator.side    The side of the operator.
   * @param {number}   rawOperator.speed   The speed of the operator.
   * @param {?string}  [rawOperator.squad] The squad of the operator.
   * @param {Object}   rawOperator.loadout The raw loadout data of the operator.
   */
  constructor(rawOperator) {
    super(rawOperator.key, Operator);

    // Set instance properties
    this.#name = rawOperator.name;
    this.#side = rawOperator.side;
    this.#speed = rawOperator.speed;
    this.#roles.push(...rawOperator.roles);
    this.#squad = rawOperator.squad || null;
    this.#loadout = new Loadout(rawOperator.loadout);

    this.#imageKey = rawOperator.key.replace(/_[A-Z]{3}/, '');
  }

  /** @returns {number} The name of the operator. */
  get name() { return this.#name; }

  /** @returns {Side} The side of the operator. */
  get side() { return Side.valueOf(this.#side); }

  /** @returns {number} The speed of the operator. */
  get speed() { return this.#speed; }

  /** @returns {number} The health of the operator. */
  get health() { return 4 - this.#speed; }

  /** @returns {Role[]} The role(s) of the operator. */
  get roles() { return this.#roles.map((role) => Role[role]); }

  /** @returns {Squad} The squad of the operator. */
  get squad() { return Squad[this.#squad] || null; }

  /** @returns {Loadout} The loadout of the operator. */
  get loadout() { return this.#loadout; }

  /** @returns {string} The emblem (or icon) of the operator. */
  get emblem() {
    // Loads the emblem on first call
    if (!this.#emblem) this.#emblem = require(`@/assets/emblems/${this.#imageKey}.png`);

    return this.#emblem;
  }

  /** @returns {string} The portrait of the operator. */
  get portrait() {
    // Loads the portrait on first call
    if (!this.#portrait) this.#portrait = require(`@/assets/portraits/${this.#imageKey}.png`);

    return this.#portrait;
  }

  /** @returns {string} The portrait of the operator with a 1 in 50 chance of loading an alternate portrait. */
  get easterEggPortrait() {
    // Loads the easter egg portraits on first call
    if (!this.#hasLoadedEasterEggs) this.#loadEasterEggPortraits();

    // 1 in 50 chance to set an alternate portrait if available
    if (this.#easterEggs.length && Math.floor(Math.random() * 50) === 0) return MapModel.pickRandom(this.#easterEggs);

    // Set default portrait
    return this.portrait;
  }

  /** Loads the easter egg portraits. */
  #loadEasterEggPortraits() {
    for (let counter = 1; ; counter++) {
      try { this.#easterEggs.push(require(`@/assets/portraits/${this.#imageKey}_${counter}.png`)); }
      catch (e) { break; }
    }

    this.#hasLoadedEasterEggs = true;
  }

  /**
   * Get operators by details.
   * 
   * @param {Object}            details           The details to filter operators by.
   * @param {number|number[]}   [details.speed]   The speed the operator should have.
   * @param {number|number[]}   [details.health]  The health the operator should have.
   * @param {Side|string}       [details.side]    The side the operator should be from.
   * @param {(Role|string)[]}   [details.roles]   The roles the operator should fulfill.
   * @param {Squad|string}      [details.squad]   The squad the operator should be part of.
   * @param {(Weapon|string)[]} [details.weapons] The weapons the operator should have.
   * @param {(Gadget|string)[]} [details.gadgets] The gadgets the operator should have.
   * 
   * @returns {Operator[]} The operators that match the provided details.
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
}
