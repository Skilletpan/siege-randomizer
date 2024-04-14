import { defineStore } from 'pinia';
import { ref, shallowRef, watchEffect } from 'vue';
import COLORS from 'vuetify/util/colors';

import { Side } from '@/models';

// Set default settings
const RAW_SETTINGS = {
  'attack-color': COLORS.blue.darken2,
  'defense-color': COLORS.orange.darken2,
  'store-players': true
};

// Load settings from localStorage
const LOCAL_SETTINGS = JSON.parse(localStorage.getItem('app-settings')) || {};
Object.keys(RAW_SETTINGS).forEach((key) => {
  if (Object.hasOwn(LOCAL_SETTINGS, key)) RAW_SETTINGS[key] = LOCAL_SETTINGS[key];
});

export default defineStore('appSettings', () => {
  /**
   * The color settings for both sides.
   * @type {{ [sideKey: string]: string }}
   */
  const colors = ref({
    [Side.ATT.key]: RAW_SETTINGS['attack-color'],
    [Side.DEF.key]: RAW_SETTINGS['defense-color']
  });

  /**
   * Whether player names should be stored.
   * @type {import('vue').ShallowRef<Boolean>}
   */
  const storePlayerNames = shallowRef(RAW_SETTINGS['store-players']);

  // Store settings in localStorage
  watchEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify({
      'attack-color': colors.value[Side.ATT.key],
      'defense-color': colors.value[Side.DEF.key],
      'store-players': storePlayerNames.value
    }));
  });

  return { colors, storePlayerNames };
});
