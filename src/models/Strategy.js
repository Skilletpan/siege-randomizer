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

export default class Strategy {
  static {
    const rawStrategies = require('@/data/strats.json');

    // Build strategy instances from raw data
    rawStrategies.forEach((strat, index) => {
      // Ignore disabled strategies
      if (strat.disabled) return;

      // Create strategy instance
      this[index] = new Strategy({
        id: index,
        title: strat.title,
        tagline: strat.tagline,
        rules: strat.rules,
        side: strat.side,
        tags: strat.tags,
        requiredOperators: strat.requiredOperators || [],
        allowedOperators: strat.allowedOperators || [],
        disallowedOperators: strat.disallowedOperators || []
      });
    });

    // Freeze strategy object
    Object.freeze(this);

    console.debug(
      'Strategies imported:',
      this.LIST
    );
  }

  // Instance properties
  #id;
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
   * @param {Object}               strategy                     The raw strategy data.
   * @param {number}               strategy.id                  The ID of the strategy.
   * @param {string}               strategy.title               The title of the strategy.
   * @param {string}               strategy.tagline             The tagline of the strategy.
   * @param {Array<Object|string>} strategy.rules               The rules of the strategy.
   * @param {?string}              strategy.side                The side key of the strategy.
   * @param {Array<string>}        strategy.tags                The IDs of the tags of the strategy.
   * @param {Array<string>}        strategy.requiredOperators   The IDs of the operators required by the strategy.
   * @param {Array<string>|Object} strategy.allowedOperators    The IDs of the operators allowed by the strategy.
   * @param {Array<string>|Object} strategy.disallowedOperators The IDs of the operators disallowed by the strategy.
   */
  constructor(strategy) {
    this.#id = strategy.id;
    this.#title = strategy.title;
    this.#tagline = strategy.tagline;
    this.#side = strategy.side || Side.ALL.key;

    this.#rules.push(...strategy.rules.map((r) => new Rule(r)));
    this.#tags.push(...strategy.tags);

    this.#requiredOperators.push(...strategy.requiredOperators);

    if (Array.isArray(strategy.allowedOperators)) this.#allowedOperators.push(...strategy.allowedOperators);
    else this.#allowedOperatorsFilter = strategy.allowedOperators;

    if (Array.isArray(strategy.disallowedOperators)) this.#disallowedOperators.push(...strategy.disallowedOperators);
    else this.#disallowedOperatorsFilter = strategy.disallowedOperators;
  }

  /** @returns {number} The ID of the strategy. */
  get id() { return this.#id; }

  /** @returns {string} The title of the strategy. */
  get title() { return this.#title; }

  /** @returns {string} The tagline of the strategy. */
  get tagline() { return this.#tagline; }

  /** @returns {Side} The side of the strategy. */
  get side() { return Side[this.#side]; }

  /** @returns {Array<Operator>} The operators required by this strategy. */
  get requiredOperators() { return this.#requiredOperators.map((o) => Operator[o]); }

  /** @returns {Array<StrategyTag>} The tags of the strategy. */
  get tags() { return this.#tags.map((tag) => StrategyTag[tag]); }

  /** @returns {Array<Strategy>} A list of all strategies. */
  static get LIST() { return Object.values(this).sort((s1, s2) => s1.title.localeCompare(s2.title)); }

  /**
   * Gets the rules of the strategy for the given side.
   * 
   * @param {Side|string} side The side or side key to get the rules for.
   * 
   * @returns {Array<Rule>} The rules for this side of the strategy.
   */
  getRules(side) { return this.#rules.filter((r) => r.side.includes(side)); }

  /**
   * Gets the required operators of the strategy for the given side.
   * 
   * @param {Side|string} side The side or side key to get the required operators for.
   * 
   * @returns {Array<Operator>} The required operators for this side of the strategy.
   */
  getRequiredOperators(side) {
    return this.#requiredOperators.map((o) => Operator[o]).filter((o) => o.side.includes(side));
  }

  /**
   * Gets the allowed operators of the strategy for the given side.
   * 
   * @param {Side|string} side The side or side key to get the allowed operators for.
   * 
   * @returns {Array<Operator>} The allowed operators for this side of the strategy.
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
   * @returns {Array<Operator>} The disallowed operators for this side of the strategy.
   */
  getDisallowedOperators(side) {
    if (this.#disallowedOperatorsFilter) return Operator.getOperators({ ...this.#disallowedOperatorsFilter, side });
    return this.#disallowedOperators.map((o) => Operator[o]).filter((o) => o.side.includes(side));
  }
}
