import Strategy from './Strategy';

export default class StrategyTag {
  static {
    const rawStrategyTags = require('@/data/tags.json');

    // Build strategy tag instances from raw data
    Object.entries(rawStrategyTags).forEach(([id, tag]) => {
      // Create strategy tag instance
      this[id] = new StrategyTag({
        id,
        name: tag
      });
    });

    // Freeze strategy tag object
    Object.freeze(this);

    console.debug(
      'Strategy Tags imported:',
      this.LIST
    );
  }

  // Instance properties
  #id;
  #name;

  /**
   * Creates a new Strategy Tag instance.
   * 
   * @param {Object} tag      The raw tag data.
   * @param {string} tag.id   The ID of the tag.
   * @param {string} tag.name The name of the tag.
   */
  constructor(tag) {
    this.#id = tag.id;
    this.#name = tag.name;
  }

  /** @returns {string} The ID of the tag. */
  get id() { return this.#id; }

  /** @returns {string} The name of the tag. */
  get name() { return this.#name; }

  /** @returns {Array<Strategy>} The strategies with this tag. */
  get strategies() { return Strategy.LIST.filter((strategy) => strategy.tags.includes(this)); }

  /** @returns {Array<StrategyTag>} A list of all tags. */
  static get LIST() { return Object.values(this); }
}
