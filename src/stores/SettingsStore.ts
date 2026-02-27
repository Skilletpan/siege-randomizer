import { defineStore } from 'pinia';
import { shallowRef, watchEffect } from 'vue';

import { useSiegeStore } from '@/stores';

// Get current settings from localStorage
const localSettings = JSON.parse(localStorage.getItem('settings') ?? '{}');

export default defineStore('settings', () => {
  // Dependency stores
  const SiegeStore = useSiegeStore();

  /** Whether the settings modal is visible. */
  const show = shallowRef<boolean>(false);

  // Set side colors
  SiegeStore.SIDES.ATT.color = localSettings.colors?.ATT ?? 'blue';
  SiegeStore.SIDES.DEF.color = localSettings.colors?.DEF ?? 'orange-darken-1';

  // Write setting changes to localStorage
  watchEffect(() => {
    // Build settings object
    const settings = {
      colors: {
        ATT: SiegeStore.SIDES.ATT.color,
        DEF: SiegeStore.SIDES.DEF.color
      }
    }

    // Store settings in localStorage
    localStorage.setItem('settings', JSON.stringify(settings));
  });

  return {
    show
  };
});
