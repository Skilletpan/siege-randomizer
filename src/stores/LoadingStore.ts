import { defineStore } from 'pinia';
import { shallowRef } from 'vue';

export default defineStore('dialog', () => {
  /** Whether the loading dialog is visible. */
  const isLoading = shallowRef<boolean>(false);

  /** The title of the dialog. */
  const dialogTitle = shallowRef<string>();

  /** The title of the current step. */
  const dialogStep = shallowRef<string>();

  /**
   * Displays the dialog for the duration of a function.
   * 
   * @param runner The function to run.
   * @param title  The title of the dialog.
   * @param step   The title of the initial step.
   * 
   * @returns The result of the runner function.
   */
  async function run<R>(runner: () => Promise<R>, title: string = 'Loading…', step?: string) {
    // Set text display values
    dialogTitle.value = title;
    dialogStep.value = step;

    try {
      // Open dialog and run function
      isLoading.value = true;
      return await runner();
    } finally {
      // Close dialog
      isLoading.value = false;

      // Cleanup
      setTimeout(() => {
        dialogTitle.value = undefined;
        dialogStep.value = undefined;
      }, 300);
    }
  }

  return {
    isLoading,
    dialogTitle,
    dialogStep,

    run
  };
});
