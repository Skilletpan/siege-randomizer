import { MapModel } from './Model';

export default class Side extends MapModel {
  static {
    const rawSides = require('@/data/sides.json');

    // Build side instances from raw data
    Object.entries(rawSides).forEach(([key, side]) => {
      // Create side instance
      new Side({ key, ...side });
    });

    console.debug('Sides imported:', Side.LIST);
  }

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

  /** @returns {Side} The opposite side of this side. */
  get oppositeSide() {
    switch (this) {
      case Side.ATT:
        return Side.DEF;

      case Side.DEF:
        return Side.ATT;

      default:
        return Side.ALL;
    }
  }

  /** @returns {Side[]} The two sides. */
  static get SIDES() { return [Side.ATT, Side.DEF]; }

  /**
   * Parses an input to a side instance.
   * 
   * @param {Side|string} side The input to parse the side from.
   * 
   * @returns {Side} The side object parsed from the value.
   */
  static valueOf(side) {
    if (side instanceof Side) return side;
    if (Side[side.toUpperCase()]) return Side[side.toUpperCase()];

    throw new Error(`Value ${side} can't be parsed to Side instance!`);
  }

  /**
   * Checks whether a given side is included in this side.
   * 
   * @param {Side|String} side The side or side key to check.
   * 
   * @returns {boolean} Whether the side is included.
   */
  includes(side) {
    const s = Side.valueOf(side);

    if (this === Side.ALL) return true;
    return this === s;
  }
}
