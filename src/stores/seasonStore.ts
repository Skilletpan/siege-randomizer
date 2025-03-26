import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Season } from '@/models';
import { AssetLoader } from '@/utils';

type SeasonResponse = {
  [seasonKey: string]: string
};

export default defineStore('seasonStore', () => {
  /** Whether season data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** The collection of seasons. */
  const SEASONS = ref<{ [key: string]: Season }>({});

  /** A list of all seasons. */
  const SEASON_LIST = computed<Season[]>(() => Object.values(SEASONS.value).map((season) => toRaw(season)));

  /** Fetches season data from the data source. */
  async function fetchSeasons() {
    // Skip if season data has already been fetched
    if (isFetched.value) return;

    // Fetch season data
    const rawData = await AssetLoader.loadData<SeasonResponse>('seasons.json');

    // Map raw data to season objects
    Object.entries(rawData).forEach(([seasonKey, seasonName]) => {
      SEASONS.value[seasonKey] = new Season(seasonKey, seasonName);
    });

    isFetched.value = true;
    console.debug(SEASON_LIST.value);
  }

  return {
    SEASONS,
    SEASON_LIST,

    fetchSeasons,
    isFetched
  };
});
