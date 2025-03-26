import { Season } from '@/models';
import { AssetLoader } from '@/utils';

export default class Level {
  /** The key of the level. */
  readonly key: string;

  /** The name of the level. */
  readonly name: string;

  /** The location of the level. */
  readonly location: string;

  /** The release season of the level. */
  readonly release: Season;

  /** The rework season of the level. */
  readonly rework?: Season;

  /** The URL of the thumbnail of the level. */
  readonly thumbnail: URL;

  /**
   * Creates a new level.
   * 
   * @param key      The key of the level.
   * @param name     The name of the level.
   * @param release  The release season of the level.
   * @param location The location of the level.
   * @param rework   The rework season of the level.
   */
  constructor(key: string, name: string, location: string, release: Season, rework?: Season) {
    this.key = key;
    this.name = name;
    this.location = location;
    this.release = release;
    this.rework = rework;

    this.thumbnail = AssetLoader.createAssetURL('levels', `${key}.jpg`);
  }
}
