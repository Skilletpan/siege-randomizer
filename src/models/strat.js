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
  #bannedOperators;
  #requiredOperators;

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
    // Map required operators on first call
    if (!this.#requiredOperators) {
      this.#requiredOperators = {};

      this.#operatorKeys.forEach((operatorKey) => {
        // Skip irrelevant operators
        if (!operatorKey.startsWith('*')) return;

        // Fetch operator
        const operator = Operator[operatorKey.slice(1)];

        // Add operator to list
        if (!this.#requiredOperators[operator.side.key]) this.#requiredOperators[operator.side.key] = [];
        this.#requiredOperators[operator.side.key].push(operator);
      });
    }

    return this.#requiredOperators;
  }

  /** @returns {Operator[]} The operators banned from the strat. */
  get bannedOperators() {
    // Map banned operators on first call
    if (!this.#bannedOperators) {
      this.#bannedOperators = {};

      this.#operatorKeys.forEach((operatorKey) => {
        // Skip irrelevant operators
        if (!operatorKey.startsWith('!')) return;

        // Fetch operator
        const operator = Operator[operatorKey.slice(1)];

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
