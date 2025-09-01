import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

type Step = {
  title?: string;
  runner: Function;
  args?: unknown[];
};

export default defineStore('dialog', () => {
  /** Whether the loading dialog is visible. */
  const isLoading = shallowRef<boolean>(false);

  /** The title of the dialog. */
  const dialogTitle = shallowRef<string>();

  /** The queue of steps to run. */
  const queue = ref<Step[]>([]);

  /** The current step. */
  const currentStep = ref<Step>();

  /**
   * Runs all steps in the queue.
   * 
   * @param title The dialog title to display.
   */
  async function run(title: string = 'Loading…') {
    // Don't run if queue is empty
    if (!queue.value.length) {
      console.warn('Tried to run a loading dialog with an empty queue!');
      return;
    }

    try {
      // Set title and open dialog
      dialogTitle.value = title;
      isLoading.value = true;

      // Run every step in the queue
      while (queue.value.length > 0) {
        currentStep.value = queue.value.shift();

        const args = currentStep.value!.args ?? [];
        await currentStep.value!.runner(...args);
      }
    } finally {
      // Close dialog
      isLoading.value = false;

      // Cleanup
      setTimeout(() => {
        dialogTitle.value = undefined;
        currentStep.value = undefined;
      }, 300);
    }
  }

  return {
    isLoading,
    dialogTitle,
    queue,
    currentStep,

    run
  };
});
