export default abstract class Weapon {
  /** The key of the weapon category. */
  static readonly categoryKey: string;

  /** The name of the weapon category. */
  static readonly categoryName: string;

  /** Whether the weapon category can be in the primary weapon slot. */
  static readonly canBePrimary: boolean = false;

  /** Whether the weapon category can be in the secondary weapon slot. */
  static readonly canBeSecondary: boolean = false;

  /** The name of the weapon. */
  readonly name: string;

  /** The slot of the weapon. */
  private readonly slot?: 'PRIMARY' | 'SECONDARY';

  /** The category of the weapon. */
  readonly category: { key: string, name: string };

  /**
   * Creates a new weapon.
   * 
   * @param name The name of the weapon.
   * @param slot The slot of the weapon.
   */
  constructor(name: string, slot?: 'PRIMARY' | 'SECONDARY') {
    this.name = name;
    this.slot = slot;

    this.category = {
      key: Object.getPrototypeOf(this).constructor.categoryKey,
      name: Object.getPrototypeOf(this).constructor.categoryName
    };
  }

  /** Whether the weapon can be in the primary weapon slot. */
  get canBePrimary(): boolean {
    if (this.slot) return this.slot === 'PRIMARY';
    return Object.getPrototypeOf(this).constructor.canBePrimary;
  }

  /** Whether the weapon can be in the secondary weapon slot. */
  get canBeSecondary(): boolean {
    if (this.slot) return this.slot === 'SECONDARY';
    return Object.getPrototypeOf(this).constructor.canBeSecondary;
  }
}

export class AssaultRifle extends Weapon {
  static readonly categoryKey: string = 'AR';
  static readonly categoryName: string = 'Assault Rifle';
  static readonly canBePrimary: boolean = true;
}

export class SubmachineGun extends Weapon {
  static readonly categoryKey: string = 'SMG';
  static readonly categoryName: string = 'Submachine Gun';
  static readonly canBePrimary: boolean = true;
}

export class LightMachineGun extends Weapon {
  static readonly categoryKey: string = 'LMG';
  static readonly categoryName: string = 'Light Machine Gun';
  static readonly canBePrimary: boolean = true;
}

export class Shield extends Weapon {
  static readonly categoryKey: string = 'SH';
  static readonly categoryName: string = 'Shield';
  static readonly canBePrimary: boolean = true;
}

export class Shotgun extends Weapon {
  static readonly categoryKey: string = 'SG';
  static readonly categoryName: string = 'Shotgun';
  static readonly canBePrimary: boolean = true;
  static readonly canBeSecondary: boolean = true;
}

export class SlugShotgun extends Shotgun {
  static readonly categoryKey: string = 'SSG';
  static readonly categoryName: string = 'Slug Shotgun';
  static readonly canBeSecondary: boolean = false;
}

export class MarksmanRifle extends Weapon {
  static readonly categoryKey: string = 'DMR';
  static readonly categoryName: string = 'Marksman Rifle';
  static readonly canBePrimary: boolean = true;
}

export class SniperRifle extends Weapon {
  static readonly categoryKey: string = 'SR';
  static readonly categoryName: string = 'Sniper Rifle';
  static readonly canBePrimary: boolean = true;
}

export class MachinePistol extends Weapon {
  static readonly categoryKey: string = 'MP';
  static readonly categoryName: string = 'Machine Pistol';
  static readonly canBeSecondary: boolean = true;
}

export class Handgun extends Weapon {
  static readonly categoryKey: string = 'HG';
  static readonly categoryName: string = 'Handgun';
  static readonly canBeSecondary: boolean = true;
}

export class Revolver extends Handgun {
  static readonly categoryKey: string = 'REV';
  static readonly categoryName: string = 'Revolver';
}

export class HandCannon extends Weapon {
  static readonly categoryKey: string = 'HC';
  static readonly categoryName: string = 'Hand Cannon';
  static readonly canBeSecondary: boolean = true;
}

/** The collection of weapon categories. */
export const WEAPON_CATEGORIES = {
  [AssaultRifle.categoryKey]: AssaultRifle,
  [SubmachineGun.categoryKey]: SubmachineGun,
  [LightMachineGun.categoryKey]: LightMachineGun,
  [MarksmanRifle.categoryKey]: MarksmanRifle,
  [SniperRifle.categoryKey]: SniperRifle,
  [Handgun.categoryKey]: Handgun,
  [Revolver.categoryKey]: Revolver,
  [MachinePistol.categoryKey]: MachinePistol,
  [Shotgun.categoryKey]: Shotgun,
  [SlugShotgun.categoryKey]: SlugShotgun,
  [Shield.categoryKey]: Shield,
  [HandCannon.categoryKey]: HandCannon
}

/** A list of all primary weapon categories. */
export const PRIMARIES = Object.values(WEAPON_CATEGORIES).filter((weapon) => weapon.canBePrimary);

/** A list of all secondary weapon categories. */
export const SECONDARIES = Object.values(WEAPON_CATEGORIES).filter((weapon) => weapon.canBeSecondary);
