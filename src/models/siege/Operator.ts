import { type Gadget, type Season, type Side, Weapon } from '@/models';
import type { Shield } from '@/models/siege/Weapon';
import { DataFetcher } from '@/utils';

export default class Operator {
  /** The unique key of the operator. */
  readonly key: string;

  /** The alias of the operator. */
  readonly alias: string;

  /** The gameplay information of the operator. */
  readonly gameplay: Gameplay;

  /** The loadout of the operator. */
  readonly loadout: Loadout;

  /** The lore information of the operator. */
  readonly lore: Lore;

  /** The metadata of the operator. */
  readonly metadata: Metadata;

  /**
   * Creates a new Operator instance.
   * 
   * @param key      The unique key of the operator.
   * @param alias    The alias of the operator.
   * @param gameplay The gameplay information of the operator.
   * @param loadout  The loadout of the operator.
   * @param lore     The lore information of the operator.
   * @param metadata The metadata of the operator.
   */
  constructor(
    key: string,
    alias: string,
    gameplay: Gameplay,
    loadout: Loadout,
    lore: Lore,
    metadata: Metadata
  ) {
    this.key = key;
    this.alias = alias;
    this.gameplay = gameplay;
    this.loadout = loadout;
    this.lore = lore;
    this.metadata = metadata;
  }

  /** The URL to the emblem of the operator. */
  get emblem() { return DataFetcher.buildAssetUrl('operators', this.key, 'emblem.png'); }

  /** The URL to the portrait of the operator. */
  get portrait() { return DataFetcher.buildAssetUrl('operators', this.key, 'portrait.png'); }

  /** The URL to the emblem of the squad the operator is assigned to. */
  get squadEmblem() {
    if (!this.lore.affiliations?.squad) return null;
    return DataFetcher.buildAssetUrl('squads', `${this.lore.affiliations?.squad?.toUpperCase()}.png`);
  }
}

/** The raw operator data. */
export type RawOperator = {
  /** The alias of the operator. */
  alias: string;

  /** The raw gameplay information of the operator. */
  gameplay: Gameplay<true>;

  /** The raw loadout of the operator. */
  loadout: Loadout<true>;

  /** The raw lore information of the operator. */
  lore: Lore;

  /** The raw metadata of the operator. */
  metadata: Metadata<true>;
};

type Gameplay<isRaw = false> = {
  /** The side/role of the operator. */
  side: isRaw extends false ? Side : 'ATT' | 'DEF';

  /** The specialties of the operator. */
  specialties: string[];

  /** The speed of the operator. */
  speed: 1 | 2 | 3;
};

type Loadout<isRaw = false> = {
  /** The weapons of the operator. */
  weapons: {
    /** The shield of the operator. */
    shield?: isRaw extends false ? Shield : string;

    /** The primary weapons of the operator. */
    primary?: Array<isRaw extends false ? Weapon : string>;

    /** The secondary weapons of the operator. */
    secondary?: Array<isRaw extends false ? Weapon : string>;
  };

  /** The gadgets of the operator. */
  gadgets: {
    /** The primary gadget (unique ability) of the operator. */
    primary: string;

    /** The secondary gadgets of the operator. */
    secondary: Array<isRaw extends false ? Gadget : string>;
  };
};

type Lore = {
  /** The biographical information of the operator. */
  biography?: {
    /** The given name(s) of the operator. */
    givenName?: string;

    /** The given name(s) of the operator when the family name comes first. */
    givenNameRight?: string;

    /** The last name of the operator. */
    lastName?: string;

    /** The birthplace of the operator. */
    birthplace?: string;

    /** The nationality of the operator. */
    nationality?: string;

    /** The birthday of the operator. */
    birthday?: string;

    /** The age of the operator. */
    age?: number;
  };

  /** The affiliations of the operator. */
  affiliations?: {
    /** The organization the operator belonged to. */
    organization?: string;

    /** The squad the operator is assigned to. */
    squad?: string;
  };
};

type Metadata<isRaw = false> = {
  /** The season the operator was released in. */
  released: isRaw extends false ? Season : string;

  /** The season the operator was (last) reworked in. */
  reworked?: isRaw extends false ? Season : string;
};
