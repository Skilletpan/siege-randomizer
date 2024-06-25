import RAW_OPERATORS from '@/data/operators';
import loadImage from '@/utils/loadImage';

import Gadget from './gadget';
import OperatorRole from './operatorRole';
import Side from './side';
import Squad from './squad';
import WeaponClass from './weaponClass';

export default class Operator {
  // Instance properties
  #key;
  #name;
  #sideKey;
  #loadoutKeys;
  #roleKeys;
  #speed;
  #squadKey;

  #emblem;
  #portrait;
  #easterEggs;

  /**
   * @param {string}   key                            The key of the operator.
   * @param {string}   side                           The key of the side of the operator.
   * @param {Object}   operatorData                   The raw operator data.
   * @param {string}   operatorData.name              The name of the operator.
   * @param {Object}   operatorData.loadout           The keys of the loadout items of the operator.
   * @param {string[]} operatorData.loadout.primary   The keys of the primary weapon classes of the operator.
   * @param {string[]} operatorData.loadout.secondary The keys of the secondary weapon classes of the operator.
   * @param {string[]} operatorData.loadout.gadgets   The keys of the gadgets of the operator.
   * @param {string[]} operatorData.roles             The keys of the roles of the operator.
   * @param {number}   operatorData.speed             The speed of the operator.
   * @param {string}   [operatorData.squad]           The key of the squad of the operator.
   */
  constructor(key, side, operatorData) {
    this.#key = key;
    this.#name = operatorData.name;
    this.#sideKey = side;
    this.#loadoutKeys = operatorData.loadout;
    this.#roleKeys = Array.from(operatorData.roles);
    this.#speed = operatorData.speed;
    this.#squadKey = operatorData.squad;

    // Load images
    this.#emblem = loadImage('emblems', `${key}.png`);
    this.#portrait = loadImage('portraits', `${key}.png`);
  }

  /** @returns {string} The key of the operator. */
  get key() { return this.#key; }

  /** @returns {string} The name of the operator. */
  get name() { return this.#name; }

  /** @returns {Side} The side of the operator. */
  get side() { return Side[this.#sideKey]; }

  /** @returns {{ primary: WeaponClass[], secondary: WeaponClass[], gadgets: Gadget[] }} The loadout of the operator. */
  get loadout() {
    return {
      primary: this.#loadoutKeys.primary.map((key) => WeaponClass[key]),
      secondary: this.#loadoutKeys.secondary.map((key) => WeaponClass[key]),
      gadgets: this.#loadoutKeys.gadgets.map((key) => Gadget[key])
    };
  }

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
    // Look for easter egg portraits on first call
    if (!this.#easterEggs) {
      this.#easterEggs = [];

      // Find all easter egg portraits
      for (let counter = 1; ; counter++) {
        const url = loadImage('portraits', `${this.#key}_${counter}.png`);
  
        if (url) this.#easterEggs.push(url);
        else break;
      }
    }
  
    // Return easter egg portrait 1 in 50 times
    if (this.#easterEggs.length > 0 && Math.floor(Math.random() * 50) === 0) {
      return this.#easterEggs[Math.floor(Math.random() * this.#easterEggs.length)];
    }

    // Return default portrait
    return this.#portrait;
  }

  /** @returns {Operator[]} A list of all operators. */
  static get LIST() { return Object.values(Operator); }

  /**
   * Filter operators into `required`, `allowed` and `banned`.
   * 
   * Keys of required operators are prefixed with `*`.
   * Keys of banned operators are prefixed with `!`.
   * 
   * @param {string[]} operatorList The list of operator keys to build the lists from.
   * 
   * @returns {{ required?: Operator[], allowed: Operator[], banned: Operator[] }} The final operator lists.
   */
  static findOperatorsByList(operatorList) {
    // Split operator keys
    const required = [], allowed = [], banned = [];
    operatorList.forEach((operatorKey) => {
      if (operatorKey.startsWith('*')) required.push(operatorKey.slice(1));
      else if (operatorKey.startsWith('!')) banned.push(operatorKey.slice(1));
      else allowed.push(operatorKey);
    });

    // Catch mixed lists
    if (allowed.length && banned.length) throw new Error('Can\'t use allowed and banned operators in the same list!');

    // Filter operators
    const operators = { allowed: [], banned: [] };
    Operator.LIST.forEach((operator) => {
      // Check for required operators
      if (required.includes(operator.key)) {
        if (!operators.required) operators.required = [];
        operators.required.push(operator);
        return;
      }

      // Build by allowed operators
      if (allowed.length) {
        if (allowed.includes(operator.key)) operators.allowed.push(operator);
        else operators.banned.push(operator);
        return;
      }

      // Build by banned operators
      if (banned.length) {
        if (banned.includes(operator.key)) operators.banned.push(operator);
        else operators.allowed.push(operator);
        return
      }

      // Operators are implicitly allowed
      operators.allowed.push(operator);
    });

    return operators;
  }

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
