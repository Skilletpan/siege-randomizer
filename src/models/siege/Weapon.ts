export default abstract class Weapon {
  /** The key of the weapon category. */
  static readonly key: string;

  /** The display name of the weapon category. */
  static readonly name: string;

  /** The slot of the weapon category. */
  static readonly slot?: 'PRIMARY' | 'SECONDARY' | 'SHIELD';

  /** The key of the weapon. */
  readonly key: string;

  /** The name of the weapon. */
  readonly name: string;

  /**
   * Creates a new Weapon instance.
   * 
   * @param key  The key of the weapon.
   * @param name The display name of the weapon.
   */
  constructor(key: string, name: string) {
    this.key = `${this.category.key}.${key}`;
    this.name = name;
  }

  /** The weapon category information of the weapon. */
  get category() {
    const category = this.constructor as typeof Weapon;

    return {
      key: category.key,
      name: category.name,
      slot: category.slot
    }
  }
}

export class AssaultRifle extends Weapon {
  static readonly key: string = 'AR';
  static readonly name: string = 'Assault Rifle';
  static readonly slot = 'PRIMARY';
}

export class SubmachineGun extends Weapon {
  static readonly key: string = 'SMG';
  static readonly name: string = 'Submachine Gun';
  static readonly slot = 'PRIMARY';
}

export class LightMachineGun extends Weapon {
  static readonly key = 'LMG';
  static readonly name = 'Light Machine Gun';
  static readonly slot = 'PRIMARY';
}

export class Shotgun extends Weapon {
  static readonly key: string = 'SG';
  static readonly name: string = 'Shotgun';
}

export class SlugShotgun extends Shotgun {
  static readonly key: string = 'SSG';
  static readonly name: string = 'Slug Shotgun';
}

export class MarksmanRifle extends Weapon {
  static readonly key: string = 'DMR';
  static readonly name: string = 'Marksman Rifle';
  static readonly slot = 'PRIMARY';
}

export class SniperRifle extends Weapon {
  static readonly key: string = 'SR';
  static readonly name: string = 'Sniper Rifle';
  static readonly slot = 'PRIMARY';
}

export class MachinePistol extends Weapon {
  static readonly key: string = 'MP';
  static readonly name: string = 'Machine Pistol';
  static readonly slot = 'SECONDARY';
}

export class Handgun extends Weapon {
  static readonly key: string = 'HG';
  static readonly name: string = 'Handgun';
  static readonly slot = 'SECONDARY';
}

export class Revolver extends Handgun {
  static readonly key: string = 'REV';
  static readonly name: string = 'Revolver';
}

export class HandCannon extends Weapon {
  static readonly key: string = 'HC';
  static readonly name: string = 'Hand Cannon';
  static readonly slot = 'SECONDARY';
}

export class Shield extends Weapon {
  static readonly key: string = 'SH';
  static readonly name: string = 'Shield';
  static readonly slot = 'SHIELD';
}

/** A map to find Weapon classes by their key. */
export const WEAPON_CLASSES = Object.freeze({
  [AssaultRifle.key]: AssaultRifle,
  [SubmachineGun.key]: SubmachineGun,
  [LightMachineGun.key]: LightMachineGun,
  [Shotgun.key]: Shotgun,
  [SlugShotgun.key]: SlugShotgun,
  [MarksmanRifle.key]: MarksmanRifle,
  [SniperRifle.key]: SniperRifle,
  [MachinePistol.key]: MachinePistol,
  [Handgun.key]: Handgun,
  [Revolver.key]: Revolver,
  [HandCannon.key]: HandCannon,
  [Shield.key]: Shield
});
