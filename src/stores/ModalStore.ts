import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

import type { Operator } from '@/models';

export default defineStore('modal', () => {
  /** The operator to inspect. */
  const inspectOperator = ref<Operator>();

  return {
    inspectOperator
  };
});
