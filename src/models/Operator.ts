import { Gadget, Season, Side, Squad, Weapon } from '@/models';
import { Shield } from '@/models/Weapon';
import { AssetLoader } from '@/utils';

/** The biographical data of an operator. */
type OperatorBiography = {
  /** The legal name of the operator. */
  name?: string;

  /** The birthplace of the operator. */
  birthplace?: string;

  /** The organization the operator is affiliated with. */
  organization?: string;

  /** The squad the operator is assigned to. */
  squad?: Squad;
}

/** The loadout of an operator. */
type OperatorLoadout = {
  /** The shield of the operator. */
  shield?: Shield;

  /** The primary weapons of the operator. */
  primaryWeapons?: Weapon[];

  /** The secondary weapons of the operator. */
  secondaryWeapons?: Weapon[];

  /** The secondary gadgets of the operator. */
  gadgets: Gadget[]
}

export default class Operator {
  /** The name of the operator. */
  readonly name: string;

  /** Whether the operator is an attacker or a defender. */
  readonly side: Side;

  /** The speed of the operator. */
  readonly speed: 1 | 2 | 3;

  /** The roles of the operator. */
  readonly roles: string[];

  /** The season the operator was released in. */
  readonly release: Season;

  /** The biographical data of the operator. */
  readonly biography: OperatorBiography;

  /** The loadout of the operator. */
  readonly loadout: OperatorLoadout;

  /** The assets of the operator. */
  readonly assets: {
    /** The URL pointing to the emblem of the operator. */
    emblem: URL;

    /** The URL pointing to the portrait of the operator. */
    portrait: URL;

    /** The URL pointing to the squad emblem of the operator. */
    squad?: URL;
  }

  /**
   * Creates a new operator.
   * 
   * @param key       The key of the operator.
   * @param name      The nickname of the operator.
   * @param side      Whether the operator is an attacker or a defender.
   * @param speed     The speed of the operator.
   * @param roles     The roles of the operator.
   * @param release   The season the operator was released in.
   * @param biography The biographical data of the operator.
   * @param loadout   The loadout of the operator.
   */
  constructor(
    key: string,
    name: string,
    side: Side,
    speed: 1 | 2 | 3,
    roles: string[],
    release: Season,
    biography: OperatorBiography,
    loadout: OperatorLoadout
  ) {
    this.name = name;
    this.side = side;
    this.speed = speed;
    this.roles = Array.from(roles);
    this.release = release;
    this.biography = biography;
    this.loadout = loadout;

    this.assets = {
      emblem: AssetLoader.createAssetURL('operators', key, 'emblem.png'),
      portrait: AssetLoader.createAssetURL('operators', key, 'portrait.png')
    };
  }
}
