import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Season, Weapon } from '@/models';
import { WEAPON_CLASSES } from '@/models/siege/Weapon';
import { useLoadingStore } from '@/stores';
import { DataFetcher, Env } from '@/utils';

type RawSeasons = Record<string, string>;

type RawWeapons = Record<string, Record<string, string>>;

export default defineStore('siege', () => {
  const LoadingStore = useLoadingStore();

  /** The collection of seasons. */
  const SEASONS = ref<Record<string, Season>>({});

  /** The list of seasons. */
  const SEASON_LIST = computed(() => Object.values(SEASONS.value));

  /** The collection of weapons. */
  const WEAPONS = ref<Record<string, Weapon>>({});

  /** The list of weapons. */
  const WEAPON_LIST = computed(() => Object.values(WEAPONS.value));

  /** Whether Siege data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** Fetches the Siege related data from the data source. */
  async function fetchSiegeData() {
    // Cancel if already fetched
    if (isFetched.value) return;

    // Show loading dialog
    await LoadingStore.run(
      async () => {
        // Fetch data
        const [
          rawSeasons,
          rawWeapons
        ] = await Promise.all([
          DataFetcher.fetchData<RawSeasons>('seasons.json'),
          DataFetcher.fetchData<RawWeapons>('weapons.json')
        ]);

        // Mapping seasons
        LoadingStore.dialogStep = 'Mapping Seasons…';
        Object.entries(rawSeasons).forEach(([key, name], id) => SEASONS.value[key] = new Season(id, key, name));
        console.debug(toRaw(SEASONS.value));

        // Mapping weapons
        LoadingStore.dialogStep = 'Mapping Weapons…';
        Object.entries(rawWeapons).forEach(([weaponTypeKey, rawCategoryWeapons]) => {
          Object.entries(rawCategoryWeapons).forEach(([key, name]) => {
            const weapon = new WEAPON_CLASSES[weaponTypeKey](key, name);
            WEAPONS.value[weapon.key] = weapon;
          });
        });
        console.debug(toRaw(WEAPONS.value));
      },
      `Preparing ${Env.APP_NAME}…`,
      'Fetching Data…'
    );

    // Set fetched status
    isFetched.value = true;
  }

  return {
    SEASONS,
    SEASON_LIST,

    WEAPONS,
    WEAPON_LIST,

    isFetched,
    fetchSiegeData
  };
});
