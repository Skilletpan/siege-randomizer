type GadgetFeatures = {
  /** Whether the gadget is deployable / can be placed down. */
  deployable?: boolean;

  /** Whether the gadget is electric and can be disabled via EMP. */
  electric?: boolean;

  /** Whether the gadget can be thrown. */
  throwable?: boolean;
}

export default class Gadget {
  /** The display name of the gadget. */
  readonly name: string;

  /** How many items of the gadget the player receives. */
  readonly amount: number;

  /** The features of the gadget. */
  readonly features: GadgetFeatures;

  /**
   * Creates a new gadget.
   * 
   * @param name     The display name of the gadget.
   * @param amount   How many items of the gadget the player receives.
   * @param features The features of the gadget.
   */
  constructor(name: string, amount: number, features: GadgetFeatures) {
    this.name = name;
    this.amount = amount;
    this.features = features;
  }
}
