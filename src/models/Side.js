import { MapModel } from './Model';

export default class Side extends MapModel {
  // Static properties
  static {
    const rawSides = require('@/data/sides.json');

    // Build side instances from raw data
    Object.entries(rawSides).forEach(([key, side]) => {
      // Create side instance
      new Side({ key, ...side });
    });

    console.debug('Sides imported:', Side.LIST);
  }

  /** @returns {Side[]} A list of all sides. */
  static get LIST() { return super.LIST; }

  /** @returns {Side[]} The two distinct sides. */
  static get SIDES() { return Side.ALL.included; }

  /**
   * Parses an input to a Side instance.
   * 
   * @param {Side | string} side The input to parse.
   * 
   * @returns {Side} The side derived from the input.
   */
  static valueOf(side) { return super.valueOf(side); }

  // Instance properties
  #name;
  #icon;
  #color;

  /**
   * Creates new Side instance.
   * 
   * @param {Object}  rawSide       The raw side data.
   * @param {string}  rawSide.key   The key of the side.
   * @param {string}  rawSide.name  The title of the side.
   * @param {string}  rawSide.icon  The icon key of the side.
   * @param {?string} rawSide.color The color key of the side.
   */
  constructor(rawSide) {
    super(rawSide.key, Side);

    // Set instance properties
    this.#name = rawSide.name;
    this.#icon = rawSide.icon;
    this.#color = rawSide.color;
  }

  /** @returns {string} The name of the side. */
  get name() { return this.#name; }

  /** @returns {string} The icon key of the side. */
  get icon() { return this.#icon; }

  /** @returns {string} The color key of the side. */
  get color() { return this.#color; }

  /** @returns {Side[]} The sides that are included in this sides. */
  get included() {
    const sides = [];
    if (this === Side.ATT || this === Side.ALL) sides.push(Side.ATT);
    if (this === Side.DEF || this === Side.ALL) sides.push(Side.DEF);
    return sides;
  }

  /** @returns {Side} The opposite side of this side. */
  get opposite() {
    if (this === Side.ATT) return Side.DEF;
    if (this === Side.DEF) return Side.ATT;
    return Side.ALL;
  }

  /**
   * Checks whether a given side is included in this side.
   * 
   * @param {Side | String} side The side or side key to check.
   * 
   * @returns {boolean} Whether the side is included.
   */
  includes(side) {
    const s = Side.valueOf(side);

    if (this === Side.ALL) return true;
    return this === s;
  }

  /**
   * Checks whether a given side overlaps with this side.
   * 
   * @param {Side | side} side The side or side key to check.
   * 
   * @returns {boolean} Whether the sides overlap.
   */
  overlaps(side) { return this.includes(side) || Side.valueOf(side).includes(this); }
}
