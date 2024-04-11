import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';
import COLORS from 'vuetify/util/colors';

import { Side } from '@/models';

// Load settings from localStorage
const LOCAL_SETTINGS = JSON.parse(localStorage.getItem('app-settings'));

export default defineStore('appSettings', () => {
  /**
   * The color settings for both sides.
   * @type {{ [sideKey: string]: string }}
   */
  const colors = ref({
    [Side.ATT.key]: LOCAL_SETTINGS?.['attack-color'] || COLORS.blue.darken2,
    [Side.DEF.key]: LOCAL_SETTINGS?.['defense-color'] || COLORS.orange.darken2
  });

  // Store settings in localStorage
  watchEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify({
      'attack-color': colors.value[Side.ATT.key],
      'defense-color': colors.value[Side.DEF.key]
    }));
  });

  return { colors };
});
