import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Level } from '@/models';
import { useSeasonStore } from '@/stores';
import { AssetLoader } from '@/utils';

type LevelResponse = {
  [key: string]: {
    name: string;
    location: string;
    metadata: {
      bannable?: boolean;
      disabled?: boolean;
      release: string;
      rework?: string;
    };
  };
}

export default defineStore('levelStore', () => {
  // Dependency stores
  const SeasonStore = useSeasonStore();

  /** Whether level data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** The collection of levels. */
  const LEVELS = ref<{ [key: string]: Level }>({});

  /** A list of all levels. */
  const LEVEL_LIST = computed<Level[]>(() => Object.values(LEVELS.value));

  /** A list of all level locations. */
  const COUNTRIES = computed<string[]>(() => LEVEL_LIST.value
    .reduce((array: string[], level) => {
      const country = level.location.split(', ').at(-1);
      if (country && !array.includes(country)) array.push(country);
      return array;
    }, [])
    .sort()
  );

  /** Fetches level data from the data source. */
  async function fetchLevels() {
    // Skip if level data has already been fetched
    if (isFetched.value) return;

    // Fetch dependency data
    await SeasonStore.fetchSeasons();

    // Fetch level data
    const rawData = await AssetLoader.loadData<LevelResponse>('levels.json');

    // Map raw data to level objects
    Object.entries(rawData).forEach(([key, level]) => {
      // Map release/rework season
      const metadata = {
        bannable: level.metadata.bannable ?? true,
        disabled: level.metadata.disabled ?? false,
        release: SeasonStore.SEASONS[level.metadata.release],
        rework: level.metadata.rework ? SeasonStore.SEASONS[level.metadata.rework] : undefined
      };

      // Create level and add it to the collection
      LEVELS.value[key] = new Level(key, level.name, level.location, metadata);
    });

    isFetched.value = true;
    console.debug(LEVEL_LIST.value.map((level) => toRaw(level)));
    console.debug(toRaw(COUNTRIES.value));
  }

  return {
    LEVELS,
    LEVEL_LIST,
    COUNTRIES,

    fetchLevels,
    isFetched
  };
});
