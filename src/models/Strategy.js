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
  #rules;
  #side;
  #tags;

  #operators;
  #allowedOperators;
  #disallowedOperators;
  #requiredOperators;

  /**
   * Creates a new Strategy instance.
   * 
   * @param {Object}            rawStrategy                        The raw strategy data.
   * @param {number}            rawStrategy.id                     The ID of the strategy.
   * @param {string}            rawStrategy.title                  The title of the strategy.
   * @param {string}            rawStrategy.tagline                The tagline of the strategy.
   * @param {(Object|string)[]} rawStrategy.rules                  The rules of the strategy.
   * @param {string}            [rawStrategy.side]                 The side key of the strategy.
   * @param {Object}            [rawStrategy.operators]            The operator settings of the strategy.
   * @param {string[]}          [rawStrategy.operators.allowed]    The IDs of the operators allowed by the strategy.
   * @param {string[]}          [rawStrategy.operators.disallowed] The IDs of the operators disallowed by the strategy.
   * @param {string[]}          [rawStrategy.operators.required]   The IDs of the operators required by the strategy.
   * @param {Object}            [rawStrategy.operators.filter]     The operator filter to filter operators by.
   * @param {string[]}          rawStrategy.tags                   The IDs of the tags of the strategy.
   */
  constructor(rawStrategy) {
    super(rawStrategy.id, Strategy);

    // Set instance properties
    this.#title = rawStrategy.title;
    this.#tagline = rawStrategy.tagline;
    this.#side = rawStrategy.side || Side.ALL.key;

    this.#rules = Array.from(rawStrategy.rules.map((r) => new Rule(r)));
    this.#operators = rawStrategy.operators || {};
    this.#tags = Array.from(rawStrategy.tags);
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

  /** @returns {{ [sideKey: string]: Operator[] }} The allowed operators of the strategy, split by side. */
  get allowedOperators() {
    // Run operator mapper on first call
    if (!this.#allowedOperators) this.#mapOperators();
    return this.#allowedOperators;
  }

  /** @returns {{ [sideKey: string]: Operator[] }} The disallowed operators of the strategy, split by side. */
  get disallowedOperators() {
    // Run operator mapper on first call
    if (!this.#disallowedOperators) this.#mapOperators();
    return this.#disallowedOperators;
  }

  /** @returns {{ [sideKey: string]: Operator[] }} The required operators of the strategy, split by side. */
  get requiredOperators() {
    // Run operator mapper on first call
    if (!this.#requiredOperators) this.#mapOperators();
    return this.#requiredOperators;
  }

  get filteredOperators() { return Operator.findOperators(this.#operators.filter); }

  /** Builds the allowed, disallowed and required operator lists. */
  #mapOperators() {
    const { allowed, disallowed, filter, required } = this.#operators;

    if (allowed && disallowed) console.warn(`${this.#title} uses allowed list and disallowed list at the same time!`);

    // Run operator filter if present
    const filteredOperators = filter ? Operator.findOperators(filter) : undefined;

    // Create empty collections
    const _allowed = { [Side.ATT.key]: [], [Side.DEF.key]: [] };
    const _disallowed = { [Side.ATT.key]: [], [Side.DEF.key]: [] };
    const _required = { [Side.ATT.key]: [], [Side.DEF.key]: [] };

    Operator.LIST.forEach((operator) => {
      // Skip operators of other side for strats for one side
      if (!this.side.includes(operator.side)) return;

      // Set explicitly required operators
      if (required && required.includes(operator.key)) {
        _required[operator.side.key].push(operator);
        return;
      }

      // Set explicitly allowed operators
      if (allowed && allowed.includes(operator.key)) {
        _allowed[operator.side.key].push(operator);
        return;
      }

      // Set explicitly disallowed operators
      if (disallowed && disallowed.includes(operator.key)) {
        _disallowed[operator.side.key].push(operator);
        return;
      }

      // Set operators by filter
      if (filter) {
        if (filteredOperators.includes(operator)) _allowed[operator.side.key].push(operator);
        else _disallowed[operator.side.key].push(operator);
        return;
      }

      if (allowed) _disallowed[operator.side.key].push(operator);
      else _allowed[operator.side.key].push(operator);
    });

    // Assign collections to instance properties
    this.#allowedOperators = _allowed;
    this.#disallowedOperators = _disallowed;
    this.#requiredOperators = _required;
  }
}
