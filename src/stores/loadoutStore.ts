import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Gadget, Weapon } from '@/models';
import { WEAPON_CATEGORIES } from '@/models/Weapon';
import { AssetLoader } from '@/utils';

type GadgetResponse = {
  [gadgetKey: string]: {
    name: string;
    amount: number;
    features: {
      deployable?: boolean;
      electric?: boolean;
      throwable?: boolean;
    }
  }
}

type WeaponResponse = {
  [weaponClass: string]: {
    [weaponKey: string]: { name: string, slot: 'PRIMARY' | 'SECONDARY' } | string
  }
}

export default defineStore('loadoutStore', () => {
  /** Whether loadout item data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** The collection of gadgets. */
  const GADGETS = ref<{ [key: string]: Gadget }>({});

  /** A list of all gadgets. */
  const GADGET_LIST = computed<Gadget[]>(() => Object.values(GADGETS.value).map((gadget) => toRaw(gadget)));

  /** The collection of weapons. */
  const WEAPONS = ref<{ [key: string]: Weapon }>({});

  /** A list of all weapons. */
  const WEAPON_LIST = computed<Weapon[]>(() => Object.values(WEAPONS.value).map((weapon) => toRaw(weapon)));

  /** Fetches loadout item data from the data source. */
  async function fetchLoadoutItems() {
    // Skip if loadout items have already been fetched
    if (isFetched.value) return;

    // Fetch and map gadget and weapon data
    await Promise.all([
      (async () => {
        // Fetch raw gadget data
        const rawData = await AssetLoader.loadData<GadgetResponse>('gadgets.json');

        // Map raw data to gadget objects
        Object.entries(rawData).forEach(([gadgetKey, gadget]) => {
          GADGETS.value[gadgetKey] = new Gadget(gadget.name, gadget.amount, gadget.features);
        });
      })(),

      (async () => {
        // Fetch raw weapon data
        const rawData = await AssetLoader.loadData<WeaponResponse>('weapons.json');

        // Map raw weapon data to weapon objects
        Object.entries(rawData).forEach(([weaponClass, weapons]) => {
          Object.entries(weapons).forEach(([weaponKey, weapon]) => {
            if (typeof weapon === 'string') WEAPONS.value[weaponKey] = new WEAPON_CATEGORIES[weaponClass](weapon);
            else WEAPONS.value[weaponKey] = new WEAPON_CATEGORIES[weaponClass](weapon.name, weapon.slot);
          });
        });
      })()
    ]);

    isFetched.value = true;
    console.debug(GADGET_LIST.value);
    console.debug(WEAPON_LIST.value);
  }

  return {
    GADGETS,
    GADGET_LIST,

    WEAPONS,
    WEAPON_LIST,

    isFetched,
    fetchLoadoutItems
  };
});
