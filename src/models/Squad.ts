import { AssetLoader } from '@/utils';

export default class Squad {
  /** The name of the squad. */
  readonly name: string;

  /** The URL pointing to the logo of the squad. */
  readonly logo: URL;

  constructor(name: string) {
    // Required properties
    this.name = name;

    // Computed properties
    this.logo = AssetLoader.createAssetURL('squads', `${name.toLocaleUpperCase('en-US')}.png`);
  }
}
