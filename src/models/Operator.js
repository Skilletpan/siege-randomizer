import Gadget from './Gadget';
import Loadout from './Loadout';
import { MapModel } from './Model';
import Role from './Role';
import Side from './Side';
import Squad from './Squad';
import Weapon from './Weapon';

export default class Operator extends MapModel {
  // Static properties
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

  /** @returns {Operator[]} A list of all operators. */
  static get LIST() { return super.LIST; }

  /**
   * Parses an input to a Operator instance.
   * 
   * @param {Operator | string} operator The input to parse.
   * 
   * @returns {Operator} The operator derived from the input.
   */
  static valueOf(operator) { return super.valueOf(operator); }

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
  get roles() { return Role.LIST.filter((role) => this.#roles.includes(role.key)); }

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
   * @typedef LoadoutFilter The loadout filter object.
   * @type {Object}
   * @prop {?Weapon[]|string[]} [primary]        The (keys of the) primary weapons the operators must have.
   * @prop {?Weapon[]|string[]} [secondary]      The (keys of the) secondary weapons the operators must have.
   * @prop {?Gadget[]|string[]} [gadget]         The (keys of the) gadgets the operator must have.
   * @prop {'every'|'some'}     [method='some']  Whether the operators must fulfill some or every requirement.
   * @prop {?boolean}           [negative=false] Whether the operator must not fulfill the given requirements.
   */

  /**
   * Finds all operators that match the provided filters.
   * 
   * @param {Object}              filters                  The filter object.
   * @param {Operator[]|string[]} [filters.bans]           The (keys of the) operators that are banned.
   * @param {number[]}            [filters.speed]          The speed value(s) the operators can have.
   * @param {number[]}            [filters.health]         The health value(s) the operators can have.
   * @param {Side|string}         [filters.side]           The (key of the) side the operators belong to.
   * @param {Role[]|string[]}     [filters.role]           The (keys of the) roles the operators must fulfill.
   * @param {Squad|string}        [filters.squad]          The squad the operators must be part of.
   * @param {LoadoutFilter[]}     [filters.loadoutFilters] The loadout items the operators must have.
   * @param {Operator[]}          [pool]                   A pre-defined operator pool.
   * 
   * @returns {Operator[]} The operators that match the criteria.
   */
  static getOperators(filters, pool = Operator.LIST) {
    const parsedFilters = {};

    // Parse bans
    if (filters.bans) parsedFilters.bans = filters.bans.map((o) => Operator.valueOf(o));

    // Parse simple filter values
    if (filters.side) parsedFilters.side = Side.valueOf(filters.side);
    if (filters.role?.length) parsedFilters.role = filters.role.map((r) => Role.valueOf(r));
    if (filters.squad) parsedFilters.squad = Squad.valueOf(filters.squad);

    // Parse loadout filters
    if (filters.loadoutFilters?.length) parsedFilters.loadoutFilters = filters.loadoutFilters.map((l) => {
      const parsedLoadoutFilter = { method: l.method || 'some', negative: Boolean(l.negative) };

      if (l.primary?.length) parsedLoadoutFilter.primary = l.primary.map((p) => Weapon.valueOf(p));
      if (l.secondary?.length) parsedLoadoutFilter.secondary = l.secondary.map((s) => Weapon.valueOf(s));
      if (l.gadget?.length) parsedLoadoutFilter.gadget = l.gadget.map((g) => Gadget.valueOf(g));

      return parsedLoadoutFilter;
    });

    // The final filter values
    const { speed, health } = filters;
    const { bans, side, role, squad, loadoutFilters } = parsedFilters;

    // Filter operators
    return pool.filter((o) => {
      // Filter by bans
      if (bans && bans.includes(o)) return false;

      // Filter by simple values
      if (speed?.length && !speed.includes(o.speed)) return false;
      if (health?.length && !health.includes(o.health)) return false;
      if (side && o.side !== side) return false;
      if (role && !role.every((r) => o.roles.includes(r))) return false;
      if (squad && o.squad !== squad) return false;

      // Filter by loadout filters
      if (loadoutFilters && !loadoutFilters.every((l) => {
        const { primary, secondary, gadget, method, negative } = l;
        const checks = [];

        // Check for loadout items
        if (primary) checks.push(primary[method]((p) => o.loadout.primaryWeapons.includes(p)));
        if (secondary) checks.push(secondary[method]((s) => o.loadout.secondaryWeapons.includes(s)));
        if (gadget) checks.push(gadget[method]((g) => o.loadout.gadgets.includes(g)));

        // Return verdict
        if (negative) return !checks.some((c) => c);
        return checks[method]((c) => c);
      })) return false;

      return true;
    });
  }
}
