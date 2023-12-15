import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('app-settings', () => {
  /** @type {import('vue').Ref<String>} */
  const theme = ref('default');

  return { theme };
});
