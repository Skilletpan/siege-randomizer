import SQUADS from '@/data/squads.json';

import Operator from './Operator';

export default class Squad {
  static {
    // Build squad instances from raw data
    Object.entries(SQUADS).forEach(([id, squad]) => {
      // Ignore disabled squads
      if (squad.disabled) return;

      // Create squad instance
      this[id] = new Squad({
        id,
        name: squad.name
      });
    });

    // Freeze squad object
    Object.freeze(Squad);

    console.debug(
      'Squads imported:',
      Squad.LIST
    );
  }

  // Instance properties
  #id;
  #name;

  /**
   * Creates a new Squad instance.
   * 
   * @param {Object} squad      The raw squad data.
   * @param {String} squad.id   The id of the squad.
   * @param {String} squad.name The name of the squad.
   */
  constructor(squad) {
    this.#id = squad.id;
    this.#name = squad.name;
  }

  /** @returns {String} The ID of the squad. */
  get id() { return this.#id; }

  /** @returns {String} The name of the squad. */
  get name() { return this.#name; }

  /** @returns {Operator[]} The members of the squad. */
  get members() { return Operator.getOperators({ squad: this }); }

  /** @returns {String} The emblem of the squad. */
  get emblem() { return require(`@/assets/squads/${this.#id}.png`); }

  /** @returns {Squad[]} A list of all squads. */
  static get LIST() { return Object.values(this); }
}
