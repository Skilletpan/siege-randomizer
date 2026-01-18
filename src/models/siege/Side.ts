export default class Side {
  /** The side key. */
  readonly key: string;

  /** The side name. */
  readonly name: string;

  /** The side role name. */
  readonly roleName: string;

  /** The side icon key. @see https://pictogrammers.com/library/mdi */
  readonly icon: string;

  /** The side color. */
  color: string;

  /**
   * Creates a new Side instance.
   * 
   * @param key      The side key.
   * @param name     The side name.
   * @param roleName The side role name.
   * @param icon     The side icon key. @see https://pictogrammers.com/library/mdi
   * @param color    The side color.
   */
  constructor(key: string, name: string, roleName: string, icon: string, color: string) {
    this.key = key;
    this.name = name;
    this.roleName = roleName;
    this.icon = icon;
    this.color = color;
  }
}
