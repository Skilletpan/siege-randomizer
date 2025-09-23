import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Season, Side, type Weapon } from '@/models';
import Gadget, { type RawGadget } from '@/models/siege/Gadget';
import Level, { type RawLevel } from '@/models/siege/Level';
import { WEAPON_CLASSES } from '@/models/siege/Weapon';
import { useLoadingStore } from '@/stores';
import { DataFetcher, Env } from '@/utils';

type RawSeasons = Record<string, string>;

type RawWeapons = Record<string, Record<string, string>>;

export default defineStore('siege', () => {
  const LoadingStore = useLoadingStore();

  /** The collection of gadgets. */
  const GADGETS = ref<Record<string, Gadget>>({});

  /** The list of gadgets. */
  const GADGET_LIST = computed(() => Object.values(GADGETS.value));

  /** The collection of levels. */
  const LEVELS = ref<Record<string, Level>>({});

  /** The list of levels. */
  const LEVEL_LIST = computed(() => Object.values(LEVELS.value));

  /** The list of level locations. */
  const LEVEL_LOCATIONS = computed(() => LEVEL_LIST.value.reduce<string[]>((locations, level) => {
    // Get level locations
    const location = level.location.split(', ').at(-1)!;

    // Add level location to list if not present
    if (!locations.includes(location)) locations.push(location);
    return locations;
  }, []).sort());

  /** The collection of seasons. */
  const SEASONS = ref<Record<string, Season>>({});

  /** The list of seasons. */
  const SEASON_LIST = computed(() => Object.values(SEASONS.value));

  /** The collection of sides. */
  const SIDES = ref<Record<string, Side>>({
    ATT: new Side('ATT', 'Attack', 'Attacker', 'mdi-sword-cross', 'blue'),
    DEF: new Side('DEF', 'Defense', 'Defender', 'mdi-chess-rook', 'orange')
  });

  /** The list of sides. */
  const SIDE_LIST = computed(() => Object.values(SIDES.value));

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
          rawGadgets,
          rawLevels,
          rawSeasons,
          rawWeapons
        ] = await Promise.all([
          DataFetcher.fetchData<Record<string, RawGadget>>('gadgets.json'),
          DataFetcher.fetchData<Record<string, RawLevel>>('levels.json'),
          DataFetcher.fetchData<RawSeasons>('seasons.json'),
          DataFetcher.fetchData<RawWeapons>('weapons.json')
        ]);

        // Mapping seasons
        LoadingStore.dialogStep = 'Mapping Seasons…';
        Object.entries(rawSeasons).forEach(([key, name], id) => SEASONS.value[key] = new Season(id, key, name));
        console.debug(toRaw(SEASONS.value));

        // Mapping levels
        LoadingStore.dialogStep = 'Mapping Levels…';
        Object.entries(rawLevels).forEach(([key, rawLevel]) => {
          // Map level metadata
          const { released, reworked, modernized } = rawLevel.metadata;
          const metadata = {
            released: SEASONS.value[released],
            reworked: reworked ? SEASONS.value[reworked] : undefined,
            modernized: modernized ? SEASONS.value[modernized] : undefined
          };

          // Create level instance
          LEVELS.value[key] = new Level(key, rawLevel.name, rawLevel.location, metadata);
        });
        console.debug(toRaw(LEVELS.value));
        console.debug(LEVEL_LOCATIONS.value);

        // Mapping weapons
        LoadingStore.dialogStep = 'Mapping Weapons…';
        Object.entries(rawWeapons).forEach(([weaponTypeKey, rawCategoryWeapons]) => {
          Object.entries(rawCategoryWeapons).forEach(([key, name]) => {
            const weapon = new WEAPON_CLASSES[weaponTypeKey](key, name);
            WEAPONS.value[weapon.key] = weapon;
          });
        });
        console.debug(toRaw(WEAPONS.value));

        // Mapping gadgets
        LoadingStore.dialogStep = 'Mapping Gadgets…';
        Object.entries(rawGadgets).forEach(([key, rawGadget]) => GADGETS.value[key] = new Gadget(
          key,
          rawGadget.name,
          rawGadget.amount,
          rawGadget.features
        ));
        console.debug(toRaw(GADGETS.value));
      },
      `Preparing ${Env.APP_NAME}…`,
      'Fetching Data…'
    );

    // Set fetched status
    isFetched.value = true;
  }

  return {
    GADGETS,
    GADGET_LIST,

    LEVELS,
    LEVEL_LIST,
    LEVEL_LOCATIONS,

    SEASONS,
    SEASON_LIST,

    SIDES,
    SIDE_LIST,

    WEAPONS,
    WEAPON_LIST,

    isFetched,
    fetchSiegeData
  };
});
