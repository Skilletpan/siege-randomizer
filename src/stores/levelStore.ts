import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Level } from '@/models';
import { useSeasonStore } from '@/stores';
import { AssetLoader } from '@/utils';

type LevelResponse = {
  [key: string]: {
    name: string;
    location: string;
    release: string;
    rework?: string;
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
  const LEVEL_LIST = computed<Level[]>(() => Object.values(LEVELS.value).map((level) => toRaw(level)));

  /** A list of all level locations. */
  const COUNTRIES = ref<string[]>([]);

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
      const release = toRaw(SeasonStore.SEASONS[level.release]);
      const rework = level.rework ? toRaw(SeasonStore.SEASONS[level.rework]) : undefined;

      const country = level.location.split(', ').reverse()[0];
      if (!COUNTRIES.value.includes(country)) COUNTRIES.value.push(country);

      LEVELS.value[key] = new Level(key, level.name, level.location, release, rework);
    });

    // Sort countries array
    COUNTRIES.value.sort();

    isFetched.value = true;
    console.debug(LEVEL_LIST.value);
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
