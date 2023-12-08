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

  // Instance properties
  #title;
  #tagline;
  #rules = [];
  #side;
  #tags = [];

  #requiredOperators = [];

  #allowedOperators = [];
  #allowedOperatorsFilter;

  #disallowedOperators = [];
  #disallowedOperatorsFilter;

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
   * @param {?string[]|Object}  rawStrategy.allowedOperators    The IDs of the operators allowed by the strategy.
   * @param {?string[]|Object}  rawStrategy.disallowedOperators The IDs of the operators disallowed by the strategy.
   */
  constructor(rawStrategy) {
    super(rawStrategy, Strategy);

    // Set instance properties
    this.#title = rawStrategy.title;
    this.#tagline = rawStrategy.tagline;
    this.#side = rawStrategy.side || Side.ALL.key;

    this.#rules.push(...rawStrategy.rules.map((r) => new Rule(r)));
    this.#tags.push(...rawStrategy.tags);

    this.#requiredOperators.push(...(rawStrategy.requiredOperators) || []);

    if (Array.isArray(rawStrategy.allowedOperators)) this.#allowedOperators.push(...rawStrategy.allowedOperators);
    else this.#allowedOperatorsFilter = rawStrategy.allowedOperators;

    if (Array.isArray(rawStrategy.disallowedOperators)) this.#disallowedOperators.push(...rawStrategy.disallowedOperators);
    else this.#disallowedOperatorsFilter = rawStrategy.disallowedOperators;
  }

  /** @returns {string} The title of the strategy. */
  get title() { return this.#title; }

  /** @returns {string} The tagline of the strategy. */
  get tagline() { return this.#tagline; }

  /** @returns {Side} The side of the strategy. */
  get side() { return Side.valueOf(this.#side); }

  /** @returns {Operator[]} The operators required by this strategy. */
  get requiredOperators() { return this.#requiredOperators.map((o) => Operator[o]); }

  /** @returns {StrategyTag[]} The tags of the strategy. */
  get tags() { return this.#tags.map((tag) => StrategyTag[tag]); }

  /**
   * Gets the rules of the strategy for the given side.
   * 
   * @param {Side|string} side The side or side key to get the rules for.
   * 
   * @returns {Rule[]} The rules for this side of the strategy.
   */
  getRules(side) { return this.#rules.filter((r) => r.side.includes(side)); }

  /**
   * Gets the required operators of the strategy for the given side.
   * 
   * @param {Side|string} side The side or side key to get the required operators for.
   * 
   * @returns {Operator[]} The required operators for this side of the strategy.
   */
  getRequiredOperators(side) {
    return this.#requiredOperators.map((o) => Operator[o]).filter((o) => o.side.includes(side));
  }

  /**
   * Gets the allowed operators of the strategy for the given side.
   * 
   * @param {Side|string} side The side or side key to get the allowed operators for.
   * 
   * @returns {Operator[]} The allowed operators for this side of the strategy.
   */
  getAllowedOperators(side) {
    if (this.#allowedOperatorsFilter) {
      return Operator
        .getOperators({ ...this.#allowedOperatorsFilter, side })
        .filter((o) => !this.requiredOperators.includes(o) && !this.#disallowedOperators.includes(o.key));
    }
    return this.#allowedOperators.map((o) => Operator[o]).filter((o) => o.side.includes(side));
  }

  /**
   * Gets the disallowed operators of the strategy for the given side.
   * 
   * @param {Side|string} side The side or side key to get the disallowed operators for.
   * 
   * @returns {Operator[]} The disallowed operators for this side of the strategy.
   */
  getDisallowedOperators(side) {
    if (this.#disallowedOperatorsFilter) return Operator.getOperators({ ...this.#disallowedOperatorsFilter, side });
    return this.#disallowedOperators.map((o) => Operator[o]).filter((o) => o.side.includes(side));
  }
}
