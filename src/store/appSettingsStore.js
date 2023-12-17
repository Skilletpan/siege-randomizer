import { defineStore } from 'pinia';
import { ref } from 'vue';

// Load data from localStorage
const storedData = JSON.parse(localStorage.getItem('app-settings'));

export default defineStore('app-settings', () => {
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

  return { theme, storeRecentPlayers };
});
