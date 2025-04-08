import { Season } from '@/models';
import { AssetLoader } from '@/utils';

export default class Level {
  /** The key of the level. */
  readonly key: string;

  /** The name of the level. */
  readonly name: string;

  /** The location of the level. */
  readonly location: string;

  /** The metadata of the level. */
  readonly metadata: {
    /** The release season of the level. */
    release: Season;

    /** The rework season of the level. */
    rework?: Season;
  }

  /** The URL of the thumbnail of the level. */
  readonly thumbnail: URL;

  /**
   * Creates a new level.
   * 
   * @param key      The key of the level.
   * @param name     The name of the level.
   * @param location The location of the level.
   * @param metadata The metadata of the level.
   */
  constructor(key: string, name: string, location: string, metadata: { release: Season, rework?: Season }) {
    this.key = key;
    this.name = name;
    this.location = location;
    this.metadata = metadata;

    this.thumbnail = AssetLoader.createAssetURL('levels', `${key}.jpg`);
  }
}
