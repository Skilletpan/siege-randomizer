import RAW_OPERATORS from '@/data/operators_v2';
import loadImage from "@/utils/loadImage";

import OperatorRole from './operatorRole';
import Side from './side';
import Squad from './squad';

export default class Operator {
  // Instance properties
  #key;
  #name;
  #sideKey;
  #roleKeys;
  #speed;
  #squadKey;

  #emblem;
  #portrait;
  #easterEggs;

  /**
   * @param {string}   key                  The key of the operator.
   * @param {string}   side                 The key of the side of the operator.
   * @param {Object}   operatorData         The raw operator data.
   * @param {string}   operatorData.name    The name of the operator.
   * @param {string[]} operatorData.roles   The keys of the roles of the operator.
   * @param {number}   operatorData.speed   The speed of the operator.
   * @param {string}   [operatorData.squad] The key of the squad of the operator.
   */
  constructor(key, side, operatorData) {
    this.#key = key;
    this.#name = operatorData.name;
    this.#sideKey = side;
    this.#roleKeys = Array.from(operatorData.roles);
    this.#speed = operatorData.speed;
    this.#squadKey = operatorData.squad;

    // Load images
    const imageKey = key.replace(/_(ATT|DEF)/, '');
    this.#emblem = loadImage('emblems', `${imageKey}.png`);
    this.#portrait = loadImage('portraits', `${imageKey}.png`);
    this.#easterEggs = [];

    // Find all easter egg portraits
    for (let counter = 1; ; counter++) {
      const url = loadImage('portraits', `${imageKey}_${counter}.png`);

      if (url) this.#easterEggs.push(url);
      else break;
    }
  }

  /** @returns {string} The key of the operator. */
  get key() { return this.#key; }

  /** @returns {string} The name of the operator. */
  get name() { return this.#name; }

  /** @returns {string} The side of the operator. */
  get side() { return Side[this.#sideKey]; }

  /** @returns {OperatorRole[]} The roles of the operator. */
  get roles() { return this.#roleKeys.map((key) => OperatorRole[key]); }

  /** @returns {number} The speed of the operator. */
  get speed() { return this.#speed; }

  /** @returns {Squad} The squad of the operator. */
  get squad() { return Squad[this.#squadKey]; }

  /** @returns {number} The health of the operator. */
  get health() { return 4 - this.#speed; }

  /** @returns {string} The URL of the emblem of the operator. */
  get emblem() { return this.#emblem; }

  /** @returns {string} The URL of the portrait of the operator. */
  get portrait() { return this.#portrait; }

  /**
   * Has a 1 in 50 chance to return the URL of an easter egg portrait (if the operator has any).
   * 
   * @returns {string} The URL of a randomly picked portrait of the operator.
   */
  easterEggPortrait() {
    // Return easter egg portrait 1 in 50 times
    if (this.#easterEggs.length > 0 && Math.floor(Math.random() * 50) > 0) {
      return this.#easterEggs[Math.floor(Math.random() * this.#easterEggs.length)];
    }

    // Return default portrait
    return this.#portrait;
  }

  /** @returns {Operator[]} A list of all operators. */
  static get LIST() { return Object.values(Operator); }

  /** @returns {Operator} A randomly picked operator. */
  static random() { return Operator.LIST[Math.floor(Math.random() * Operator.LIST.length)]; }

  // Register Operators
  static {
    Object.entries(RAW_OPERATORS).forEach(([side, operators]) => {
      Object.entries(operators).forEach(([key, operatorData]) => {
        this[key] = new Operator(key, side, operatorData);
      });
    });
  }
}

console.debug(Operator.LIST);
