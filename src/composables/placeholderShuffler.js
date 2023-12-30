import { storeToRefs } from 'pinia';
import { onBeforeUnmount, ref, toRaw, toValue, watchEffect } from 'vue';

import { Model } from '@/models';
import { useAppSettings } from '@/store';

/**
 * Shuffles through a pool of items as long as the prerequisites are fulfilled.
 * 
 * @param {() => boolean} prerequisites The prerequisites from the calling component that must be fulfilled.
 * @param {Model[]}       pool          The pool of items to shuffle from.
 * 
 * @returns {import('vue').Ref<Model>} The item that is currently picked by the shuffler.
 */
export function usePlaceholderShuffler(pool, prerequisites, duration = 5000) {
  const { animatePlaceholderCards } = storeToRefs(useAppSettings());

  // Set initial shuffler data
  const shufflerData = {
    pick: ref(Model.pickRandom(pool)),
    timer: null
  }

  /** Toggles the shuffler on or off, depending on prerequisites. */
  function toggleShuffler() {
    // Check whether placeholder shuffling should be enabled
    const canShuffle = animatePlaceholderCards.value && toValue(prerequisites);

    // Enable shuffler
    if (canShuffle && !shufflerData.timer) shufflerData.timer = setInterval(
      () => { shufflerData.pick.value = Model.pickRandom(pool, toRaw(shufflerData.pick.value)); },
      duration
    );

    // Disable shuffler
    else if (!canShuffle && shufflerData.timer) {
      clearInterval(shufflerData.timer);
      shufflerData.timer = null;
    }
  }

  // Watch shuffler prerequisites
  watchEffect(() => { toggleShuffler(); });

  // Turn off shuffler before unmounting
  onBeforeUnmount(() => { clearInterval(shufflerData.timer); });

  return shufflerData.pick;
}
