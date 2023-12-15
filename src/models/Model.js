export class Model extends Object {
  static get LIST() { throw new Error('This function was not implemented!'); }

  /**
   * Picks a random item from the model item list or a custom pool.
   * 
   * @param {any[]} [customPool]   The pool to pick an item from.
   * @param {any}   [previousPick] The previously picked item to exclude.
   * 
   * @returns {any} The item that was picked from the pool.
   */
  static pickRandom(customPool = null, previousPick = null) {
    let pool = customPool || this.LIST;

    if (previousPick) pool = pool.filter((i) => i !== previousPick);

    return pool[Math.floor(Math.random() * pool.length)];
  }
}

export class ListModel extends Model {
  // Static properties
  static _list;

  /**
   * Finds a model item by ID.
   * 
   * @param {number} id The ID of the model item to find.
   * 
   * @returns {ListModel} The model item from the list.
   */
  static get(id) { return this._list.find((i) => i.id === id); }

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
  static _map;

  /**
   * Checks whether the provided item is a key and returns the corresponding item.
   * 
   * @param {MapModel | string} item The item to check.
   * 
   * @returns {MapModel} The model item that corresponds to the provided item.
   */
  static valueOf(item) {
    // Try to parse string
    if (typeof item === 'string') {
      if (this._map.has(item)) return this._map.get(item);
    }

    // Try to parse model instance
    else if (item instanceof MapModel) {
      if (Array.from(this._map.values()).includes(item)) return item;
    }

    // Throw if item could not be parsed
    throw new Error(`The item ${item} could not be parsed to a model instance!`);
  }

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
