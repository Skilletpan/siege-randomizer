export class Model extends Object {
  static get LIST() { throw new Error('This function was not implemented!'); }

  /**
   * Picks a random item from the model item list or a custom pool.
   * 
   * @param {any[]} [customPool] The pool to pick an item from.
   * 
   * @returns {any} The item that was picked from the pool.
   */
  static pickRandom(customPool = null) {
    const pool = customPool || this.LIST;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

export class ListModel extends Model {
  // Static properties
  /** @type {ListModel[]} */
  static _list;

  /** @returns {ListModel[]} The list of model items. */
  static get LIST() { return Array.from(this._list); }

  // Instance properties
  /** @type {number} */
  #id;

  /**
   * Creates a new instance of the model.
   * 
   * @param {number}           id       The ID of the model item.
   * @param {typeof ListModel} subclass The subclass of the model item.
   */
  constructor(id, subclass) {
    super();

    // Set instance properties
    this.#id = id;

    // Add model item to list
    if (!subclass._list) subclass._list = [];
    subclass._list.push(this);
  }

  /** @returns {number} The ID of the model item. */
  get id() { return this.#id; }

  // Override Object functions
  valueOf() { return this.#id; }
}

export class MapModel extends Model {
  // Static properties
  /** @type {Map<string, MapModel>} */
  static _map;

  /** @returns {string[]} The keys of the model items. */
  static get KEYS() { return Array.from(this._map.keys()); }

  /** @returns {MapModel[]} The list of model items. */
  static get LIST() { return Array.from(this._map.values()); }

  // Instance properties
  /** @type {string} */
  #key;

  /**
   * Creates a new instance of the model.
   * 
   * @param {string}          key      The key of the model item.
   * @param {typeof MapModel} subclass The subclass of the model item.
   */
  constructor(key, subclass) {
    super();

    // Set instance properties
    this.#key = key;

    // Add model item to map
    if (!subclass._map) subclass._map = new Map();
    subclass._map.set(key, this);

    // Add getter for the model item
    Object.defineProperty(
      subclass,
      key,
      { get() { return subclass._map.get(key); } }
    );
  }

  /** @returns {string} The key of the model item. */
  get key() { return this.#key; }

  // Override Object functions
  valueOf() { return this.#key; }
}
