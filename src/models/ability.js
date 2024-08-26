/** The unique ability or gadget of an operator. */
export default class Ability {
  // Instance properties
  #name;
  #amount;
  #amountDescriptor;
  #properties;

  /**
   * @param {Object}   abilityData                    The raw ability data.
   * @param {string}   abilityData.name               The name of the ability.
   * @param {number}   [abilityData.amount]           The amount of instances/uses/ammunition of the ability.
   * @param {string}   [abilityData.amountDescriptor] A descriptor for the `amount` property.
   * @param {string[]} abilityData.properties         The properties of the ability.
   */
  constructor(abilityData) {
    this.#name = abilityData.name;
    this.#amount = abilityData.amount;
    this.#amountDescriptor = abilityData.amountDescriptor;
    this.#properties = Array.from(abilityData.properties);
  }

  /**
   * The name of the ability.
   * @type {string}
   */
  get name() { return this.#name; }

  /**
   * The display name of the ability.
   * @type {string}
   */
  get displayName() {
    let _displayName = this.#name;

    // Append gadget amount in parenthesis
    if (this.#amount) {
      if (this.#amountDescriptor) _displayName = `${_displayName} (${this.#amount} ${this.#amountDescriptor})`;
      else _displayName = `${_displayName} (x${this.#amount})`;
    }

    // Return full display name
    return _displayName;
  }

  /**
   * The amount of instances, uses, charges or ammunition of the ability players recieve.
   * 
   * If `undefined`, the ability can be used an unlimited amount or is capable of recharging.
   * 
   * @type {number}
   */
  get amount() { return this.#amount; }

  /**
   * The properties of the ability.
   * @type {AbilityProperty[]}
   */
  get properties() { return this.#properties.includes(); }

  /**
   * Whether the ability can be used up.
   * @type {boolean}
   */
  get isConsumable() { return this.#amount !== undefined; }
}
