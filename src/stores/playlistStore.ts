import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Playlist } from '@/models';
import { PlaylistCategory } from '@/models/Playlist';
import { useLevelStore, useOperatorStore } from '@/stores';
import { AssetLoader } from '@/utils';

type PlaylistSettingsOptions = {
  canBanOperators?: boolean;
  canPickBothSides?: boolean;
  canPickDuplicateOperators?: boolean;
  disabled?: boolean;
  disabledOperators?: string[];
  enabledOperators?: string[];
}

type PlaylistCategoryOptions = {
  name: string;
  playlists?: {
    [key: string]: {
      name: string,
      levels: string[],
      settings?: PlaylistSettingsOptions
    }
  },
  subcategories?: {
    [key: string]: PlaylistCategoryOptions
  },
  settings?: PlaylistSettingsOptions
}

export default defineStore('playlistStore', () => {
  // Dependency stores
  const LevelStore = useLevelStore();
  const OperatorStore = useOperatorStore();

  /** Whether playlist data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** The collection of playlists. */
  const PLAYLISTS = ref<{ [key: string]: Playlist }>({});

  /** A list of all playlists. */
  const PLAYLIST_LIST = computed<Playlist[]>(() => Object.values(PLAYLISTS.value).map((playlist) => toRaw(playlist)));

  /** Fetches playlist data from the data source. */
  async function fetchPlaylists() {
    // Skip if playlist data has already been fetched
    if (isFetched.value) return;

    // Fetch dependency data
    await LevelStore.fetchLevels();
    await OperatorStore.fetchOperators();

    // Fetch playlist data
    const rawData = await AssetLoader.loadData<{ [key: string]: PlaylistCategoryOptions }>('playlists.json');

    /**
     * Maps raw playlist category data into playlist objects.
     * 
     * @param category The raw playlist category data.
     * @param parent   The parent category.
     */
    function mapCategory(category: PlaylistCategoryOptions, parent?: PlaylistCategory) {
      // Skip disabled categories
      if (category.settings?.disabled) return;

      const categorySettings = {
        ...category.settings,
        enabledOperators: category.settings?.enabledOperators?.map((o) => toRaw(OperatorStore.OPERATORS[o])),
        disabledOperators: category.settings?.disabledOperators?.map((o) => toRaw(OperatorStore.OPERATORS[o]))
      };

      // Create category object
      const _category = new PlaylistCategory(category.name, categorySettings, parent);

      // Create playlists in category
      if (category.playlists) {
        Object.entries(category.playlists).forEach(([playlistKey, playlist]) => {
          // Skip disabled playlists
          if (playlist.settings?.disabled) return;

          const levels = playlist.levels.map((level) => toRaw(LevelStore.LEVELS[level]));

          const playlistSettings = {
            ...playlist.settings,
            enabledOperators: playlist.settings?.enabledOperators?.map((o) => toRaw(OperatorStore.OPERATORS[o])),
            disabledOperators: playlist.settings?.disabledOperators?.map((o) => toRaw(OperatorStore.OPERATORS[o]))
          };

          PLAYLISTS.value[playlistKey] = new Playlist(
            playlistKey,
            playlist.name,
            levels,
            _category,
            playlistSettings
          );
        });
      }

      // Map subcategories
      if (category.subcategories) {
        Object.values(category.subcategories).forEach((subcategory) => mapCategory(subcategory, _category));
      }
    }

    // Map raw data to playlist objects
    Object.values(rawData).forEach((category) => mapCategory(category));

    isFetched.value = true;
    console.debug(PLAYLIST_LIST.value);
  }

  return {
    PLAYLISTS,
    PLAYLIST_LIST,

    fetchPlaylists,
    isFetched
  };
});
