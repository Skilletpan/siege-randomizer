import TAGS from '@/data/tags.json';

import Strategy from './Strategy';

export default class StrategyTag {
  #id;
  #name;

  static {
    // Build strategy tag instances from raw data
    Object.entries(TAGS).forEach(([id, tag]) => {
      // Ignore disabled roles
      if (tag.disabled) return;

      // Create role instance
      this[id] = new StrategyTag({
        id,
        name: tag.name
      });
    });

    // Freeze strategy tag object
    Object.freeze(StrategyTag);

    console.debug(
      'Strategy Tags imported:',
      StrategyTag.LIST
    );
  }

  /**
   * Creates a new Strategy Tag instance.
   * 
   * @param {Object} tag      The raw tag data.
   * @param {String} tag.id   The ID of the tag.
   * @param {String} tag.name The name of the tag.
   */
  constructor(tag) {
    this.#id = tag.id;
    this.#name = tag.name;
  }

  /** @returns {String} The ID of the tag. */
  get id() { return this.#id; }

  /** @returns {String} The name of the tag. */
  get name() { return this.#name; }

  /** @returns {Strategy[]} The strategies with this tag. */
  get strategies() { return Strategy.LIST.filter((strategy) => strategy.tags.includes(this)); }

  /** @returns {StragegyTag[]} A list of all tags. */
  static get LIST() { return Object.values(this); }
}
