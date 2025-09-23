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
    bulletproof?: boolean;

    /** Whether the gadget is electric and can be disabled with EMPs. */
    electric?: boolean;

    /** Whether the gadget deals significant damage to the environment and can create rotates. */
    environmentDamage?: boolean;

    /** Whether the gadget deals damage to deployed gadgets. */
    gadgetDamage?: boolean;

    /** Whether the gadget can be hacked. */
    hackable?: boolean;

    /** Whether the gadget deals significant damage to players. */
    playerDamage?: boolean;

    /** Whether the gadget features a recharge component. */
    rechargable?: boolean;

    /** Whether the gadget can be placed and retrieved. */
    retrievable?: boolean;

    /** Whether players can take control of the gadget. */
    steerable?: boolean;

    /** Whether the gadget can be thrown. */
    throwable?: boolean;
  };

  /**
   * Creates a new Gadget instance.
   * 
   * @param key      The gadget key.
   * @param name     The gadget name.
   * @param amount   The amount of items/charges/ammunition of the gadget players get.
   * @param features The gadget features.
   */
  constructor(key: string, name: string, amount: number = 1, features: Array<keyof Gadget['features']>) {
    this.key = key;
    this.name = name;
    this.amount = amount;
    this.features = features.reduce((prev, feature) => Object.assign(prev, { [feature]: true }), {});
  }
}

/** The raw gadget data. */
export type RawGadget = {
  /** The gadget name. */
  name: string;

  /** The amount of items/charges/ammunition of the gadget players get. */
  amount?: number;

  /** The gadget features. */
  features: Array<keyof Gadget['features']>;
};
