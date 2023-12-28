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
  const storeRecentPlayers = ref(storedData ? Boolean(storedData.storeRecent) : true);

  /**
   * Whether to animate placeholder card backgrounds.
   * @type {import('vue').Ref<Boolean>}
   */
  const animatePlaceholderCards = ref(storedData ? Boolean(storedData.animatePlaceholders) : true);

  /** Stores the current settings in the browser store. */
  function storeSettings() {
    localStorage.setItem(
      'app-settings',
      JSON.stringify({
        theme: theme.value,
        storeRecent: storeRecentPlayers.value,
        animatePlaceholders: animatePlaceholderCards.value
      })
    );
  }

  return { theme, storeRecentPlayers, animatePlaceholderCards, storeSettings };
});
