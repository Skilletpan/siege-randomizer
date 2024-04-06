import { defineStore } from 'pinia';
import { computed, ref, shallowRef, watchEffect } from 'vue';

// Load data from localStorage
const local = JSON.parse(localStorage.getItem('app-settings')) || {};

export default defineStore('app-settings', () => {
  /**
   * Whether to show the app settings dialog.
   * @type {import('vue').ShallowRef<Boolean>}
   */
  const show = shallowRef(false);

  /**
   * The raw and editable app setting values.
   * @type {import('vue').Ref<{ expandNavigation: Boolean, theme: String }>}
   */
  const appSettings = ref({
    expandNavigation: Object.hasOwn(local, 'expandNavigation') ? local.expandNavigation : true,
    theme: local.theme || 'default'
  });

  /**
   * Whether to expand the navigation bar.
   * @type {import('vue').ComputedRef<Boolean>}
   */
  const expandNavigation = computed(() => appSettings.value.expandNavigation);

  /**
   * The theme to use.
   * @type {import('vue').ComputedRef<String>}
   */
  const theme = computed(() => appSettings.value.theme);

  // Store updates in browser storage
  watchEffect(() => {
    const { expandNavigation: _expandNavigation, theme: _theme } = appSettings.value;

    localStorage.setItem(
      'app-settings',
      JSON.stringify({
        expandNavigation: _expandNavigation,
        theme: _theme
      })
    );
  });

  return { show, appSettings, expandNavigation, theme };
});
