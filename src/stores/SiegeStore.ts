import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Season } from '@/models';
import { useLoadingStore } from '@/stores';
import { DataFetcher, Env } from '@/utils';

type RawSeasons = Record<string, string>;

export default defineStore('siege', () => {
  const LoadingStore = useLoadingStore();

  /** The collection of seasons. */
  const SEASONS = ref<Record<string, Season>>({});

  /** The list of seasons. */
  const SEASON_LIST = computed(() => Object.values(SEASONS.value));

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
          rawSeasons
        ] = await Promise.all([
          DataFetcher.fetchData<RawSeasons>('seasons.json')
        ]);

        // Mapping seasons
        LoadingStore.dialogStep = 'Mapping Seasons…';
        Object.entries(rawSeasons).forEach(([key, name], id) => SEASONS.value[key] = new Season(id, key, name));
        console.debug(toRaw(SEASONS.value));
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

    isFetched,
    fetchSiegeData
  };
});
