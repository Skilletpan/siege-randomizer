import { defineStore } from 'pinia';
import { ref, shallowRef, watchEffect } from 'vue';
import COLORS from 'vuetify/util/colors';

import { Side } from '@/models';

// Set default settings
const RAW_SETTINGS = {
  attackColor: COLORS.blue.darken2,
  defenseColor: COLORS.orange.darken2,
  storePlayerNames: true
};

// Load settings from localStorage
const LOCAL_SETTINGS = JSON.parse(localStorage.getItem('appSettings'));
Object.keys(RAW_SETTINGS).forEach((key) => {
  if (LOCAL_SETTINGS && Object.hasOwn(LOCAL_SETTINGS, key)) RAW_SETTINGS[key] = LOCAL_SETTINGS[key];
});

export default defineStore('appSettings', () => {
  /**
   * The color settings for both sides.
   * @type {{ [sideKey: string]: string }}
   */
  const colors = ref({
    [Side.ATT.key]: RAW_SETTINGS.attackColor,
    [Side.DEF.key]: RAW_SETTINGS.defenseColor
  });

  /**
   * Whether player names should be stored.
   * @type {import('vue').ShallowRef<Boolean>}
   */
  const storePlayerNames = shallowRef(RAW_SETTINGS.storePlayerNames);

  // Store settings in localStorage
  watchEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify({
      attackColor: colors.value[Side.ATT.key],
      defenseColor: colors.value[Side.DEF.key],
      storePlayerNames: storePlayerNames.value
    }));
  });

  return { colors, storePlayerNames };
});
