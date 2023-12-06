import Operator from './Operator';

export default class Squad {
  static {
    const rawSquads = require('@/data/squads.json');

    // Build squad instances from raw data
    Object.entries(rawSquads).forEach(([id, squad]) => {
      // Create squad instance
      this[id] = new Squad({
        id,
        name: squad
      });
    });

    // Freeze squad object
    Object.freeze(this);

    console.debug(
      'Squads imported:',
      this.LIST
    );
  }

  // Instance properties
  #id;
  #name;

  #emblem;

  /**
   * Creates a new Squad instance.
   * 
   * @param {Object} squad      The raw squad data.
   * @param {string} squad.id   The id of the squad.
   * @param {string} squad.name The name of the squad.
   */
  constructor(squad) {
    this.#id = squad.id;
    this.#name = squad.name;

    this.#emblem = require(`@/assets/squads/${squad.id}.png`)
  }

  /** @returns {string} The ID of the squad. */
  get id() { return this.#id; }

  /** @returns {string} The name of the squad. */
  get name() { return this.#name; }

  /** @returns {Array<Operator>} The members of the squad. */
  get members() { return Operator.getOperators({ squad: this }); }

  /** @returns {string} The emblem of the squad. */
  get emblem() { return this.#emblem; }

  /** @returns {Array<Squad>} A list of all squads. */
  static get LIST() { return Object.values(this); }
}
