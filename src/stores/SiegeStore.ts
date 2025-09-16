import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';

import { useLoadingStore } from '@/stores';
import { Env } from '@/utils';

export default defineStore('siege', () => {
  const LoadingStore = useLoadingStore();

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
        const [] = await Promise.all([]);
      },
      `Preparing ${Env.APP_NAME}…`,
      'Fetching Data…'
    );

    // Set fetched status
    isFetched.value = true;
  }

  return {
    isFetched,
    fetchSiegeData
  };
});
