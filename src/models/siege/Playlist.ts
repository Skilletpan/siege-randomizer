import type { Level, Operator } from '@/models';

export default class Playlist {
  /** The playlist key. */
  readonly key: string;

  /** The playlist name. */
  readonly name: string;

  /** The playlist category. */
  readonly category: string;

  /** The playlist settings. */
  readonly settings: {
    /** The level related settings. */
    levels?: {
      /** Whether level bans are enabled. */
      bans?: boolean;

      /** The levels available in the playlist. */
      list?: Level[];
    };
    /** The operator related settings. */
    operators?: {
      /** Whether operator bans are enabled. */
      bans?: boolean;

      /** Whether duplicate operator picks are enabled. */
      duplicates?: boolean;

      /** Whether mixed operator picks are enabled. */
      mixed?: boolean;

      /** The operators available in the playlist. */
      list?: Operator[];
    };
  };

  /**
   * Creates a new Playlist instance.
   * 
   * @param key      The playlist key.
   * @param name     The playlist name.
   * @param category The playlist category.
   * @param settings The playlist settings.
   */
  constructor(key: string, name: string, category: string, settings: Playlist['settings']) {
    this.key = key;
    this.name = name;
    this.category = category;
    this.settings = { ...settings };
  }
}

/** The raw playlist category data. */
export type RawPlaylistCategory = {
  /** The category name. */
  name: string;

  /** The playlists in the category. */
  playlists?: Record<string, RawPlaylist>;

  /** The playlist category settings. */
  settings?: RawPlaylist['settings'];

  /** The subcategories in the category. */
  subcategories?: Omit<RawPlaylistCategory, 'subcategories'>[];
};

/** The raw playlist data. */
export type RawPlaylist = {
  /** The playlist name. */
  name: string;

  /** The playlist settings. */
  settings?: {
    /** Whether the playlist is enabled. */
    disabled?: boolean;

    /** The level related settings. */
    levels?: {
      /** Whether level bans are enabled. */
      bans?: boolean;

      /** The keys of the levels unavailable in the playlist. */
      disabled?: string[];

      /** The keys of the levels available in the playlist. */
      enabled?: string[];
    };

    /** The operator related settings. */
    operators?: {
      /** Whether operator bans are enabled. */
      bans?: boolean;

      /** Whether duplicate operator picks are enabled. */
      duplicates?: boolean;

      /** Whether mixed operator picks are enabled. */
      mixed?: boolean;

      /** The keys of the operators unavailable in the playlist. */
      disabled?: string[];

      /** The keys of the operators available in the playlist. */
      enabled?: string[];
    };
  };
};
