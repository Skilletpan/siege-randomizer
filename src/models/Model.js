/** @type {{ [x: string]: typeof Model[] }} */
const store = {};

export class Model extends Object {
  static _className = 'model';

  // Instance properties
  #id;
  #name;

  /**
   * Creates a new Model Item instance.
   * 
   * @param {Object} param0      The raw item data.
   * @param {number} param0.id   The ID of the item.
   * @param {string} param0.name The name of the item.
   */
  constructor({ id, name }, className) {
    super();

    // Set instance properties
    this.#id = id;
    this.#name = name;

    // Add item to list
    if (!store[className]) store[className] = [];
    if (!store[className].includes(this)) store[className].push(this);
  }

  /** @returns {number} The ID of the item. */
  get id() { return this.#id; }

  /** @returns {string} The name of the item. */
  get name() { return this.#name; }

  /** @returns {typeof Model[]} A list of all items. */
  static get LIST() { return store[this._className]; }

  /**
   * Picks a random item from the model item list or a provided pool.
   * 
   * @param {Model[]} [customPool] A pool of items to pick from.
   * 
   * @returns {Model} The randomly picked item.
   */
  static pickRandom(customPool = null) {
    const pool = customPool || this.LIST;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Override basic object functions
  toString() { return `[${this.#id}] ${this.#name}`; }
  valueOf() { return this.#id; }
}

export class MappedModel extends Model {
  // Instance properties
  #key;

  /**
   * Creates a new Model Item instance.
   * 
   * @param {Object} param0      The raw item data.
   * @param {number} param0.id   The ID of the item.
   * @param {string} param0.key  The key of the item.
   * @param {string} param0.name The name of the item.
   * @param {string} className   The name of the class in the store.
   */
  constructor({ id, key, name }, className) {
    super({ id, name }, className);

    // Set instance properties
    this.#key = key;

    // MappedModel._addGetter(key);
  }

  /** @returns {string} The key of the item. */
  get key() { return this.#key; }

  /**
   * Adds a getter for an item.
   * 
   * @param {typeof MappedModel} target The subclass to add the getter on.
   * @param {string}             key    The key of the item.
   */
  static _addGetter(target, key) {
    Object.defineProperty(
      target,
      key,
      { get() { return store[this._className].find((i) => i.key === key); } }
    );
  }
}
