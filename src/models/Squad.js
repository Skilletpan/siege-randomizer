import { MapModel } from './Model';
import Operator from './Operator';

export default class Squad extends MapModel {
  static {
    const rawSquads = require('@/data/squads.json');

    // Build squad instances from raw data
    Object.entries(rawSquads).forEach(([key, squad]) => {
      // Create squad instance
      new Squad({ key, name: squad });
    });

    console.debug('Squads imported:', Squad.LIST);
  }

  // Instance properties
  #name;
  #emblem;

  /**
   * Creates a new Squad instance.
   * 
   * @param {Object} rawSquad      The raw squad data.
   * @param {string} rawSquad.key  The key of the squad.
   * @param {string} rawSquad.name The name of the squad.
   */
  constructor(rawSquad) {
    super(rawSquad.key, Squad);

    // Set instance properties
    this.#name = rawSquad.name;
  }

  /** @returns {string} The name of the squad. */
  get name() { return this.#name; }

  /** @returns {Operator[]} The members of the squad. */
  get members() { return Operator.getOperators({ squad: this }); }

  /** @returns {string} The emblem of the squad. */
  get emblem() {
    // Loads the emblem on first call
    if (!this.#emblem) this.#emblem = require(`@/assets/squads/${this.key}.png`);

    return this.#emblem;
  }
}
