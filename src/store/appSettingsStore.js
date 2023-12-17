import { defineStore } from 'pinia';
import { ref } from 'vue';

// Load data from localStorage
const storedData = JSON.parse(localStorage.getItem('app-settings'));

export default defineStore('app-settings', () => {
  /**
   * Whether to show the app settings dialog.
   * @type {import('vue').Ref<Boolean>}
   */
  const showSettings = ref(false);

  /**
   * Whether to show the match settings drawer.
   * @type {import('vue').Ref<Boolean>}
   */
  const showMatchDrawer = ref(true);

  /**
   * The theme to use.
   * @type {import('vue').Ref<String>}
   */
  const theme = ref(storedData?.theme || 'default');

  /**
   * Whether recently used player names should be stored.
   * @type {import('vue').Ref<Boolean>}
   */
  const storeRecentPlayers = ref(Object.hasOwn(storedData, 'storeRecent') ? storedData.storeRecent : true);

  /** Stores the current settings in the browser store. */
  function storeSettings() {
    localStorage.setItem(
      'app-settings',
      JSON.stringify({
        theme: theme.value,
        storeRecent: storeRecentPlayers
      })
    );
  }

  return { showSettings, showMatchDrawer, theme, storeRecentPlayers, storeSettings };
});
