import SIDES from '@/data/sides.json';

export default class Side {
  static {
    // Build side instances from raw data
    Object.entries(SIDES).forEach(([key, side]) => {
      // Create side instance
      this[key] = new Side({
        key,
        title: side.name,
        icon: side.icon,
        color: side.color
      });
    });

    // Freeze operator object
    Object.freeze(Side);

    console.debug(
      'Sides imported:',
      Side.LIST
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
   * @param {String}  side.title The title of the side.
   * @param {String}  side.icon  The icon key of the side.
   * @param {?String} side.color The color key of the side.
   */
  constructor(side) {
    this.#key = side.key;
    this.#title = side.title;
    this.#icon = side.icon;
    this.#color = side.color;
  }

  /** @returns {String} The key of the side. */
  get key() { return this.#key; }

  /** @returns {String} The title of the side. */
  get title() { return this.#title; }

  /** @returns {String} The icon key of the side. */
  get icon() { return this.#icon; }

  /** @returns {String} The color key of the side. */
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
   * @returns {Boolean}
   */
  includes(side) {
    const s = typeof side === 'string' ? Side[side] : side;
    return this === Side.ALL || s === Side.ALL || this === s;
  }

  /** @returns {Side[]} A list of all sides. */
  static get LIST() { return Object.values(this); }

  /** @returns {Side[]} The two sides. */
  static get SIDES() { return [Side.ATT, Side.DEF]; }
}
