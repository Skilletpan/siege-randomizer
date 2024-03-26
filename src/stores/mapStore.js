import { defineStore } from 'pinia';
import { shallowRef } from 'vue';

import RAW_MAPS from '@/data/maps_v2.json';
import { SiegeMap } from '@/models';

const _maps = RAW_MAPS.map((map) => new SiegeMap(map));

export default defineStore('mapStore', () => {
  /** @type {import('vue').ShallowRef<SiegeMap[]>} */
  const MAPS = shallowRef(_maps);

  /**
   * Gets a single map by key.
   * 
   * @param {string} key The key of the map.
   * 
   * @returns {SiegeMap} The corresponding map instance.
   */
  function get(key) { return MAPS.value.find((map) => map.key === key); }

  /**
   * Gets a list of maps by keys.
   * 
   * @param {string[]} keys The keys of the maps.
   * 
   * @returns {SiegeMap[]} The corresponding map instances.
   */
  function map(keys) { return keys.map((key) => get(key)); }

  return {
    // State
    MAPS,

    // Methods
    get,
    map
  };
});
