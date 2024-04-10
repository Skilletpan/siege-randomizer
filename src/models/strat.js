import RAW_STRATS from '@/data/strats';

import Operator from './operator';
import Side from './side';

export default class Strat {
  // Instance properties
  #id;
  #title;
  #tagline;
  #rules;
  #sideKey;

  #operatorKeys;
  #operators;
  #requiredOperators;
  #allowedOperators;
  #bannedOperators;

  /**
   * @param {number}            id                    The ID of the strat.
   * @param {Object}            stratData             The raw strat data.
   * @param {string}            stratData.title       The title of the strat.
   * @param {string}            stratData.tagline     The tagline of the strat.
   * @param {(string|Object)[]} stratData.rules       The rules of the strat.
   * @param {string}            [stratData.side]      The key of the side of the strat.
   * @param {string[]}          [stratData.operators] The keys of the operators specified in the strat.
   */
  constructor(id, stratData) {
    this.#id = id;
    this.#title = stratData.title;
    this.#tagline = stratData.tagline;
    this.#rules = stratData.rules.map((rule) => typeof rule === 'string' ? { text: rule } : rule);
    this.#sideKey = stratData.side;
    this.#operatorKeys = Array.from(stratData.operators || []);
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

  /** @returns {Operator[]} The operators required by the strat. */
  get requiredOperators() {
    // Map operators on first call
    if (!this.#operators) this.#operators = Operator.findOperatorsByList(this.#operatorKeys);

    // Map required operators on first call
    if (!this.#requiredOperators) {
      this.#requiredOperators = {};
      if (!this.#operators.required) return this.#requiredOperators;

      this.#operators.required.forEach((operator) => {
        // Add operator to list
        if (!this.#requiredOperators[operator.side.key]) this.#requiredOperators[operator.side.key] = [];
        this.#requiredOperators[operator.side.key].push(operator);
      });
    }

    return this.#requiredOperators;
  }

  /** @returns {Operator[]} The operators allowed in the strat. */
  get allowedOperators() {
    // Map operators on first call
    if (!this.#operators) this.#operators = Operator.findOperatorsByList(this.#operatorKeys);

    // Map allowed operators on first call
    if (!this.#allowedOperators) {
      this.#allowedOperators = {};
      if (!this.#operators.allowed) return this.#allowedOperators;

      this.#operators.allowed.forEach((operator) => {
        // Add operator to list
        if (!this.#allowedOperators[operator.side.key]) this.#allowedOperators[operator.side.key] = [];
        this.#allowedOperators[operator.side.key].push(operator);
      });
    }

    return this.#allowedOperators;
  }

  /** @returns {Operator[]} The operators banned from the strat. */
  get bannedOperators() {
    // Map operators on first call
    if (!this.#operators) this.#operators = Operator.findOperatorsByList(this.#operatorKeys);

    // Map banned operators on first call
    if (!this.#bannedOperators) {
      this.#bannedOperators = {};
      if (!this.#operators.banned) return this.#bannedOperators;

      this.#operators.banned.forEach((operator) => {
        // Add operator to list
        if (!this.#bannedOperators[operator.side.key]) this.#bannedOperators[operator.side.key] = [];
        this.#bannedOperators[operator.side.key].push(operator);
      });
    }

    return this.#bannedOperators;
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
