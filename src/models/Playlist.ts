import { Level, Operator } from '@/models';

type PlaylistSettings = {
  /** Whether the playlist allows operator bans. */
  canBanOperators?: boolean;

  /** Whether operators from both sides can be picked. */
  canPickBothSides?: boolean;

  /** Whether the playlist allows duplicate operator picks. */
  canPickDuplicateOperators?: boolean;

  /** The list of operators that are disallowed to pick. */
  disabledOperators?: Operator[];

  /** The list of operators players are allowed to pick. */
  enabledOperators?: Operator[];
}

export class PlaylistCategory {
  /** The display name of the category. */
  readonly name: string;

  /** The settings that apply to all playlists in this category. */
  readonly settings: PlaylistSettings;

  /**
   * Creates a new playlist category.
   * 
   * @param name     The display name of the playlist category.
   * @param settings The settings applying to all playlists in this category.
   */
  constructor(name: string, settings?: PlaylistSettings, parent?: PlaylistCategory) {
    this.name = parent ? `${parent.name} - ${name}` : name;

    this.settings = {
      canBanOperators: settings?.canBanOperators ?? parent?.settings.canBanOperators,
      canPickBothSides: settings?.canPickBothSides ?? parent?.settings.canPickBothSides,
      canPickDuplicateOperators: settings?.canPickDuplicateOperators ?? parent?.settings.canPickDuplicateOperators,
      disabledOperators: settings?.disabledOperators ?? parent?.settings.disabledOperators,
      enabledOperators: settings?.enabledOperators ?? parent?.settings.enabledOperators
    }
  }
}

export default class Playlist {
  /** The key of the playlist. */
  readonly key: string;

  /** The (display) name of the playlist. */
  readonly name: string;

  /** The category of the playlist. */
  readonly category: PlaylistCategory;

  /** The levels in the playlist. */
  readonly levels: Level[];

  /** The settings of the playlist. */
  readonly settings: PlaylistSettings;

  /**
   * Creates a new playlist.
   * 
   * @param key      The key of the playlist.
   * @param name     The (display) name of the playlist.
   * @param category The (key of the) category of the playlist.
   * @param levels   The (keys of the) levels in the playlist.
   * @param settings The settings of the playlist.
   */
  constructor(
    key: string,
    name: string,
    levels: Level[],
    category: PlaylistCategory,
    settings?: PlaylistSettings
  ) {
    this.key = key;
    this.name = name;
    this.levels = Array.from(levels);
    this.category = category;

    this.settings = {
      canBanOperators: settings?.canBanOperators ?? category.settings.canBanOperators,
      canPickBothSides: settings?.canPickBothSides ?? category.settings.canPickBothSides,
      canPickDuplicateOperators: settings?.canPickDuplicateOperators ?? category.settings.canPickDuplicateOperators,
      disabledOperators: settings?.disabledOperators ?? category.settings.disabledOperators,
      enabledOperators: settings?.enabledOperators ?? category.settings.enabledOperators
    }
  }

  /**
   * Checks whether an operator can be played in this playlist
   * 
   * @param operator The operator to check.
   * 
   * @returns Whether the operator is allowed to play.
   */
  canPickOperator(operator: Operator): boolean {
    if (this.settings.enabledOperators) return this.settings.enabledOperators.includes(operator);
    else if (this.settings.disabledOperators) return !this.settings.disabledOperators.includes(operator);
    return true;
  }
}
