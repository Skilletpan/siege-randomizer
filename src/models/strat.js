import RAW_STRATS from '@/data/strats';
import findItems from '@/utils/findItems';

import Operator from './operator';
import Side from './side';

export default class Strat {
  // Instance properties
  #id;
  #title;
  #tagline;
  #rules;
  #sideKey;

  #operatorKeys = [];
  #operatorFilters = [];
  #operators;

  /**
   * @param {number}              id                    The ID of the strat.
   * @param {Object}              stratData             The raw strat data.
   * @param {string}              stratData.title       The title of the strat.
   * @param {string}              stratData.tagline     The tagline of the strat.
   * @param {(string|Object)[]}   stratData.rules       The rules of the strat.
   * @param {string}              [stratData.side]      The key of the side of the strat.
   * @param {(string|Object[])[]} [stratData.operators] The keys of the operators specified in the strat.
   */
  constructor(id, stratData) {
    this.#id = id;
    this.#title = stratData.title;
    this.#tagline = stratData.tagline;
    this.#rules = stratData.rules.map((rule) => typeof rule === 'string' ? { text: rule } : rule);
    this.#sideKey = stratData.side;

    (stratData.operators || []).forEach((item) => {
      if (typeof item === 'string') this.#operatorKeys.push(item);
      else this.#operatorFilters.push(item);
    });
  }

  /** @returns {number} The ID of the strat. */
  get id() { return this.#id; }

  /** @returns {string} The title of the strat. */
  get title() { return this.#title; }

  /** @returns {string} The tagline of the strat. */
  get tagline() { return this.#tagline; }

  /** @returns {{ text: string, side?: Side, operator?: Operator }[]} The rules of the strat. */
  get rules() {
    return this.#rules.map((rule) => ({
      text: rule.text,
      side: Side[rule.side],
      operator: Operator[rule.operator]
    }));
  }

  /** @returns {Side} The side of the strat. */
  get side() { return Side[this.#sideKey]; }

  /** @returns {{ ATT: Operator[], DEF: Operator[] }} The operators required by the strat. */
  get requiredOperators() {
    // Fetch operators on first call
    if (!this.#operators) this.#getOperators();
    return this.#operators.required;
  }

  /** @returns {{ ATT: Operator[], DEF: Operator[] }} The operators allowed in the strat. */
  get allowedOperators() {
    // Fetch operators on first call
    if (!this.#operators) this.#getOperators();
    return this.#operators.allowed;
  }

  /** @returns {{ ATT: Operator[], DEF: Operator[] }} The operators banned from the strat. */
  get bannedOperators() {
    // Fetch operators on first call
    if (!this.#operators) this.#getOperators();
    return this.#operators.banned;
  }

  /** Builds the `required`, `allowed` and `banned` operator lists. */
  #getOperators() {
    this.#operators = {
      required: { [Side.ATT.key]: [], [Side.DEF.key]: [] },
      allowed: { [Side.ATT.key]: [], [Side.DEF.key]: [] },
      banned: { [Side.ATT.key]: [], [Side.DEF.key]: [] }
    };

    const requiredOperators = [];
    const allowedOperators = [];
    const bannedOperators = [];
    const filteredOperators = [];

    // Map operator keys
    this.#operatorKeys.forEach((key) => {
      if (key.startsWith('*')) requiredOperators.push(key.slice(1));
      else if (key.startsWith('!')) bannedOperators.push(key.slice(1));
      else allowedOperators.push(key);
    });

    // Run operator filters
    if (this.#operatorFilters.length) {
      filteredOperators.push(...findItems(Operator.LIST, this.#operatorFilters));
    }

    // Build operator lists
    Operator.LIST.forEach((operator) => {
      // Find required operators
      if (this.#operatorKeys.includes(`*${operator.key}`)) {
        this.#operators.required[operator.side.key].push(operator);
        return;
      }

      // Find explicitly banned operators
      if (bannedOperators.length) {
        if (bannedOperators.includes(operator.key)) this.#operators.banned[operator.side.key].push(operator);
        else this.#operators.allowed[operator.side.key].push(operator);
        return;
      }

      // Find explicitly allowed operators
      if (allowedOperators.length) {
        if (allowedOperators.includes(operator.key)) this.#operators.allowed[operator.side.key].push(operator);
        else this.#operators.banned[operator.side.key].push(operator);
        return;
      }

      // Find filtered operators
      if (this.#operatorFilters.length) {
        if (filteredOperators.includes(operator)) this.#operators.allowed[operator.side.key].push(operator);
        else this.#operators.banned[operator.side.key].push(operator);
        return;
      }

      // Operator is implicitly allowed
      this.#operators.allowed[operator.side.key].push(operator);
    });
  }

  /** @returns {Strat[]} A list of all strats. */
  static get LIST() { return Object.values(Strat); }

  // Register Strats
  static {
    RAW_STRATS.forEach((stratData, index) => {
      Strat[index] = new Strat(index, stratData);
    });
  }
}

console.debug(Strat.LIST);
