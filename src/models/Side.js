export default class Side {
  static {
    const rawSides = require('@/data/sides.json');

    // Build side instances from raw data
    Object.entries(rawSides).forEach(([key, side]) => {
      // Create side instance
      this[key] = new Side({
        key,
        title: side.name,
        icon: side.icon,
        color: side.color
      });
    });

    // Freeze operator object
    Object.freeze(this);

    console.debug(
      'Sides imported:',
      this.LIST
    );
  }

  // Instance properties
  #key;
  #title;
  #icon;
  #color;

  /**
   * Creates new Side instance.
   * 
   * @param {Object}  side       The raw side data.
   * @param {string}  side.title The title of the side.
   * @param {string}  side.icon  The icon key of the side.
   * @param {?string} side.color The color key of the side.
   */
  constructor(side) {
    this.#key = side.key;
    this.#title = side.title;
    this.#icon = side.icon;
    this.#color = side.color;
  }

  /** @returns {string} The key of the side. */
  get key() { return this.#key; }

  /** @returns {string} The title of the side. */
  get title() { return this.#title; }

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

  /**
   * @param {Side|String} side The side or side key to check.
   * 
   * @returns {boolean}
   */
  includes(side) {
    const s = typeof side === 'string' ? Side[side] : side;
    return this === Side.ALL || s === Side.ALL || this === s;
  }

  /** @returns {Array<Side>} A list of all sides. */
  static get LIST() { return Object.values(this); }

  /** @returns {Array<Side>} The two sides. */
  static get SIDES() { return [Side.ATT, Side.DEF]; }
}
