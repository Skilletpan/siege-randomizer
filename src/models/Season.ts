export default class Season {
  /** The key of the season. */
  readonly key: string;

  /** The display name of the season. */
  readonly name: string;

  /** The sorting value of the season. */
  readonly value: number;

  /**
   * Creates a new season.
   * 
   * @param key  The key of the season.
   * @param name The display name of the season.
   */
  constructor(key: string, name: string) {
    this.key = key;
    this.name = name;

    this.value = Number(this.key.replace(/[A-Z]/gi, ''));
  }
}
