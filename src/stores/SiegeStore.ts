import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';

import { useDialogStore } from '@/stores';

export default defineStore('siege', () => {
  const DialogStore = useDialogStore();

  /** Whether Siege data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** Fetches the Siege related data from the data source. */
  async function fetchSiegeData() {
    // Cancel if already fetched
    if (isFetched.value) return;
  }

  return {
    isFetched,
    fetchSiegeData
  };
});
