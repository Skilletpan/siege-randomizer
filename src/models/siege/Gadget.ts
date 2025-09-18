export default class Gadget {
  /** The gadget key. */
  readonly key: string;

  /** The gadget name. */
  readonly name: string;

  /** The amount of items/charges/ammunition of the gadget players get. */
  readonly amount: number;

  /** The gadget features. */
  readonly features: {
    /** Whether the gadget is bulletproof to an extent. */
    bulletproof?: true;

    /** Whether the gadget is electric and can be disabled with EMPs. */
    electric?: true;

    /** Whether the gadget deals significant damage to the environment and can create rotates. */
    environmentDamage?: true;

    /** Whether the gadget deals damage to deployed gadgets. */
    gadgetDamage?: true;

    /** Whether the gadget can be hacked. */
    hackable?: true;

    /** Whether the gadget deals significant damage to players. */
    playerDamage?: true;

    /** Whether the gadget features a recharge component. */
    rechargable?: true;

    /** Whether the gadget can be placed and retrieved. */
    retrievable?: true;

    /** Whether players can take control of the gadget. */
    steerable?: true;

    /** Whether the gadget can be thrown. */
    throwable?: true;
  };

  /**
   * Creates a new Gadget instance.
   * 
   * @param key      The gadget key.
   * @param name     The gadget name.
   * @param amount   The amount of items/charges/ammunition of the gadget players get.
   * @param features The gadget features.
   */
  constructor(key: string, name: string, amount: number = 1, features: Record<string, true>) {
    this.key = key;
    this.name = name;
    this.amount = amount;
    this.features = { ...features };
  }
}
