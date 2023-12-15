import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export default defineStore('players', () => {
  /**
   * The list of player names.
   * @type {import('vue').Ref<string[]>}
   */
  const playerList = ref([]);

  /** The amount of player names currently in the list. */
  const playerCount = computed(() => playerList.value.length);

  /** Resets the store to its empty state. */
  function reset() { playerList.value.length = 0; }

  return { playerList, playerCount, reset };
});
