import type { Season } from '@/models';
import { DataFetcher } from '@/utils';

export default class Level {
  /** The level key. */
  readonly key: string;

  /** The level display name. */
  readonly name: string;

  /** The level location. */
  readonly location: string;

  /** The level metadata. */
  readonly metadata: {
    /** Whether the level is disabled (inaccessible in-game). */
    disabled?: boolean;

    /** Season the level was released in. */
    released: Season;

    /** The (last) season the level was reworked in. */
    reworked?: Season;

    /** The season the level was modernized for. */
    modernized?: Season;
  };

  /**
   * Creates a new Level instance.
   * 
   * @param key      The level key.
   * @param name     The level display name.
   * @param metadata The level metadata.
   */
  constructor(key: string, name: string, location: string, metadata: Level['metadata']) {
    this.key = key;
    this.name = name;
    this.location = location;
    this.metadata = { ...metadata };
  }

  /** The level thumbnail URL. */
  get thumbnail() { return DataFetcher.buildAssetUrl('levels', `${this.key}.jpg`); }
}
