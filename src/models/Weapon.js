import { MappedModel } from './Model';

export default class Weapon extends MappedModel {
  static {
    this._className = 'weapons';
    const rawWeapons = require('@/data/weapons.json');

    // Build weapon instances from raw data
    Object.entries(rawWeapons).forEach(([key, weapon], index) => {
      // Create weapon instance
      new Weapon({ id: index, key, name: weapon }, this._className);

      // Add getter
      MappedModel._addGetter(this, key);
    });

    console.debug(
      'Weapons imported:',
      this.LIST
    );
  }
}
