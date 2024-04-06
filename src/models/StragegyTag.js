import { MapModel } from './Model';
import Strategy from './Strategy';

export default class StrategyTag extends MapModel {
  // Static properties
  static {
    const rawStrategyTags = require('@/data/tags.json');

    // Build strategy tag instances from raw data
    Object.entries(rawStrategyTags).forEach(([key, tag]) => new StrategyTag({ key, ...tag }));

    console.debug('Strategy Tags imported:', StrategyTag.LIST);
  }

  /** @returns {StrategyTag[]} A list of all strategy tags. */
  static get LIST() { return super.LIST; }

  /**
   * Parses an input to a Strategy Tag instance.
   * 
   * @param {StrategyTag | string} tag The input to parse.
   * 
   * @returns {StrategyTag} The strategy tag derived from the input.
   */
  static valueOf(tag) { return super.valueOf(tag); }

  // Instance properties
  #name;
  #description;
  #strategies;

  /**
   * Creates a new Strategy Tag instance.
   * 
   * @param {Object} rawTag             The raw tag data.
   * @param {string} rawTag.key         The key of the tag.
   * @param {string} rawTag.name        The name of the tag.
   * @param {string} rawTag.description The description of the tag.
   */
  constructor(rawTag) {
    super(rawTag.key, StrategyTag);

    // Set instance properties
    this.#name = rawTag.name;
    this.#description = rawTag.description;
  }

  /** @returns {string} The name of the strategy tag. */
  get name() { return this.#name; }

  /** @returns {string} The description of the strategy tag. */
  get description() { return this.#description; }

  /** @returns {Strategy[]} The strategies with this tag. */
  get strategies() {
    // Stores strategies on first call
    if (!this.#strategies) this.#strategies = Strategy.LIST.filter((strategy) => strategy.tags.includes(this));
    return this.#strategies;
  }
}
