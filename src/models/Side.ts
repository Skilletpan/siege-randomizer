export default class Side {
  /** The name of the side. */
  readonly name: string;

  /** The role name of the side. */
  readonly roleName: string;

  /** The icon name of the side. */
  readonly icon: string;

  /** The color class of the side. */
  readonly color: string;

  /**
   * Creates a new side.
   * 
   * @param name     The name of the side.
   * @param roleName The role name of the side.
   * @param icon     The icon name of the side.
   * @param color    The color class of the side.
   */
  private constructor(name: string, roleName: string, icon: string, color: string) {
    this.name = name;
    this.roleName = roleName;
    this.icon = icon;
    this.color = color;
  }

  // Register sides
  static readonly ATT = new Side('Attack', 'Attacker', 'mdi-sword-cross', 'blue');
  static readonly DEF = new Side('Defense', 'Defender', 'mdi-chess-rook', 'orange');
}
