import { ListModel } from './Model';
import Operator from './Operator';
import Side from './Side';
import StrategyTag from './StragegyTag';

class Rule {
  #text;
  #operator;
  #side;

  /**
   * Creates a new Rule instance.
   *
   * @param {Object|string} rule          The raw rule data.
   * @param {string}        rule.text     The text of the rule.
   * @param {?string}       rule.operator The key of the operator the rule applies to.
   * @param {?string}       rule.side     The key of the sidee the rule applies to.
   */
  constructor(rule) {
    this.#text = rule.text || rule;
    this.#operator = rule.operator || null;
    this.#side = rule.side || null;
  }

  /** @returns {string} The text of the rule. */
  get text() { return this.#text; }

  /** @returns {?Operator} The operator the rule applies to. */
  get operator() { return Operator[this.#operator] || null; }

  /** @returns {Side} The side the rule applies to. */
  get side() {
    if (this.#operator) return this.operator.side;
    if (this.#side) return Side[this.#side];
    return Side.ALL;
  }
}

export default class Strategy extends ListModel {
  // Static properties
  static {
    const rawStrategies = require('@/data/strats.json');

    // Build strategy instances from raw data
    rawStrategies.forEach((strat, index) => {
      // Ignore disabled strategies
      if (strat.disabled) return;

      // Create strategy instance
      new Strategy({ id: index, ...strat });
    });

    console.debug('Strategies imported:', Strategy.LIST);
  }

  /** @returns {Strategy[]} A list of all strategies. */
  static get LIST() { return super.LIST; }

  // Instance properties
  #title;
  #tagline;
  #rules = [];
  #side;
  #tags = [];

  #operatorFilter;
  #requiredOperators = [];
  #allowedOperators = [];
  #disallowedOperators = [];

  /**
   * Creates a new Strategy instance.
   * 
   * @param {Object}            rawStrategy                     The raw strategy data.
   * @param {number}            rawStrategy.id                  The ID of the strategy.
   * @param {string}            rawStrategy.title               The title of the strategy.
   * @param {string}            rawStrategy.tagline             The tagline of the strategy.
   * @param {(Object|string)[]} rawStrategy.rules               The rules of the strategy.
   * @param {?string}           rawStrategy.side                The side key of the strategy.
   * @param {string[]}          rawStrategy.tags                The IDs of the tags of the strategy.
   * @param {?string[]}         rawStrategy.requiredOperators   The IDs of the operators required by the strategy.
   * @param {?Object}           rawStrategy.operatorFilter      The operator filter object to filter operators by.
   * @param {?string[]}         rawStrategy.allowedOperators    The IDs of the operators allowed by the strategy.
   * @param {?string[]}         rawStrategy.disallowedOperators The IDs of the operators disallowed by the strategy.
   */
  constructor(rawStrategy) {
    super(rawStrategy.id, Strategy);

    // Set instance properties
    this.#title = rawStrategy.title;
    this.#tagline = rawStrategy.tagline;
    this.#side = rawStrategy.side || Side.ALL.key;

    this.#rules.push(...rawStrategy.rules.map((r) => new Rule(r)));
    this.#tags.push(...rawStrategy.tags);

    this.#operatorFilter = rawStrategy.operatorFilter;
    this.#requiredOperators.push(...(rawStrategy.requiredOperators || []));
    this.#allowedOperators.push(...(rawStrategy.allowedOperators || []));
    this.#disallowedOperators.push(...(rawStrategy.disallowedOperators || []));
  }

  /** @returns {string} The title of the strategy. */
  get title() { return this.#title; }

  /** @returns {string} The tagline of the strategy. */
  get tagline() { return this.#tagline; }

  /** @returns {Side} The side of the strategy. */
  get side() { return Side.valueOf(this.#side); }

  /** @returns {StrategyTag[]} The tags of the strategy. */
  get tags() { return StrategyTag.LIST.filter((tag) => this.#tags.includes(tag.key)); }

  /** @returns {{ [sideKey: string]: Rule[] }} The rules of the strategy, split by side. */
  get rules() {
    const rules = {};
    this.side.included.forEach((s) => rules[s.key] = this.#rules.filter((r) => r.side.includes(s)));
    return rules;
  }

  /** @returns {{ [sideKey: string]: Operator[] }} The required operators of the strategy, split by side. */
  get requiredOperators() {
    const requiredOperators = {};
    this.side.included.forEach(
      (s) => requiredOperators[s.key] = Operator.LIST.filter(
        (o) => this.#requiredOperators.includes(o.key) && o.side === s
      )
    );
    return requiredOperators;
  }

  /** @returns {{ [sideKey: string]: Operator[] }} The allowed operators of the strategy, split by side. */
  get allowedOperators() {
    const allowedOperators = {};

    const operators = [...this.#allowedOperators];
    if (this.#operatorFilter) operators.push(...Operator.getOperators(this.#operatorFilter).map((o) => o.key));

    this.side.included.forEach(
      (s) => allowedOperators[s.key] = Operator.LIST.filter(
        (o) => {
          if (!operators.includes(o.key)) return false;
          if (this.#requiredOperators.includes(o.key)) return false;
          if (this.#disallowedOperators.includes(o.key)) return false;
          if (o.side !== s) return false;
          return true;
        }
      )
    );

    return allowedOperators;
  }

  /** @returns {{ [sideKey: string]: Operator[] }} The disallowed operators of the strategy, split by side. */
  get disallowedOperators() {
    const disallowedOperators = {};
    this.side.included.forEach(
      (s) => disallowedOperators[s.key] = Operator.LIST.filter(
        (o) => this.#disallowedOperators.includes(o.key) && o.side === s
      )
    );
    return disallowedOperators;
  }
}
