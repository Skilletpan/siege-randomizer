export default class Season {
  /** The season id. */
  readonly id: number;

  /** The season key. */
  readonly key: string;

  /** The season name. */
  readonly name: string;

  /**
   * Creates a new Season instance.
   * 
   * @param id   The season id.
   * @param key  The season key.
   * @param name The season name.
   */
  constructor(id: number, key: string, name: string) {
    this.id = id;
    this.key = key;
    this.name = name;
  }

  /** Get the full name of the season. */
  get fullName() { return this.id > 0 ? `Operation ${this.name}` : this.name; }
}
