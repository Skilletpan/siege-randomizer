import { MapModel } from './Model';
import Strategy from './Strategy';

export default class StrategyTag extends MapModel {
  static {
    const rawStrategyTags = require('@/data/tags.json');

    // Build strategy tag instances from raw data
    Object.entries(rawStrategyTags).forEach(([key, tag]) => {
      // Create strategy tag instance
      new StrategyTag({ key, name: tag });
    });

    console.debug('Strategy Tags imported:', StrategyTag.LIST);
  }

  // Instance properties
  #name;

  /**
   * Creates a new Strategy Tag instance.
   * 
   * @param {Object} rawTag      The raw tag data.
   * @param {string} rawTag.key  The key of the tag.
   * @param {string} rawTag.name The name of the tag.
   */
  constructor(rawTag) {
    super(rawTag.key, StrategyTag);

    // Set instance properties
    this.#name = rawTag.name;
  }

  /** @returns {string} The name of thee strategy tag. */
  get name() { return this.#name; }

  /** @returns {Strategy[]} The strategies with this tag. */
  get strategies() { return Strategy.LIST.filter((strategy) => strategy.tags.includes(this)); }
}
