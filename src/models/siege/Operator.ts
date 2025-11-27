import type { Gadget, Season, Side, Weapon } from '@/models';
import type { Shield } from '@/models/siege/Weapon';
import { DataFetcher } from '@/utils';

export default class Operator {
  /** The operator key. */
  readonly key: string;

  /** The operator alias. */
  readonly alias: string;

  /** The operator side. */
  readonly side: Side;

  /** The operator speed. */
  readonly speed: 1 | 2 | 3;

  /** The operator roles. */
  readonly roles: string[];

  /** The operator biography. */
  readonly biography: {
    /** The operator name. */
    name?: string;

    /** The operator birthplace. */
    birthplace?: string;

    /** The operator organization. */
    organization?: string;

    /** The operator squad. */
    squad?: {
      /** The squad name. */
      name: string;

      /** The squad icon URL. */
      icon: URL;
    };
  };

  /** The operator loadout. */
  readonly loadout: {
    /** The shield. */
    shield?: Shield;

    /** The primary weapons. */
    primaries?: Weapon[];

    /** The secondary weapons. */
    secondaries?: Weapon[];

    /** The gadgets. */
    gadgets: Gadget[];
  };

  /** The operator metadata. */
  readonly metadata: {
    /** The season the operator was released in. */
    released: Season;

    /** The (last) season the operator was reworked in. */
    reworked?: Season;
  };

  /**
   * Creates a new Operator instance.
   * 
   * @param key       The operator key.
   * @param alias     The operator alias.
   * @param side      The operator side.
   * @param speed     The operator speed.
   * @param roles     The operator roles.
   * @param biography The operator biography.
   * @param loadout   The operator loadout.
   * @param metadata  The operator metadata.
   */
  constructor(
    key: string,
    alias: string,
    side: Side,
    speed: 1 | 2 | 3,
    roles: string[],
    biography: RawOperator['biography'],
    loadout: Operator['loadout'],
    metadata: Operator['metadata']
  ) {
    this.key = key;
    this.alias = alias;
    this.side = side;
    this.speed = speed;
    this.roles = Array.from(roles);
    this.biography = {};
    this.loadout = { ...loadout };
    this.metadata = { ...metadata };

    // Map biography
    if (biography.name) this.biography.name = biography.name;
    if (biography.birthplace) this.biography.birthplace = biography.birthplace;
    if (biography.organization) this.biography.organization = biography.organization;
    if (biography.squad) this.biography.squad = {
      name: biography.squad,
      icon: DataFetcher.buildAssetUrl('squads', `${biography.squad.toUpperCase()}.png`)
    };
  }

  /** The operator emblem URL. */
  get emblem() { return DataFetcher.buildAssetUrl('operators', this.key, 'emblem.png'); }

  /** The operator portrait URL. */
  get portrait() { return DataFetcher.buildAssetUrl('operators', this.key, 'portrait.png'); }
}

/** The raw operator data. */
export type RawOperator = {
  /** The operator alias. */
  alias: string;

  /** The key of the operator side. */
  side: 'ATT' | 'DEF';

  /** The operator speed. */
  speed: 1 | 2 | 3;

  /** The operator roles. */
  roles: string[];

  /** The operator biography. */
  biography: {
    /** The operator name. */
    name?: string;

    /** The operator birthplace. */
    birthplace?: string;

    /** The operator organization. */
    organization?: string;

    /** The operator squad. */
    squad?: string;
  };

  /** The raw operator loadout. */
  loadout: {
    /** The key of the shield. */
    shield?: string;

    /** The keys of the primary weapons. */
    primaries?: string[];

    /** The keys of the secondary weapons. */
    secondaries?: string[];

    /** The keys of the gadgets. */
    gadgets: string[];
  };

  /** The raw operator metadata. */
  metadata: {
    /** The key of the season the operator was released in. */
    released: string;

    /** The key of the (last) season the operator was reworked in. */
    reworked?: string;
  };
};
